const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')

let server

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null

    const req = http.request({
      hostname: '127.0.0.1',
      port: 3020,
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

test.before(async () => {
  server = app.listen(3020)
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

test('admin login should return token, menuList and userInfo', async () => {
  const response = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'admin'
  })

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.ok(response.body.data.token)
  assert.ok(Array.isArray(response.body.data.menuList))
  assert.ok(response.body.data.menuList.length > 0)
  assert.equal(response.body.data.userInfo.username, 'admin')
})

test('invalid password should return 401', async () => {
  const response = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'wrong'
  })

  assert.equal(response.status, 401)
  assert.equal(response.body.code, 401)
})

test('protected API should reject requests without token', async () => {
  const response = await request('GET', '/profile')

  assert.equal(response.status, 401)
  assert.equal(response.body.code, 401)
})

test('logout should invalidate token', async () => {
  const loginResponse = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'admin'
  })

  const token = loginResponse.body.data.token

  const logoutResponse = await request(
    'POST',
    '/permission/logout',
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(logoutResponse.status, 200)
  assert.equal(logoutResponse.body.code, 200)

  const profileResponse = await request(
    'GET',
    '/profile',
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(profileResponse.status, 401)
  assert.equal(profileResponse.body.code, 401)
})
