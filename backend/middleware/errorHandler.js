module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error('服务器错误:', err.message)

    ctx.status = err.status || 500
    ctx.body = {
      code: ctx.status,
      message: err.message || '服务器错误',
      data: null
    }
  }




}