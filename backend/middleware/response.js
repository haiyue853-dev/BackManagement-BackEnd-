const crypto = require('crypto')

module.exports = async (ctx, next) => {
  ctx.state.requestId = ctx.headers['x-request-id'] || crypto.randomUUID()

  ctx.success = (data = null, message = 'success') => {
    ctx.body = {
      code: 200,
      message,
      data,
      requestId: ctx.state.requestId
    }
  }

  ctx.error = (message = 'error', code = 500) => {
    ctx.status = code
    ctx.body = {
      code,
      message,
      data: null,
      requestId: ctx.state.requestId
    }
  }

  await next()
}
