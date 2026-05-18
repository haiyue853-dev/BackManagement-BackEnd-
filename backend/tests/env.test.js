const test = require('node:test')
const assert = require('node:assert/strict')

test('env config should expose JWT and database settings', async () => {
  process.env.PORT = '3999'
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '7d'
  process.env.DB_NAME = 'demo'
  process.env.DB_SYNC_ENABLED = 'true'
  process.env.DB_SYNC_ALTER = 'false'

  delete require.cache[require.resolve('../config/env')]
  const env = require('../config/env')

  assert.equal(env.port, 3999)
  assert.equal(env.jwtSecret, 'test-secret')
  assert.equal(env.jwtExpiresIn, '7d')
  assert.equal(env.db.name, 'demo')
  assert.equal(env.dbSyncEnabled, true)
  assert.equal(env.dbSyncAlter, false)
})
