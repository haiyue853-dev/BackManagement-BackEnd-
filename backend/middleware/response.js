module.exports = async (ctx, next) => {
  ctx.success = (data = null, message = 'success') => {
    ctx.body = {
      code: 200,
      message,
      data
    }
  }

  ctx.error = (message = 'error', code = 500) => {
    ctx.body = {
      code,
      message,
      data: null
    }
  }
  await next()
}