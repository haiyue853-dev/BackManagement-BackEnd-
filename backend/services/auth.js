const crypto = require('crypto')

class AuthService {
  constructor() {
    this.tokenStore = new Map()
  }

  issueToken(userInfo = {}) {
    const token = crypto.randomUUID()

    this.tokenStore.set(token, {
      ...userInfo,
      issuedAt: Date.now()
    })

    return token
  }

  verifyToken(token) {
    if (!token) {
      return null
    }

    return this.tokenStore.get(token) || null
  }

  revokeToken(token) {
    if (!token) {
      return false
    }

    return this.tokenStore.delete(token)
  }
}

module.exports = new AuthService()
