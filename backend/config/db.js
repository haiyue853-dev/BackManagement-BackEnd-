const log4js = require('../utils/log4js')
const Sequelize = require('sequelize')

console.log('>>> Sequelize 已加载，尝试连接...')

const sequelize = new Sequelize('dev5', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
})

sequelize.authenticate()
  .then(() => {
    log4js.info('【数据库连接成功】')
  })
  .catch((err) => {
    log4js.error('【数据库连接失败】:', err.message)
  })

sequelize.sync()

module.exports = sequelize