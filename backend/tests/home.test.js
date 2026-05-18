const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const app = require('../app')

let server
let authHeaders = {}
const PORT = 3022

function request(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'GET',
      headers
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
    const instance = app.listen(PORT, () => resolve(instance))
  })

  const loginResponse = await new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      username: 'admin',
      password: 'admin'
    })

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/permission/getMenu',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    })

    req.on('error', reject)
    req.write(payload)
    req.end()
  })

  authHeaders = {
    Authorization: `Bearer ${loginResponse.data.token}`
  }
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

test('home table API should return tableData list', async () => {
  const response = await request('/home/getTableData', authHeaders)

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.ok(Array.isArray(response.body.data.tableData))
  assert.ok(response.body.data.tableData.length > 0)
  assert.ok(Object.hasOwn(response.body.data.tableData[0], 'name'))
  assert.ok(Object.hasOwn(response.body.data.tableData[0], 'todayBuy'))
  assert.ok(Object.hasOwn(response.body.data.tableData[0], 'monthBuy'))
  assert.ok(Object.hasOwn(response.body.data.tableData[0], 'totalBuy'))
})

test('home count API should return six dashboard cards', async () => {
  const response = await request('/home/getCountData', authHeaders)

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.ok(Array.isArray(response.body.data))
  assert.equal(response.body.data.length, 6)
  assert.ok(Object.hasOwn(response.body.data[0], 'name'))
  assert.ok(Object.hasOwn(response.body.data[0], 'value'))
  assert.ok(Object.hasOwn(response.body.data[0], 'icon'))
  assert.ok(Object.hasOwn(response.body.data[0], 'color'))
})

test('home chart API should return order, user and video chart data', async () => {
  const response = await request('/home/getChartData', authHeaders)

  assert.equal(response.status, 200)
  assert.equal(response.body.code, 200)
  assert.ok(Array.isArray(response.body.data.orderData.date))
  assert.equal(response.body.data.orderData.date.length, 7)
  assert.ok(Array.isArray(response.body.data.orderData.data))
  assert.equal(response.body.data.orderData.data.length, 7)
  assert.ok(Array.isArray(response.body.data.userData))
  assert.equal(response.body.data.userData.length, 7)
  assert.ok(Array.isArray(response.body.data.videoData))
  assert.ok(response.body.data.videoData.length > 0)
})
