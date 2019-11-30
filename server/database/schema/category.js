const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Schema = mongoose.Schema
const Mixed = mongoose.Types.Mixed

const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movie: [{
    type: ObjectId,
    ref: 'Movie'
  }],
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

categorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createTime = this.meta.updateTime = Date.now()
  } else {
    this.meta.updateTime = Date.now()
  }
  next()
})

module.exports = mongoose.model('Category', categorySchema)
