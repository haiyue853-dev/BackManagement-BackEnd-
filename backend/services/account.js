const { Account } = require('../models')
const { Op } = require('sequelize')
const { hashPassword, verifyPassword } = require('../utils/password')

const DEFAULT_ACCOUNTS = [
  {
    username: 'admin',
    password: 'admin',
    role: 'admin',
    status: 'active'
  },
  {
    username: 'xiaoxiao',
    password: 'xiaoxiao',
    role: 'editor',
    status: 'active'
  },
  {
    username: 'chenchen',
    password: 'chenchen',
    role: 'editor',
    status: 'active'
  }
]

class AccountService {
  async ensureDefaultAccounts() {
    for (const item of DEFAULT_ACCOUNTS) {
      await Account.findOrCreate({
        where: { username: item.username },
        defaults: {
          username: item.username,
          passwordHash: hashPassword(item.password),
          role: item.role,
          status: item.status
        }
      })
    }
  }

  formatAccount(account) {
    if (!account) {
      return account
    }

    const data = typeof account.toJSON === 'function' ? account.toJSON() : account
    const { passwordHash, ...rest } = data

    return rest
  }

  async list(params = {}) {
    await this.ensureDefaultAccounts()

    const { username = '', page = 1, pageSize = 10 } = params
    const where = {}

    if (username) {
      where.username = {
        [Op.like]: `%${username}%`
      }
    }

    const limit = Number(pageSize)
    const offset = (Number(page) - 1) * limit

    return await Account.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']]
    })
  }

  async getById(id) {
    await this.ensureDefaultAccounts()
    return await Account.findByPk(id)
  }

  async getByUsername(username) {
    await this.ensureDefaultAccounts()
    return await Account.findOne({
      where: { username }
    })
  }

  async create(data) {
    await this.ensureDefaultAccounts()

    return await Account.create({
      username: data.username,
      passwordHash: hashPassword(data.password),
      role: data.role,
      status: data.status
    })
  }

  async update(account, data) {
    return await account.update({
      role: data.role,
      status: data.status
    })
  }

  async updatePassword(account, password) {
    return await account.update({
      passwordHash: hashPassword(password)
    })
  }

  async remove(account) {
    return await account.destroy()
  }

  async authenticate(username, password) {
    await this.ensureDefaultAccounts()

    const account = await Account.findOne({
      where: { username }
    })

    if (!account) {
      return null
    }

    if (account.status !== 'active') {
      return {
        success: false,
        code: 403,
        message: '账号已被禁用'
      }
    }

    if (!verifyPassword(password, account.passwordHash)) {
      return null
    }

    return {
      success: true,
      data: account
    }
  }
}

module.exports = new AccountService()
