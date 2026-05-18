const sequelize = require('../config/db')
const User = require('./user')
const Mall = require('./mall')

sequelize.sync({ alter: true })
  .then(() => {
    console.log('数据表同步成功')
  })
  .catch((err) => {
    console.error('数据表同步失败', err.message)
  })

module.exports = {
  sequelize,
  User,
  Mall
}
