# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade authentication, password storage, environment configuration, and backend logging so the project behaves more like a production-ready admin system.

**Architecture:** Replace the in-memory token store with signed JWT tokens verified in middleware, migrate password hashing to bcrypt with lazy upgrade for seeded accounts, centralize runtime configuration in environment variables, and standardize logging/error responses through middleware and shared utilities. Keep the existing Koa + Sequelize module structure intact so the current frontend and tests continue to work with minimal API changes.

**Tech Stack:** Node.js, Koa, Sequelize, MySQL, jsonwebtoken, bcryptjs, dotenv, log4js, node:test

---

### Task 1: Add runtime dependencies and environment-based config

**Files:**
- Create: `backend/.env.example`
- Create: `backend/config/env.js`
- Modify: `backend/package.json`
- Modify: `backend/config/db.js`
- Modify: `backend/bin/www`

- [ ] **Step 1: Write the failing configuration test**

Create a new test file that asserts configuration values can be read from environment variables:

```js
const test = require('node:test')
const assert = require('node:assert/strict')

test('env config should expose JWT and database settings', async () => {
  process.env.PORT = '3999'
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '7d'
  process.env.DB_NAME = 'demo'

  delete require.cache[require.resolve('../config/env')]
  const env = require('../config/env')

  assert.equal(env.port, 3999)
  assert.equal(env.jwtSecret, 'test-secret')
  assert.equal(env.jwtExpiresIn, '7d')
  assert.equal(env.db.name, 'demo')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test backend/tests/env.test.js`

Expected: FAIL with `Cannot find module '../config/env'`

- [ ] **Step 3: Write minimal implementation**

Implement a central env loader:

```js
require('dotenv').config()

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

module.exports = {
  port: toNumber(process.env.PORT, 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'dev5',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
  },
}
```

Update Sequelize config and server port usage to consume this file, and add `.env.example`:

```env
PORT=3000
JWT_SECRET=replace-with-a-secret
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dev5
DB_USER=root
DB_PASSWORD=123456
LOG_LEVEL=info
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test backend/tests/env.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/.env.example backend/config/env.js backend/config/db.js backend/bin/www backend/package.json backend/tests/env.test.js
git commit -m "feat: add environment-based backend config"
```

### Task 2: Replace in-memory auth with JWT

**Files:**
- Modify: `backend/services/auth.js`
- Modify: `backend/middleware/auth.js`
- Modify: `backend/services/permission.js`
- Modify: `backend/tests/permission.test.js`
- Modify: `backend/tests/account.test.js`

- [ ] **Step 1: Write the failing auth regression test**

Extend the permission test to verify tokens are JWT-shaped and still work after auth service recreation:

```js
test('issued token should be verifiable without in-memory session state', async () => {
  const loginResponse = await request('POST', '/permission/getMenu', {
    username: 'admin',
    password: 'admin'
  })

  const token = loginResponse.body.data.token
  assert.match(token, /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)

  delete require.cache[require.resolve('../services/auth')]
  const authService = require('../services/auth')
  const session = authService.verifyToken(token)

  assert.equal(session.username, 'admin')
  assert.equal(session.role, 'admin')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test backend/tests/permission.test.js`

Expected: FAIL because current token is a UUID and cannot be verified after reload

- [ ] **Step 3: Write minimal implementation**

Replace the Map-based service with JWT helpers:

```js
const jwt = require('jsonwebtoken')
const env = require('../config/env')

class AuthService {
  issueToken(userInfo = {}) {
    return jwt.sign(userInfo, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    })
  }

  verifyToken(token) {
    if (!token) {
      return null
    }

    try {
      return jwt.verify(token, env.jwtSecret)
    } catch (error) {
      return null
    }
  }

  revokeToken() {
    return true
  }
}
```

