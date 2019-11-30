const mongoose = require('mongoose')

const Schema = mongoose.Schema
const {Mixed, ObjectId} = mongoose.Types

const movieSchema = new Schema({
  doubanId: String,
  category: [{
    type: ObjectId,
    ref: 'Category'
  }],
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  rawTitle: String,
  movieTypes: [String],
  pubDate: Date,
  year: Number,

  tags: [String],

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

movieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createTime = this.meta.updateTime = Date.now()
  } else {
    this.meta.updateTime = Date.now()
  }
  next()
})

module.exports = mongoose.model('Movie', movieSchema)
