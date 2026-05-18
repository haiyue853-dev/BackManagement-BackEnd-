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

module.exports = new AuthService()
