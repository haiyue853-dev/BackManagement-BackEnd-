require('dotenv').config({ quiet: true })

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

module.exports = {
  port: toNumber(process.env.PORT, 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'dev5',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
  },
}
