const Sequelize = require('sequelize')

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
    console.log('【数据库连接成功】')
  })
  .catch((err) => {
    console.error('【数据库连接失败】:', err.message)
  })

sequelize.sync()

module.exports = sequelize