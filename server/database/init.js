const mongoose = require('mongoose')
const glob = require('glob')
const {resolve} = require('path')

mongoose.Promise = global.Promise

const url = 'mongodb://localhost:27017/douban-trailer'

exports.connect = () => {
  let maxTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'production') {
      mongoose.set('debug', true)
    }
    // mongoose.set('useCreateIndex', true)
    mongoose.connect(url, {
      useNewUrlParser: true
    })
    mongoose.connection.on('disconnected', () => {
      maxTimes < 5 && mongoose.connect(url)
      maxTimes++
    })
    mongoose.connection.on('error', (err) => {
      console.log('error', err)
      reject(err)
    })
    mongoose.connection.once('connected', () => {
      console.log('mongodb connect successed')
      resolve()
    })
  })
 
}

exports.initSchema = () => {
  glob.sync(resolve(__dirname, './schema', '*.js')).forEach(require)
  // const Movie = require('./schema/movie')
  // const Category = require('./schema/category')
  // const User = require('./schema/user')
  // return {
  //   Movie,
  //   Category,
  //   User
  // }
}