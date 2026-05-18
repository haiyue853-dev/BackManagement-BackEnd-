function normalizeMallPayload(payload = {}) {
  const {
    name,
    category,
    price,
    stock,
    status,
    coverTag,
    desc
  } = payload

  return {
    name: typeof name === 'string' ? name.trim() : name,
    category: typeof category === 'string' ? category.trim() : category,
    price,
    stock,
    status: typeof status === 'string' ? status.trim() : status,
    coverTag: typeof coverTag === 'string' ? coverTag.trim() : coverTag || null,
    desc: typeof desc === 'string' ? desc.trim() : desc || null
  }
}

function validateMallPayload(payload = {}) {
  const normalized = normalizeMallPayload(payload)

  if (!normalized.name) {
    return { valid: false, code: 400, message: '商品名称不能为空' }
  }

  if (!normalized.category) {
    return { valid: false, code: 400, message: '商品分类不能为空' }
  }

  if (normalized.price === '' || normalized.price === null || typeof normalized.price === 'undefined') {
    return { valid: false, code: 400, message: '商品价格不能为空' }
  }

  if (Number.isNaN(Number(normalized.price))) {
    return { valid: false, code: 400, message: '商品价格必须是数字' }
  }

  if (normalized.stock === '' || normalized.stock === null || typeof normalized.stock === 'undefined') {
    return { valid: false, code: 400, message: '商品库存不能为空' }
  }

  if (Number.isNaN(Number(normalized.stock))) {
    return { valid: false, code: 400, message: '商品库存必须是数字' }
  }

  if (!Number.isInteger(Number(normalized.stock))) {
    return { valid: false, code: 400, message: '商品库存必须是整数' }
  }

  if (!normalized.status) {
    return { valid: false, code: 400, message: '商品状态不能为空' }
  }

  if (!['上架', '下架'].includes(normalized.status)) {
    return { valid: false, code: 400, message: '商品状态只能为上架或下架' }
  }

  normalized.price = Number(normalized.price)
  normalized.stock = Number(normalized.stock)

  return {
    valid: true,
    data: normalized
  }
}

module.exports = {
  validateMallPayload
}
