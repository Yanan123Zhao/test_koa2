const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/subject/'

const doubanId = '1292213'

const sleep = (time) => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch({
    // headless: false
  })
  const page = await browser.newPage()
  await page.goto(url + doubanId, {
    waitUntil: 'networkidle2'
  })
  await sleep(3000)
 
  const info = await page.evaluate(() => {
    const $ = window.$
    const trailerEle = $('.related-pic-video')
    if (trailerEle && trailerEle.length) {
      const link = trailerEle.attr('href')
      let cover = trailerEle.attr('style')
      cover = cover.replace(/background-image:url\((.*)\)/, (r, $1) => $1)
      return {
        link,
        cover
      }
    }
    return {}
    
  })
  let video = ''
  if (info.link) {
    await page.goto(info.link, {
      waitUntil: 'networkidle2'
    })
    video = await page.evaluate(() => {
      const $ = window.$
      return $('source').attr('src')
    })
  }

  await page.close()
  
  process.send({
    link: info.link,
    cover: info.cover,
    doubanId,
    video
  })
  process.exit(0)
})()