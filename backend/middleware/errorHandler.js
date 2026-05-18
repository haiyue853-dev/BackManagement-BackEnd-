const logger = require('../utils/log4js')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    logger.error({
      requestId: ctx.state.requestId,
      method: ctx.method,
      path: ctx.path,
      message: err.message,
      stack: err.stack
    })

    ctx.status = err.status || 500
    ctx.body = {
      code: ctx.status,
      message: err.message || 'Internal Server Error',
      data: null,
      requestId: ctx.state.requestId
    }
  }
}
