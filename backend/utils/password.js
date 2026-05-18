const bcrypt = require('bcryptjs')
const crypto = require('crypto')

async function hashPassword(password = '') {
  return bcrypt.hash(String(password), 10)
}

function hashLegacyPassword(password = '') {
  return crypto
    .createHash('sha256')
    .update(String(password))
    .digest('hex')
}

function isLegacyPasswordHash(passwordHash = '') {
  return /^[a-f0-9]{64}$/i.test(passwordHash)
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

module.exports = {
  hashPassword,
  hashLegacyPassword,
  isLegacyPasswordHash,
  verifyPassword
}
