const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')
const { User } = require('../models')

let server
let port
const TEST_USER_NAME = '治理测试用户'

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null

    const req = http.request({
      hostname: '127.0.0.1',
      port,
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

async function login() {
  const response = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'admin'
  })

  return response.body.data.token
}

async function cleanupTestUsers() {
  await User.destroy({
    where: {
      name: TEST_USER_NAME
    }
  })
}

test.before(async () => {
  await cleanupTestUsers()
  await app.ready
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => {
      port = instance.address().port
      resolve(instance)
    })
  })
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
  await cleanupTestUsers()
})

test('user list should support keyword and unified pagination fields', async () => {
  const token = await login()

  const createResponse = await request(
    'POST',
    '/users',
    {
      name: TEST_USER_NAME,
      age: 24,
      sex: 1,
      birth: '2001-01-01',
      addr: 'Shanghai'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(createResponse.status, 200)

  const listResponse = await request(
    'GET',
    `/users?page=1&pageSize=5&keyword=${encodeURIComponent(TEST_USER_NAME)}`,
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(listResponse.status, 200)
  assert.equal(listResponse.body.code, 200)
  assert.equal(listResponse.body.data.page, 1)
  assert.equal(listResponse.body.data.pageSize, 5)
  assert.equal(listResponse.body.data.list.some((item) => item.name === TEST_USER_NAME), true)
})

test('user create should return chinese validation message when age is missing', async () => {
  const token = await login()

  const response = await request(
    'POST',
    '/users',
    {
      name: '缺少年龄用户'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(response.status, 400)
  assert.equal(response.body.code, 400)
  assert.equal(response.body.message, '年龄不能为空')
  assert.ok(response.body.requestId)
})
