const mongoose = require('mongoose')
const bcypto = require('bcrypto')

const Schema = mongoose.Schema
const Mixed = mongoose.Types.Mixed
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  email: {
    unique: true,
    type: String
  },
  password: {
    unique: true,
    type: String
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createTime: {
      type: Date,
      default: Date.now()
    },
    updateTime: {
      type: Date,
      default: Date.now()
    }
  }
})

userSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now()
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createTime = this.meta.updateTime = Date.now()
  } else {
    this.meta.updateTime = Date.now()
  }
  next()
})
// 修改密码，进行加盐加密存储
userSchema.pre('save',  function (next) {
  if (!this.isModified('password') ) return next()
  bcypto.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcypto.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

userSchema.methods = {
  comparePassword: function (_password, password) {
    return new Promise((resolve, reject) => {
      bcypto.compare(_password, password, (err, isMatch) => {
        if (err) {
          reject(err)
        } else {
          resolve(isMatch)
        }

      })
    })
  },
  incLoginAttempts: function (user) {
    return new Promise((resolve, reject) => {
      // 如果之前被锁了 现在超了锁定时间
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      } else {// 被锁住了 或者没有登录
        const updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: LOCK_TIME + Date.now()
          }
        }

        this.update(updates, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })

      }
    })
  }
}

module.exports = mongoose.model('User', userSchema)
