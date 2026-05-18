const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')
const { Mall } = require('../models')

let server
let port
const TEST_MALL_NAME = '联调测试商品'

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

async function cleanupTestMalls() {
  await Mall.destroy({
    where: {
      name: TEST_MALL_NAME
    }
  })
}

test.before(async () => {
  await cleanupTestMalls()
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
  await cleanupTestMalls()
})

test('mall list should support keyword and unified pagination fields', async () => {
  const token = await login()

  const createResponse = await request(
    'POST',
    '/malls',
    {
      name: TEST_MALL_NAME,
      category: '数码',
      price: 1999,
      stock: 12,
      status: '上架',
      coverTag: 'new',
      desc: '联调测试商品描述'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(createResponse.status, 200)

  const listResponse = await request(
    'GET',
    `/malls?page=1&pageSize=5&keyword=${encodeURIComponent(TEST_MALL_NAME)}`,
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(listResponse.status, 200)
  assert.equal(listResponse.body.code, 200)
  assert.equal(listResponse.body.data.page, 1)
  assert.equal(listResponse.body.data.pageSize, 5)
  assert.equal(listResponse.body.data.list.some((item) => item.name === TEST_MALL_NAME), true)
})

test('mall create should return chinese validation message when status is missing', async () => {
  const token = await login()

  const response = await request(
    'POST',
    '/malls',
    {
      name: '缺少状态商品',
      category: '数码',
      price: 99,
      stock: 3
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(response.status, 400)
  assert.equal(response.body.code, 400)
  assert.equal(response.body.message, '商品状态不能为空')
  assert.ok(response.body.requestId)
})
