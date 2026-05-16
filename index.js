const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const router = new Router()

router.get('/', async (ctx) => {
  ctx.body = 'Hello Koa!'
})
router.get('/api', async (ctx) => {
  ctx.body = 'Ho 22!'
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)