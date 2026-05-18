const test = require('node:test')
const assert = require('node:assert/strict')
const { findDuplicateAccountUsernameIndexes } = require('../utils/accountIndexCleanup')

test('should find duplicate username indexes except the canonical username key', async () => {
  const duplicates = findDuplicateAccountUsernameIndexes([
    { Column_name: 'id', Key_name: 'PRIMARY' },
    { Column_name: 'username', Key_name: 'username' },
    { Column_name: 'username', Key_name: 'username_2' },
    { Column_name: 'username', Key_name: 'username_3' },
    { Column_name: 'role', Key_name: 'role_idx' }
  ])

  assert.deepEqual(duplicates, ['username_2', 'username_3'])
})
