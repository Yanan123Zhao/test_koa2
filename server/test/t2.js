const fs = require('fs')

setImmediate(() => {
  console.log('[immediate] 1')
  setTimeout(() => {
    console.log('[timeout] 2')
  }, 200);
})

fs.readFile('./ev-loop1.js', () => {
  console.log('fs, 1')
  setImmediate(() => {
    console.log('[immediate] 2')
  })
  setTimeout(() => {
    console.log('[timeout] 3')
  }, 0);
})



setTimeout(() => {
  console.log('[timeout] 1')
}, 10);