const fs = require('fs')

setImmediate(() => {console.log('[阶段3 Immediate] immediate 1')})
setImmediate(() => {console.log('[阶段3 Immediate] immediate 2')})
setImmediate(() => {console.log('[阶段3 Immediate] immediate 3')})

Promise.resolve()
.then(() => {
  console.log('[待进入下个阶段] promise then 1')
  setImmediate(() => {console.log('[阶段3 Immediate] promise immediate 4')})
})

fs.readFile('../qiniu.js', () => {
  console.log('[阶段2 IO] 读取文件 1')
  fs.readFile('../../package.json', () => {
    console.log('[阶段2 IO] 读取文件 2')
    setImmediate(() => {console.log('[阶段3 Immediate]  读取文件 immediate 2')})
  })
  setImmediate(() => {
    console.log('[阶段3 Immediate]  读取文件 immediate 1')
    Promise.resolve()
    .then(() => {
      console.log('[待进入下个阶段] 读取文件 immediate promise then 1')
      process.nextTick(() =>{
        console.log('[待进入下个阶段] 读取文件 immediate promise nextTick 1')
      })
    })
    .then(() => {
      console.log('[待进入下个阶段] 读取文件 immediate promise then 2')
    })
  })

  setImmediate(() => {
    console.log('[阶段3 Immediate] 2 读取文件 immediate 2')
    process.nextTick(() =>{
      console.log('[待进入下个阶段] 读取文件 immediate 2 nextTick 1')
    })
    console.log('同步读取文件中')
    var fff = fs.readFileSync('../../../../《穿越计算机的迷雾》(李忠).pdf')
    process.nextTick(() => {
      console.log('[待进入下个阶段] 同步读取文件 immediate 2 nextTick 2')
    })
  })
})

setTimeout(() => {
  console.log('[阶段1 定时器] 1')
}, 0);

setTimeout(() => {
  console.log('[阶段1 定时器] 2')
  process.nextTick(() => {
    console.log('[待进入下个阶段] nextTick 5')
  })
}, 0)

setTimeout(() => {
  console.log('[阶段1 定时器] 3')
}, 0)

process.nextTick(() => {
  console.log('[待进入下个阶段] nextTick 1')
})

process.nextTick(() => {
  console.log('[待进入下个阶段] nextTick 2')
  process.nextTick(() => {
    console.log('[待进入下个阶段] nextTick 4')
  })
})

process.nextTick(() => {
  console.log('[待进入下个阶段] nextTick 3')
})