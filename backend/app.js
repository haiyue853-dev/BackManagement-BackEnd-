const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const errorHandler = require('./middleware/errorHandler')
const response = require('./middleware/response')
const cors = require('./middleware/cors')
const auth = require('./middleware/auth')

const index = require('./routes/index')
const users = require('./routes/users')
const malls = require('./routes/malls')
const accounts = require('./routes/accounts')
const profile = require('./routes/profile')
const permission = require('./routes/permission')
const home = require('./routes/home')

require('./models')

app.use(errorHandler)
app.use(cors)
app.use(response)
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(auth)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(malls.routes(), malls.allowedMethods())
app.use(accounts.routes(), accounts.allowedMethods())
app.use(profile.routes(), profile.allowedMethods())
app.use(permission.routes(), permission.allowedMethods())
app.use(home.routes(), home.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err)
})

module.exports = app
