function normalizeUserPayload(payload = {}) {
  const { name, age, sex, birth, addr } = payload

  return {
    name: typeof name === 'string' ? name.trim() : name,
    age,
    sex: sex === '' || typeof sex === 'undefined' ? null : Number(sex),
    birth: birth || null,
    addr: typeof addr === 'string' ? addr.trim() : addr || null
  }
}

function validateUserPayload(payload = {}) {
  const normalized = normalizeUserPayload(payload)

  if (!normalized.name) {
    return { valid: false, code: 400, message: '姓名不能为空' }
  }

  if (normalized.age === '' || normalized.age === null || typeof normalized.age === 'undefined') {
    return { valid: false, code: 400, message: '年龄不能为空' }
  }

  if (Number.isNaN(Number(normalized.age))) {
    return { valid: false, code: 400, message: '年龄必须是数字' }
  }

  normalized.age = Number(normalized.age)

  if (normalized.sex !== null && ![0, 1].includes(normalized.sex)) {
    return { valid: false, code: 400, message: '性别只能为 0 或 1' }
  }

  return {
    valid: true,
    data: normalized
  }
}

module.exports = {
  validateUserPayload
}
