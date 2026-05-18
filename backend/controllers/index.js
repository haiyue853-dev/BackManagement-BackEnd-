const { sequelize } = require('../models')
const pkg = require('../package.json')

class IndexController {
  async root(ctx) {
    ctx.success({
      service: 'backend',
      version: pkg.version,
      status: 'running'
    }, '服务运行中')
  }

  async health(ctx) {
    await sequelize.authenticate()

    ctx.success({
      service: 'backend',
      version: pkg.version,
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    }, '健康检查通过')
  }
}

module.exports = new IndexController()
