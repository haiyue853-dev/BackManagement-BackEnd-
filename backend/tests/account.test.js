const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')
const { Account, Profile } = require('../models')

let server
const PORT = 3021

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      } : headers
    }, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: JSON.parse(data)
        })
      })
    })

    req.on('error', reject)

    if (payload) {
      req.write(payload)
    }

    req.end()
  })
}

async function login(username, password) {
  const response = await request('POST', '/permission/getMenu', {
    username,
    password
  })

  return response.body.data.token
}

async function cleanupTestAccount() {
  await Profile.destroy({
    where: { username: 'testeditor' }
  })

  await Account.destroy({
    where: { username: 'testeditor' }
  })
}

test.before(async () => {
  await cleanupTestAccount()
  await app.ready
  server = await new Promise((resolve) => {
    const instance = app.listen(PORT, () => resolve(instance))
  })
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
  await cleanupTestAccount()
})

test('editor should not be allowed to access account list', async () => {
  const token = await login('xiaoxiao', 'xiaoxiao')

  const response = await request(
    'GET',
    '/accounts',
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(response.status, 403)
  assert.equal(response.body.code, 403)
  assert.equal(response.body.message, '当前账号没有管理员权限')
  assert.ok(response.body.requestId)
})

test('admin should list accounts with unified pagination fields', async () => {
  const token = await login('admin', 'admin')

  const response = await request(
    'GET',
    '/accounts?page=1&pageSize=10&keyword=admin',
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.ok(response.body.requestId)
  assert.ok(Array.isArray(response.body.data.list))
  assert.equal(response.body.data.page, 1)
  assert.equal(response.body.data.pageSize, 10)
  assert.equal(response.body.data.list.some((item) => 'passwordHash' in item), false)
  assert.equal(response.body.data.list.some((item) => item.username === 'admin'), true)
})

test('admin should create account and store password with bcrypt hash', async () => {
  const token = await login('admin', 'admin')

  const createResponse = await request(
    'POST',
    '/accounts',
    {
      username: 'testeditor',
      password: 'testeditor',
      role: 'editor',
      status: 'active'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(createResponse.status, 200)
  assert.equal(createResponse.body.code, 200)
  assert.equal(createResponse.body.data.username, 'testeditor')

  const account = await Account.findOne({
    where: { username: 'testeditor' }
  })

  assert.match(account.passwordHash, /^\$2[aby]\$/)

  const loginResponse = await request('POST', '/permission/getMenu', {
    username: 'testeditor',
    password: 'testeditor'
  })

  assert.equal(loginResponse.status, 200)
  assert.equal(loginResponse.body.code, 200)
  assert.equal(loginResponse.body.data.userInfo.username, 'testeditor')

  const profileToken = loginResponse.body.data.token
  const profileResponse = await request(
    'GET',
    '/profile',
    null,
    { Authorization: `Bearer ${profileToken}` }
  )

  assert.equal(profileResponse.status, 200)
  assert.equal(profileResponse.body.code, 200)
  assert.equal(profileResponse.body.data.username, 'testeditor')
})

test('admin should disable account and disabled account should not be able to log in', async () => {
  const token = await login('admin', 'admin')

  const listResponse = await request(
    'GET',
    '/accounts?page=1&pageSize=20&keyword=testeditor',
    null,
    { Authorization: `Bearer ${token}` }
  )

  const target = listResponse.body.data.list.find((item) => item.username === 'testeditor')

  const updateResponse = await request(
    'PUT',
    `/accounts/${target.id}`,
    {
      role: 'editor',
      status: 'disabled'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(updateResponse.status, 200)
  assert.equal(updateResponse.body.code, 200)
  assert.equal(updateResponse.body.data.status, 'disabled')

  const loginResponse = await request('POST', '/permission/getMenu', {
    username: 'testeditor',
    password: 'testeditor'
  })

  assert.equal(loginResponse.status, 403)
  assert.equal(loginResponse.body.code, 403)
  assert.equal(loginResponse.body.message, '账号已被停用')
})

test('admin should reset account password and delete account', async () => {
  const token = await login('admin', 'admin')

  const listResponse = await request(
    'GET',
    '/accounts?page=1&pageSize=20&keyword=testeditor',
    null,
    { Authorization: `Bearer ${token}` }
  )

  const target = listResponse.body.data.list.find((item) => item.username === 'testeditor')

  const passwordResponse = await request(
    'PUT',
    `/accounts/${target.id}/password`,
    {
      password: 'newpassword'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(passwordResponse.status, 200)
  assert.equal(passwordResponse.body.code, 200)

  const activeResponse = await request(
    'PUT',
    `/accounts/${target.id}`,
    {
      role: 'editor',
      status: 'active'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(activeResponse.status, 200)
  assert.equal(activeResponse.body.code, 200)

  const newLoginResponse = await request('POST', '/permission/getMenu', {
    username: 'testeditor',
    password: 'newpassword'
  })

  assert.equal(newLoginResponse.status, 200)
  assert.equal(newLoginResponse.body.code, 200)

  const deleteResponse = await request(
    'DELETE',
    `/accounts/${target.id}`,
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(deleteResponse.status, 200)
  assert.equal(deleteResponse.body.code, 200)
})

test('default admin account should not be disabled or downgraded', async () => {
  const token = await login('admin', 'admin')

  const listResponse = await request(
    'GET',
    '/accounts?page=1&pageSize=20&keyword=admin',
    null,
    { Authorization: `Bearer ${token}` }
  )

  const adminAccount = listResponse.body.data.list.find((item) => item.username === 'admin')

  const updateResponse = await request(
    'PUT',
    `/accounts/${adminAccount.id}`,
    {
      role: 'editor',
      status: 'disabled'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(updateResponse.status, 400)
  assert.equal(updateResponse.body.code, 400)
  assert.equal(updateResponse.body.message, '默认管理员账号不能降级或停用')
})
