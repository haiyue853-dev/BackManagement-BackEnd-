const mallService = require('../services/mall')
const { validateMallPayload } = require('../utils/mallValidation')

function formatMall(item) {
  if (!item) {
    return item
  }

  const data = typeof item.toJSON === 'function' ? item.toJSON() : item

  return {
    ...data,
    updateTime: data.updatedAt
  }
}

class MallController {
  async list(ctx) {
    const { name = '', page = 1, pageSize = 10 } = ctx.query

    const result = await mallService.list({
      name,
      page,
      pageSize
    })

    ctx.success({
      list: result.rows.map((item) => formatMall(item)),
      count: result.count
    })
  }

  async getById(ctx) {
    const { id } = ctx.params
    const mall = await mallService.getById(id)

    if (!mall) {
      ctx.error('商品不存在', 404)
      return
    }

    ctx.success(formatMall(mall))
  }

  async create(ctx) {
    const validation = validateMallPayload(ctx.request.body)

    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    const mall = await mallService.create(validation.data)

    ctx.success(formatMall(mall), '新增商品成功')
  }

  async update(ctx) {
    const { id } = ctx.params
    const mall = await mallService.getById(id)

    if (!mall) {
      ctx.error('商品不存在', 404)
      return
    }

    const validation = validateMallPayload(ctx.request.body)

    if (!validation.valid) {
      ctx.error(validation.message, validation.code)
      return
    }

    await mallService.update(mall, validation.data)

    ctx.success(formatMall(mall), '编辑商品成功')
  }

  async remove(ctx) {
    const { id } = ctx.params
    const mall = await mallService.getById(id)

    if (!mall) {
      ctx.error('商品不存在', 404)
      return
    }

    await mallService.remove(mall)

    ctx.success(null, '删除商品成功')
  }
}

module.exports = new MallController()
