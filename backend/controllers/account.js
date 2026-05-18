const accountService = require('../services/account')
const profileService = require('../services/profile')
const {
  validateAccountCreatePayload,
  validateAccountUpdatePayload,
  validateAccountPasswordPayload
} = require('../utils/accountValidation')

class AccountController {
  async list(ctx) {
    const { username = '', page = 1, pageSize = 10 } = ctx.query

    const result = await accountService.list({
      username,
      page,
      pageSize
    })

    ctx.success({
      list: result.rows.map((item) => accountService.formatAccount(item)),
      count: result.count
    })
  }

  async create(ctx) {
    const validation = validateAccountCreatePayload(ctx.request.body)

    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    const exists = await accountService.getByUsername(validation.data.username)

    if (exists) {
      ctx.error('account already exists', 409)
      return
    }

    const account = await accountService.create(validation.data)

    ctx.success(accountService.formatAccount(account), 'account created')
  }

  async update(ctx) {
    const { id } = ctx.params
    const account = await accountService.getById(id)

    if (!account) {
      ctx.error('account not found', 404)
      return
    }

    const validation = validateAccountUpdatePayload(ctx.request.body)

    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    await accountService.update(account, validation.data)

    ctx.success(accountService.formatAccount(account), 'account updated')
  }

  async updatePassword(ctx) {
    const { id } = ctx.params
    const account = await accountService.getById(id)

    if (!account) {
      ctx.error('account not found', 404)
      return
    }

    const validation = validateAccountPasswordPayload(ctx.request.body)

    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    await accountService.updatePassword(account, validation.data.password)

    ctx.success(null, 'password updated')
  }

  async remove(ctx) {
    const { id } = ctx.params
    const account = await accountService.getById(id)

    if (!account) {
      ctx.error('account not found', 404)
      return
    }

    if (account.username === 'admin') {
      ctx.error('default admin account cannot be deleted', 400)
      return
    }

    await accountService.remove(account)
    await profileService.removeByUsername(account.username)

    ctx.success(null, 'account deleted')
  }
}

module.exports = new AccountController()
