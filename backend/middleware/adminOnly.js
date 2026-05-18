module.exports = async (ctx, next) => {
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.error('admin permission required', 403)
    return
  }

  await next()
}
