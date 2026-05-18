const userService = require('../services/user')
const { validateUserPayload } = require('../utils/userValidation')
const { writeAuditLog } = require('../utils/auditLog')
const { parseListQuery, buildPageResult } = require('../utils/pagination')

class UserController {
  async list(ctx) {
    const pagination = parseListQuery(ctx.query, ['name'])
    const result = await userService.list(pagination)

    ctx.success(buildPageResult({
      list: result.rows,
      count: result.count
    }, pagination))
  }

  async getById(ctx) {
    const { id } = ctx.params
    const user = await userService.getById(id)

    if (!user) {
      ctx.error('用户不存在', 404)
      return
    }

    ctx.success(user)
  }

  async create(ctx) {
    const validation = validateUserPayload(ctx.request.body)

    if (!validation.valid) {
      writeAuditLog(ctx, {
        module: 'user',
        action: 'create',
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    const user = await userService.create(validation.data)

    writeAuditLog(ctx, {
      module: 'user',
      action: 'create',
      targetId: user.id,
      result: 'success'
    })

    ctx.success(user, '新增用户成功')
  }

  async update(ctx) {
    const { id } = ctx.params
    const user = await userService.getById(id)

    if (!user) {
      writeAuditLog(ctx, {
        module: 'user',
        action: 'update',
        targetId: Number(id),
        result: 'failed',
        detail: '用户不存在'
      })
      ctx.error('用户不存在', 404)
      return
    }

    const validation = validateUserPayload(ctx.request.body)

    if (!validation.valid) {
      writeAuditLog(ctx, {
        module: 'user',
        action: 'update',
        targetId: user.id,
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    await userService.update(user, validation.data)

    writeAuditLog(ctx, {
      module: 'user',
      action: 'update',
      targetId: user.id,
      result: 'success'
    })

    ctx.success(user, '编辑用户成功')
  }

  async remove(ctx) {
    const { id } = ctx.params
    const user = await userService.getById(id)

    if (!user) {
      writeAuditLog(ctx, {
        module: 'user',
        action: 'remove',
        targetId: Number(id),
        result: 'failed',
        detail: '用户不存在'
      })
      ctx.error('用户不存在', 404)
      return
    }

    await userService.remove(user)

    writeAuditLog(ctx, {
      module: 'user',
      action: 'remove',
      targetId: user.id,
      result: 'success'
    })

    ctx.success(null, '删除用户成功')
  }
}

module.exports = new UserController()
