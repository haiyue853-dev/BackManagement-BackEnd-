const { User } = require('../models')

class UserController {
  async list(ctx) {
    const users = await User.findAll()
    ctx.success(users)

  }

  async getById(ctx) {
    const { id } = ctx.params
    const user = await User.findByPk(id)
    if (!user) {
      ctx.error('用户不存在')
      return
    }
    ctx.success(user)
  }

  async create(ctx) {
    const { name, age } = ctx.request.body
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

    const user = await User.create({
      name,
      age: Number(age)
    })

    ctx.success(user, '创建成功')

  }
  async update(ctx) {
    const { id } = ctx.params
    const { name, age } = ctx.request.body

    const user = await User.findByPk(id)

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

    await user.update({
      name,
      age: Number(age)
    })

    ctx.success(user, '更新成功')
  }

  async remove(ctx) {
    const { id } = ctx.params

    const user = await User.findByPk(id)

    if (!user) {
      ctx.error('用户不存在', 404)
      return
    }

    await user.destroy()

    ctx.success(null, '删除成功')
  }

}

module.exports = new UserController()