const userService = require('../services/user')
const { validateUserPayload } = require('../utils/userValidation')

class UserController {
  async list(ctx) {
    const { name = '', page = 1, pageSize = 10 } = ctx.query

    const result = await userService.list({
      name,
      page,
      pageSize
    })

    ctx.success({
      list: result.rows,
      count: result.count
    })
  }

  async getById(ctx) {
    const { id } = ctx.params
    const user = await userService.getById(id)
    if (!user) {
      ctx.error('用户不存在')
      return
    }
    ctx.success(user)
  }

  async create(ctx) {
    const validation = validateUserPayload(ctx.request.body)
    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    const user = await userService.create(validation.data)

    ctx.success(user, '创建成功')

  }
  async update(ctx) {
    const { id } = ctx.params

    const user = await userService.getById(id)

    if (!user) {
      ctx.error('用户不存在', 404)
      return
    }

    const validation = validateUserPayload(ctx.request.body)
    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    await userService.update(user, validation.data)

    ctx.success(user, '更新成功')
  }

  async remove(ctx) {
    const { id } = ctx.params

    const user = await userService.getById(id)

    if (!user) {
      ctx.error('用户不存在', 404)
      return
    }

    await userService.remove(user)

    ctx.success(null, '删除成功')
  }

}

module.exports = new UserController()
