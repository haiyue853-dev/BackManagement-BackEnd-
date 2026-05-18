const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')

let server
let port

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method: 'GET'
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
    req.end()
  })
}

test.before(async () => {
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
})

test('health endpoint should return service and database status', async () => {
  const response = await request('/health')

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.equal(response.body.data.status, 'ok')
  assert.equal(response.body.data.database, 'connected')
  assert.equal(response.body.data.service, 'backend')
  assert.ok(response.body.data.version)
  assert.ok(response.body.data.timestamp)
  assert.ok(response.body.requestId)
})
