const { Mall } = require('../models')
const { Op } = require('sequelize')

class MallService {
  async list(params = {}) {
    const { keyword = '', page = 1, pageSize = 10 } = params

    const where = {}

    if (keyword) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`
          }
        },
        {
          category: {
            [Op.like]: `%${keyword}%`
          }
        }
      ]
    }

    const limit = Number(pageSize)
    const offset = (Number(page) - 1) * limit

    return await Mall.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']]
    })
  }

  async getById(id) {
    return await Mall.findByPk(id)
  }

  async create(data) {
    return await Mall.create(data)
  }

  async update(mall, data) {
    return await mall.update(data)
  }

  async remove(mall) {
    return await mall.destroy()
  }
}

module.exports = new MallService()
