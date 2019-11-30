setImmediate(() => {console.log('[阶段3 Immediate] immediate 1')})
setImmediate(() => {console.log('[阶段3 Immediate] immediate 2')})
setImmediate(() => {console.log('[阶段3 Immediate] immediate 3')})

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