const Koa = require('koa')
const views = require('koa-views')
const mongoose = require('mongoose')
const {resolve} = require('path')
const {connect, initSchema} = require('./database/init')
const app = new Koa()

;(async () => {
  await connect()
  initSchema()
  // require('./tasks/process')
  require('./tasks/api')
})()


app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  // ctx.type = 'text/html;charset=utf-8'
  // ctx.body = ejs.render(ejsT, {
  //   me: 'hello',
  //   you: 'world'
  // })
  await ctx.render('index', {
    me: 'hello',
    you: 'world'
  })
})

app.listen(3000)