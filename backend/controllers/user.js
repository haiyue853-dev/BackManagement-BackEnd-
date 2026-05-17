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
    const user = await User.create({ name, age })
    ctx.success(user, '创建成功')

  }
}

module.exports = new UserController()