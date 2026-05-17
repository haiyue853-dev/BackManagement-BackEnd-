const userService = require('../services/user')

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
    const { name, age, sex, birth, addr } = ctx.request.body
    if (!name) {
      ctx.error('name不能为空', 400)
      return
    }

    if (!age) {
      ctx.error('age不能为空', 400)
      return
    }

    if (isNaN(Number(age))) {
      ctx.error('age必须是数字', 400)
      return
    }

    const user = await userService.create({
      name,
      age: Number(age),
      sex,
      birth,
      addr
    })

    ctx.success(user, '创建成功')

  }
  async update(ctx) {
    const { id } = ctx.params
    const { name, age, sex, birth, addr } = ctx.request.body

    const user = await userService.getById(id)

    if (!user) {
      ctx.error('用户不存在', 404)
      return
    }

    if (!name) {
      ctx.error('name不能为空', 400)
      return
    }

    if (!age) {
      ctx.error('age不能为空', 400)
      return
    }

    if (isNaN(Number(age))) {
      ctx.error('age必须是数字', 400)
      return
    }

    await userService.update(user, {
      name,
      age: Number(age),
      sex,
      birth,
      addr
    })

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