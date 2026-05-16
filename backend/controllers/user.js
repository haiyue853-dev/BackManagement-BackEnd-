class UserController {
  async list(ctx) {
    const users = [
      { id: 1, name: '张三', age: 20 },
      { id: 2, name: '李四', age: 25 }
    ]
    ctx.success(users)
  }

  async getById(ctx) {
    const { id } = ctx.params
    ctx.success({ id, name: '用户', age: 18 })
  }

  async create(ctx) {
    const { name, age } = ctx.request.body
    ctx.success({ id: Date.now(), name, age }, '创建成功')
  }
}

module.exports = new UserController()