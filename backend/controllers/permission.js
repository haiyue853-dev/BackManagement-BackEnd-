const logger = require('../utils/log4js')
const permissionService = require('../services/permission')

class PermissionController {
  async getMenu(ctx) {
    const result = await permissionService.getMenu(ctx.request.body)

    if (!result.success) {
      logger.warn({
        requestId: ctx.state.requestId,
        action: 'login_failed',
        username: ctx.request.body?.username || ''
      })
      ctx.error(result.message, result.code)
      return
    }

    logger.info({
      requestId: ctx.state.requestId,
      action: 'login_success',
      username: result.data.userInfo.username
    })

    ctx.success(result.data, 'login success')
  }

  async logout(ctx) {
    await permissionService.logout(ctx.state.token)

    logger.info({
      requestId: ctx.state.requestId,
      action: 'logout',
      username: ctx.state.user?.username || ''
    })

    ctx.success(null, 'logout success')
  }
}

module.exports = new PermissionController()
