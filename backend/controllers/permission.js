const permissionService = require('../services/permission')

class PermissionController {
  async getMenu(ctx) {
    const result = await permissionService.getMenu(ctx.request.body)

    if (!result.success) {
      ctx.error(result.message, result.code)
      return
    }

    ctx.success(result.data, '登录成功')
  }

  async logout(ctx) {
    await permissionService.logout(ctx.state.token)
    ctx.success(null, '退出登录成功')
  }
}

module.exports = new PermissionController()
