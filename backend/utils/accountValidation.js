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
    return { valid: false, code: 400, message: '用户名不能为空' }
  }

  if (!password) {
    return { valid: false, code: 400, message: '密码不能为空' }
  }

  if (password.length < 5) {
    return { valid: false, code: 400, message: '密码长度不能少于 5 位' }
  }

  if (!ACCOUNT_ROLES.includes(role)) {
    return { valid: false, code: 400, message: '角色不合法' }
  }

  if (!ACCOUNT_STATUS.includes(status)) {
    return { valid: false, code: 400, message: '状态不合法' }
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
    return { valid: false, code: 400, message: '角色不合法' }
  }

  if (!ACCOUNT_STATUS.includes(status)) {
    return { valid: false, code: 400, message: '状态不合法' }
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
    return { valid: false, code: 400, message: '密码不能为空' }
  }

  if (password.length < 5) {
    return { valid: false, code: 400, message: '密码长度不能少于 5 位' }
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
