const authService = require('../services/auth')

const protectedPrefixes = ['/users', '/malls', '/profile', '/home', '/permission/logout']
const publicPaths = ['/permission/getMenu']

module.exports = async (ctx, next) => {
  if (publicPaths.includes(ctx.path)) {
    await next()
    return
  }

  const needAuth = protectedPrefixes.some((prefix) => ctx.path.startsWith(prefix))

  if (!needAuth) {
    await next()
    return
  }

  const authorization = ctx.headers.authorization || ''
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7).trim()
    : ''

  const session = authService.verifyToken(token)

  if (!session) {
    ctx.error('未登录或登录已失效', 401)
    return
  }

  ctx.state.user = session
  ctx.state.token = token

  await next()
}
