const test = require('node:test')
const assert = require('node:assert/strict')

test('app should expose a startup ready promise', async () => {
  const app = require('../app')

  assert.ok(app.ready)
  assert.equal(typeof app.ready.then, 'function')
})
