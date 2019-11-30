const qiniu = require('qiniu')
const nanoId = require('nanoId')

const qiniuConfig = {
  AK: '4JZLqqiSObj7j47xAZC4CXL5oXYp7JpTHkp',
  SK: 'xYuJl5_FCE5gc5XCbEynbM1vaJUad9lC2IntLSKT',

}
const bucket = 'test-koa2-douban'
const options = {
  scope: bucket
}

var mac = new qiniu.auth.digest.Mac(qiniuConfig.AK, qiniuConfig.SK)

const config  = new qiniu.conf.Config()

var putPolicy = new qiniu.rs.PutPolicy(options)

var uploadToken=putPolicy.uploadToken(mac)

// const client = new qiniu.rs.BucketManager(mac, cfg)
var formUploader = new qiniu.form_up.FormUploader(config);

const uploadFileToQiniu = async (url, key) => {
 return new Promise((resolve, reject) => {
  // client.fetch(url, bucket, key, (err, ret, info) => {
  //   if (err) {
  //     reject(err)
  //   } else {
  //     if (info.statusCode === 200) {
  //       resolve({key})
  //     } else {
  //       reject(info)
  //     }
  //   }
  // })
  formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode == 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });
 })
}

;(async () => {
  let movies = [{
    link: 'https://movie.douban.com/trailer/215564/#content',
    cover: 'https://img3.doubanio.com/img/trailer/medium/2455167430.jpg?',
    doubanId: '1292213',
    video: 'http://vt1.doubanio.com/201911172234/d83f8efd45d699295dcc587c433081f0/view/movie/M/302150564.mp4'
  }]
  movies.forEach(async (item) => {
    if (item.video && !item.key) {
      try {
        
        let videoData = await uploadFileToQiniu(item.video, nanoId() + '.mp4')
        let coverData = await uploadFileToQiniu(item.cover, nanoId() + '.png')
        item.videoKey = videoData.key
        item.coverKey = coverData.key
      } catch (err) {
        console.log('error', err)
      }
    }
  })
  
  
})()