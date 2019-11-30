const reqPromise = require('request-promise-native')
const Movie = require('../database/schema/movie.js')
const Category = require('../database/schema/category.js')

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0b2bdeda43b5688921839c8ecb20399b`
  let response = await reqPromise(url)
  try {
    response = JSON.parse(response)
    return response
  }catch (err) {
    console.log('errr', err)
    return {}
  }
}

;(async () => {
  const data = await Movie.find({
    $or: [
      {
        summary: {$exists: false}
      }, {
        summary: null
      }, {
        summary: ''
      }, {
        title: ''
      }
    ]
  })

  for (let i = 0; i < 1; i++) {
    const item = data[i]
    let res = await fetchMovie(item)
    if (res) {
      item.tags = res.tags || []
      item.summary = res.summary || ''
      item.title = res.title || ''
      item.pubDate = res.pubdates && res.pubdates[0]
      item.year = res.year
      if (res.genres) {
        item.movieTypes = res.genres
        for (let j = 0; j < res.genres.length; j++) {
          let gItem = res.genres[j]
          let type = await Category.findOne({
            name: gItem
          })

          if (!type) {
            type = new Category({
              name: gItem,
              movie: [item._id]
            })
          } else {
            if (type.movie.indexOf(item._id) === -1) {
              type.movie.push(item._id)
            }
          }
          await type.save()
          if (item.category.indexOf(type._id) === -1) {
            item.category.push(type._id)
          }
        }
      }
      item.tags = res.tags
      console.log('items', item)
      await item.save()
    }
  }
})()