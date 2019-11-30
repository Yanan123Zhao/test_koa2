const cp = require('child_process')
const {resolve} = require('path')
const Movie = require('../database/schema/movie')

// console.log('vvvv', Movie)

;(async () =>  {
  const script = resolve(__dirname, '../crawler/trailer-list')
  // console.log('scripts', script)
  const child = cp.fork(script, [])

  child.on('error', (err) => {
    console.log('Error', err)
  })

  child.on('exit', (code) => {
    if (code !== 0) {
      throw new Error('child process exit eror', code)
    }
  })

  child.on('message', (data) => {
    const {result} = data
    console.log('rrrrrrrrrrrrr', result)
    result.forEach(async (item) => {
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })

      if (!movie) {
        movie = new Movie(item)
        const isSave = await movie.save()
        // console.log('save', isSave)
      }
    })
  })
})()