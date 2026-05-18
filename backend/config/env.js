require('dotenv').config({ quiet: true })

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toBoolean(value, fallback) {
  if (typeof value === 'undefined') {
    return fallback
  }

  if (typeof value === 'boolean') {
    return value
  }

  const normalized = String(value).trim().toLowerCase()

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false
  }

  return fallback
}

module.exports = {
  port: toNumber(process.env.PORT, 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
  dbSyncEnabled: toBoolean(process.env.DB_SYNC_ENABLED, true),
  dbSyncAlter: toBoolean(process.env.DB_SYNC_ALTER, false),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'dev5',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
  },
}
