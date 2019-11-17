const Koa = require('koa')
const views = require('koa-views')
const {resolve} = require('path')
const app = new Koa()

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