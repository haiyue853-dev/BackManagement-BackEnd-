const accountService = require('../services/account')
const profileService = require('../services/profile')
const { writeAuditLog } = require('../utils/auditLog')
const { parseListQuery, buildPageResult } = require('../utils/pagination')
const {
  validateAccountCreatePayload,
  validateAccountUpdatePayload,
  validateAccountPasswordPayload
} = require('../utils/accountValidation')

class AccountController {
  async list(ctx) {
    const pagination = parseListQuery(ctx.query, ['username'])
    const result = await accountService.list(pagination)

    ctx.success(buildPageResult({
      list: result.rows.map((item) => accountService.formatAccount(item)),
      count: result.count
    }, pagination))
  }

  async create(ctx) {
    const validation = validateAccountCreatePayload(ctx.request.body)

    if (!validation.valid) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'create',
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    const exists = await accountService.getByUsername(validation.data.username)

    if (exists) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'create',
        result: 'failed',
        detail: '账号已存在'
      })
      ctx.error('账号已存在', 409)
      return
    }

    const account = await accountService.create(validation.data)

    writeAuditLog(ctx, {
      module: 'account',
      action: 'create',
      targetId: account.id,
      result: 'success'
    })

    ctx.success(accountService.formatAccount(account), '账号创建成功')
  }

  async update(ctx) {
    const { id } = ctx.params
    const account = await accountService.getById(id)

    if (!account) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'update',
        targetId: Number(id),
        result: 'failed',
        detail: '账号不存在'
      })
      ctx.error('账号不存在', 404)
      return
    }

    const validation = validateAccountUpdatePayload(ctx.request.body)

    if (!validation.valid) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'update',
        targetId: account.id,
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    if (
      account.username === 'admin' &&
      (validation.data.role !== 'admin' || validation.data.status !== 'active')
    ) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'update',
        targetId: account.id,
        result: 'failed',
        detail: '默认管理员账号不能被禁用或降级'
      })
      ctx.error('默认管理员账号不能被禁用或降级', 400)
      return
    }

    await accountService.update(account, validation.data)

    writeAuditLog(ctx, {
      module: 'account',
      action: 'update',
      targetId: account.id,
      result: 'success'
    })

    ctx.success(accountService.formatAccount(account), '账号更新成功')
  }

  async updatePassword(ctx) {
    const { id } = ctx.params
    const account = await accountService.getById(id)

    if (!account) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'update_password',
        targetId: Number(id),
        result: 'failed',
        detail: '账号不存在'
      })
      ctx.error('账号不存在', 404)
      return
    }

    const validation = validateAccountPasswordPayload(ctx.request.body)

    if (!validation.valid) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'update_password',
        targetId: account.id,
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    await accountService.updatePassword(account, validation.data.password)

    writeAuditLog(ctx, {
      module: 'account',
      action: 'update_password',
      targetId: account.id,
      result: 'success'
    })

    ctx.success(null, '密码重置成功')
  }

  async remove(ctx) {
    const { id } = ctx.params
    const account = await accountService.getById(id)

    if (!account) {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'remove',
        targetId: Number(id),
        result: 'failed',
        detail: '账号不存在'
      })
      ctx.error('账号不存在', 404)
      return
    }

    if (account.username === 'admin') {
      writeAuditLog(ctx, {
        module: 'account',
        action: 'remove',
        targetId: account.id,
        result: 'failed',
        detail: '默认管理员账号不能删除'
      })
      ctx.error('默认管理员账号不能删除', 400)
      return
    }

    await accountService.remove(account)
    await profileService.removeByUsername(account.username)

    writeAuditLog(ctx, {
      module: 'account',
      action: 'remove',
      targetId: account.id,
      result: 'success'
    })

    ctx.success(null, '账号删除成功')
  }
}

module.exports = new AccountController()
