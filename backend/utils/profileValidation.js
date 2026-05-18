function normalizeProfilePayload(payload = {}) {
  const {
    username,
    role,
    avatar,
    signature,
    lastLoginTime,
    lastLoginCity
  } = payload

  return {
    username: typeof username === 'string' ? username.trim() : username,
    role: typeof role === 'string' ? role.trim() : role,
    avatar: typeof avatar === 'string' ? avatar.trim() : avatar,
    signature: typeof signature === 'string' ? signature.trim() : signature || '',
    lastLoginTime: typeof lastLoginTime === 'string' ? lastLoginTime.trim() : lastLoginTime || '',
    lastLoginCity: typeof lastLoginCity === 'string' ? lastLoginCity.trim() : lastLoginCity || ''
  }
}

function validateProfilePayload(payload = {}) {
  const normalized = normalizeProfilePayload(payload)

  if (!normalized.username) {
    return { valid: false, code: 400, message: '用户名不能为空' }
  }

  if (!normalized.role) {
    return { valid: false, code: 400, message: '角色不能为空' }
  }

  if (!normalized.avatar) {
    return { valid: false, code: 400, message: '头像标识不能为空' }
  }

  return {
    valid: true,
    data: normalized
  }
}

module.exports = {
  validateProfilePayload
}
