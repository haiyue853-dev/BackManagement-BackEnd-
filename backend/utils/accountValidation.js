const ACCOUNT_ROLES = ['admin', 'editor']
const ACCOUNT_STATUS = ['active', 'disabled']

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : value
}

function validateAccountCreatePayload(payload = {}) {
  const username = normalizeText(payload.username)
  const password = normalizeText(payload.password)
  const role = normalizeText(payload.role)
  const status = normalizeText(payload.status) || 'active'

  if (!username) {
    return { valid: false, code: 400, message: 'username is required' }
  }

  if (!password) {
    return { valid: false, code: 400, message: 'password is required' }
  }

  if (password.length < 5) {
    return { valid: false, code: 400, message: 'password must be at least 5 characters' }
  }

  if (!ACCOUNT_ROLES.includes(role)) {
    return { valid: false, code: 400, message: 'role is invalid' }
  }

  if (!ACCOUNT_STATUS.includes(status)) {
    return { valid: false, code: 400, message: 'status is invalid' }
  }

  return {
    valid: true,
    data: {
      username,
      password,
      role,
      status
    }
  }
}

function validateAccountUpdatePayload(payload = {}) {
  const role = normalizeText(payload.role)
  const status = normalizeText(payload.status)

  if (!ACCOUNT_ROLES.includes(role)) {
    return { valid: false, code: 400, message: 'role is invalid' }
  }

  if (!ACCOUNT_STATUS.includes(status)) {
    return { valid: false, code: 400, message: 'status is invalid' }
  }

  return {
    valid: true,
    data: {
      role,
      status
    }
  }
}

function validateAccountPasswordPayload(payload = {}) {
  const password = normalizeText(payload.password)

  if (!password) {
    return { valid: false, code: 400, message: 'password is required' }
  }

  if (password.length < 5) {
    return { valid: false, code: 400, message: 'password must be at least 5 characters' }
  }

  return {
    valid: true,
    data: {
      password
    }
  }
}

module.exports = {
  validateAccountCreatePayload,
  validateAccountUpdatePayload,
  validateAccountPasswordPayload
}