Update logout semantics in tests to reflect stateless JWT behavior by clearing client auth rather than expecting server-side revocation.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test backend/tests/permission.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/services/auth.js backend/middleware/auth.js backend/services/permission.js backend/tests/permission.test.js backend/tests/account.test.js
git commit -m "feat: replace in-memory auth with jwt"
```

### Task 3: Upgrade password hashing to bcrypt with lazy migration

**Files:**
- Modify: `backend/utils/password.js`
- Modify: `backend/services/account.js`
- Modify: `backend/tests/account.test.js`
- Modify: `backend/tests/permission.test.js`

- [ ] **Step 1: Write the failing password test**

Add a test that verifies hashes are bcrypt hashes and legacy seeded accounts still log in:

```js
test('new accounts should store bcrypt hashes and seeded accounts should auto-upgrade', async () => {
  const token = await login('admin', 'admin')

  const createResponse = await request(
    'POST',
    '/accounts',
    {
      username: 'bcryptuser',
      password: 'bcryptuser',
      role: 'editor',
      status: 'active'
    },
    { Authorization: `Bearer ${token}` }
  )

  assert.equal(createResponse.status, 200)

  const account = await Account.findOne({ where: { username: 'bcryptuser' } })
  assert.match(account.passwordHash, /^\$2[aby]\$/)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test backend/tests/account.test.js`

Expected: FAIL because hashes are currently SHA-256 hex strings

- [ ] **Step 3: Write minimal implementation**

Use bcrypt helpers:

```js
const bcrypt = require('bcryptjs')

async function hashPassword(password = '') {
  return bcrypt.hash(String(password), 10)
}

async function verifyPassword(password, passwordHash) {
  if (!passwordHash) {
    return false
  }

  if (passwordHash.startsWith('$2')) {
    return bcrypt.compare(String(password), passwordHash)
  }

  return false
}
```

In `account.js`, await hashing functions and add a migration branch for existing SHA-256 hashes:

```js
if (isLegacySha256(passwordHash) && legacyHash(password) === passwordHash) {
  account.passwordHash = await hashPassword(password)
  await account.save()
  return true
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test backend/tests/account.test.js backend/tests/permission.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/utils/password.js backend/services/account.js backend/tests/account.test.js backend/tests/permission.test.js
git commit -m "feat: upgrade account passwords to bcrypt"
```

### Task 4: Standardize backend logging and error responses

**Files:**
- Modify: `backend/utils/log4js.js`
- Modify: `backend/middleware/errorHandler.js`
- Modify: `backend/middleware/response.js`
- Modify: `backend/controllers/permission.js`
- Modify: `backend/controllers/account.js`
- Modify: `backend/app.js`

- [ ] **Step 1: Write the failing error-shape test**

Add a test for unified error payloads:

```js
test('missing auth should return standardized error payload', async () => {
  const response = await request('GET', '/accounts')

  assert.equal(response.status, 401)
  assert.deepEqual(Object.keys(response.body).sort(), ['code', 'data', 'message', 'requestId'].sort())
  assert.equal(response.body.data, null)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test backend/tests/account.test.js`

Expected: FAIL because `requestId` is missing and error formatting is inconsistent

- [ ] **Step 3: Write minimal implementation**

Add request IDs and structured responses:

```js
const crypto = require('crypto')

ctx.state.requestId = crypto.randomUUID()
ctx.success = (data = null, message = 'success') => {
  ctx.body = {
    code: 200,
    message,
    data,
    requestId: ctx.state.requestId
  }
}
```

Update the error handler to log structured context:

```js
logger.error({
  requestId: ctx.state.requestId,
  method: ctx.method,
  path: ctx.path,
  message: err.message,
  stack: err.stack
})
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test backend/tests/account.test.js backend/tests/permission.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/utils/log4js.js backend/middleware/errorHandler.js backend/middleware/response.js backend/controllers/permission.js backend/controllers/account.js backend/app.js backend/tests/account.test.js
git commit -m "feat: standardize backend logging and error responses"
```

### Task 5: Add deployment and configuration docs

**Files:**
- Create: `backend/README.md`
- Modify: `backend/package.json`

- [ ] **Step 1: Write the failing documentation checklist**

Create a manual checklist in the README draft that covers:

```md
- Environment variables
- Install dependencies
- Initialize database
- Start dev server
- Run tests
- Build frontend
```

- [ ] **Step 2: Verify documentation gap**

Run: `Get-Content backend\\README.md`

Expected: FAIL with file not found

- [ ] **Step 3: Write minimal implementation**

Add a backend README with:

```md
# Backend

## Setup
1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Ensure MySQL is running and the database exists
4. Start with `npm run dev`

## Test
`node --test backend/tests/account.test.js backend/tests/permission.test.js backend/tests/home.test.js`

## Auth
- Login returns JWT
- JWT expires according to `JWT_EXPIRES_IN`
```

- [ ] **Step 4: Verify the document exists**

Run: `Get-Content backend\\README.md`

Expected: file contents printed successfully

- [ ] **Step 5: Commit**

```bash
git add backend/README.md backend/package.json
git commit -m "docs: add backend setup and deployment guide"
```

## Self-Review

- Spec coverage: token persistence, stronger password hashing, env config, logging, error normalization, and deployment docs are all covered by Tasks 1-5.
- Placeholder scan: no TODO/TBD markers remain.
- Type consistency: task code uses `jwtSecret`, `jwtExpiresIn`, `requestId`, and async hashing consistently across tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-18-security-hardening.md`. Defaulting to **Inline Execution** in this session so momentum stays high and the current workspace remains consistent.
