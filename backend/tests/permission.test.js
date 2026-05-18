const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')

let server
const PORT = 3020

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

test.before(async () => {
  await app.ready
  server = await new Promise((resolve) => {
    const instance = app.listen(PORT, () => resolve(instance))
  })
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

test('admin login should return jwt token, menuList and userInfo', async () => {
  const response = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'admin'
  })

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.ok(response.body.requestId)
  assert.match(response.body.data.token, /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
  assert.ok(Array.isArray(response.body.data.menuList))
  assert.ok(response.body.data.menuList.length > 0)
  assert.equal(response.body.data.userInfo.username, 'admin')
  assert.equal(
    response.body.data.menuList.some((item) => item.name === 'account'),
    true
  )
})

test('issued token should be verifiable without in-memory session state', async () => {
  const response = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'admin'
  })

  delete require.cache[require.resolve('../services/auth')]
  const authService = require('../services/auth')
  const session = authService.verifyToken(response.body.data.token)

  assert.equal(session.username, 'admin')
  assert.equal(session.role, 'admin')
})

test('invalid password should return 401', async () => {
  const response = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'wrong'
  })

  assert.equal(response.status, 401)
  assert.equal(response.body.code, 401)
  assert.ok(response.body.requestId)
})

test('protected API should reject requests without token', async () => {
  const response = await request('GET', '/profile')

  assert.equal(response.status, 401)
  assert.equal(response.body.code, 401)
  assert.ok(response.body.requestId)
})

test('logout should return success payload', async () => {
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
  assert.ok(logoutResponse.body.requestId)
})

test('xiaoxiao login should read its own profile data and should not see account menu', async () => {
  const loginResponse = await request('POST', '/permission/getMenu', {
    username: 'xiaoxiao',
    password: 'xiaoxiao'
  })

  assert.equal(loginResponse.status, 200)
  assert.equal(loginResponse.body.data.userInfo.username, 'xiaoxiao')
  assert.equal(
    loginResponse.body.data.menuList.some((item) => item.name === 'account'),
    false
  )

  const token = loginResponse.body.data.token
  const profileResponse = await request(
    'GET',
    '/profile',
    null,
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(profileResponse.status, 200)
  assert.equal(profileResponse.body.code, 200)
  assert.equal(profileResponse.body.data.username, 'xiaoxiao')
  assert.ok(profileResponse.body.data.role)
  assert.ok(profileResponse.body.requestId)
})

test('chenchen database account should be able to log in', async () => {
  const loginResponse = await request('POST', '/permission/getMenu', {
    username: 'chenchen',
    password: 'chenchen'
  })

  assert.equal(loginResponse.status, 200)
  assert.equal(loginResponse.body.code, 200)
  assert.equal(loginResponse.body.data.userInfo.username, 'chenchen')
  assert.ok(loginResponse.body.data.userInfo.role)
  assert.ok(Array.isArray(loginResponse.body.data.menuList))
  assert.ok(loginResponse.body.data.menuList.length > 0)
})
