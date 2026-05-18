const sequelize = require('../config/db')
const { findDuplicateAccountUsernameIndexes } = require('../utils/accountIndexCleanup')

async function repairAccountIndexes() {
  const [indexRows] = await sequelize.query('SHOW INDEX FROM accounts')
  const duplicateIndexes = findDuplicateAccountUsernameIndexes(indexRows)

  if (duplicateIndexes.length === 0) {
    console.log('accounts 表没有重复 username 索引，无需修复')
    return
  }

  for (const indexName of duplicateIndexes) {
    await sequelize.query(`ALTER TABLE accounts DROP INDEX \`${indexName}\``)
    console.log(`已删除重复索引: ${indexName}`)
  }

  console.log(`重复索引清理完成，共删除 ${duplicateIndexes.length} 个索引`)
}

repairAccountIndexes()
  .catch((error) => {
    console.error('清理 accounts 重复索引失败:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await sequelize.close()
  })
