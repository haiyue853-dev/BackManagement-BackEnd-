module.exports = async (ctx, next) => {
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.error('仅管理员可访问', 403)
    return
  }

  await next()
}
