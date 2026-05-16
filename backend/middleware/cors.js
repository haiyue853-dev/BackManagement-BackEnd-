module.exports = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin') || '*')
  ctx.set('Vary', 'Origin')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With')
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

  if (ctx.method === 'OPTIONS') {
    ctx.status = 204
    return
  }

  await next()
}
