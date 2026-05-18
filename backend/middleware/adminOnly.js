module.exports = async (ctx, next) => {
  if (!ctx.state.user || ctx.state.user.role !== 'admin') {
    ctx.error('当前账号没有管理员权限', 403)
    return
  }

  await next()
}
