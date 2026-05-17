const { User } = require('../models')
const { Op } = require('sequelize')

class UserService {
  async list(params = {}) {
    const { name = '', page = 1, pageSize = 10 } = params

    const where = {}

    if (name) {
      where.name = {
        [Op.like]: `%${name}%`
      }
    }
    const limit = Number(pageSize)
    const offset = (Number(page) - 1) * limit

    return await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']]
    })
  }

  async getById(id) {
    return await User.findByPk(id)
  }

  async create(data) {
    return await User.create(data)
  }

  async update(user, data) {
    return await user.update(data)
  }

  async remove(user) {
    return await user.destroy()
  }
}

module.exports = new UserService()