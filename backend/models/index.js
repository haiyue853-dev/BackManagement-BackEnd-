const env = require('../config/env')
const sequelize = require('../config/db')
const Account = require('./account')
const User = require('./user')
const Mall = require('./mall')
const Profile = require('./profile')

async function syncDatabase() {
  if (!env.dbSyncEnabled) {
    console.log('数据库自动同步已关闭')
    return false
  }

  const syncOptions = env.dbSyncAlter ? { alter: true } : undefined

  await sequelize.sync(syncOptions)

  console.log(
    env.dbSyncAlter
      ? '数据库结构同步成功（alter 模式）'
      : '数据库结构检查成功（safe sync 模式）'
  )

  return true
}

const ready = syncDatabase().catch((err) => {
  console.error('数据库同步失败', err.message)
  throw err
})

module.exports = {
  sequelize,
  Account,
  User,
  Mall,
  Profile,
  syncDatabase,
  ready
}
