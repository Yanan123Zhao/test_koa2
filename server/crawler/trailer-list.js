const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=U&range=0,10&tags=&playable=1'

const times = 1

const sleep = (time) => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  await sleep(3000)
  await page.waitForSelector('.more')
  for (let i = 0; i < times; i++) {
    await sleep(3000)
    await page.click('.more')
  }
  
  const result = await page.evaluate(() => {
    const $ = window.$
    const resultDate = []
    const items = $('.list-wp a')
    if (items.length) {
      items.each((index, it) => {
        const item = $(it)
        const doubanId = $(item).find('div').data('id')
        const image = $(item).find('img').attr('src')
        const title = $(item).find('.title').text()
        const rate = Number($(item).find('.rate').text())
        resultDate.push({
          doubanId,
          image,
          title,
          rate
        })
      }) 
    }
    return resultDate
  })

  await page.close()
  
  process.send({
    result
  })
  process.exit(0)
  
  // console.log('result', result)
})()