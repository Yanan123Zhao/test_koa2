const cp = require('child_process')
const {resolve} = require('path')

;(async () =>  {
  const script = resolve(__dirname, '../crawler/trailer')
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
    console.log('result', data)
  })

})()