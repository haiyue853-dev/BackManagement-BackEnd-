const mallService = require('../services/mall')
const { validateMallPayload } = require('../utils/mallValidation')
const { writeAuditLog } = require('../utils/auditLog')
const { parseListQuery, buildPageResult } = require('../utils/pagination')

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
    const pagination = parseListQuery(ctx.query, ['name'])
    const result = await mallService.list(pagination)

    ctx.success(buildPageResult({
      list: result.rows.map((item) => formatMall(item)),
      count: result.count
    }, pagination))
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
      writeAuditLog(ctx, {
        module: 'mall',
        action: 'create',
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    const mall = await mallService.create(validation.data)

    writeAuditLog(ctx, {
      module: 'mall',
      action: 'create',
      targetId: mall.id,
      result: 'success'
    })

    ctx.success(formatMall(mall), '新增商品成功')
  }

  async update(ctx) {
    const { id } = ctx.params
    const mall = await mallService.getById(id)

    if (!mall) {
      writeAuditLog(ctx, {
        module: 'mall',
        action: 'update',
        targetId: Number(id),
        result: 'failed',
        detail: '商品不存在'
      })
      ctx.error('商品不存在', 404)
      return
    }

    const validation = validateMallPayload(ctx.request.body)

    if (!validation.valid) {
      writeAuditLog(ctx, {
        module: 'mall',
        action: 'update',
        targetId: mall.id,
        result: 'failed',
        detail: validation.message
      })
      ctx.error(validation.message, validation.code)
      return
    }

    await mallService.update(mall, validation.data)

    writeAuditLog(ctx, {
      module: 'mall',
      action: 'update',
      targetId: mall.id,
      result: 'success'
    })

    ctx.success(formatMall(mall), '编辑商品成功')
  }

  async remove(ctx) {
    const { id } = ctx.params
    const mall = await mallService.getById(id)

    if (!mall) {
      writeAuditLog(ctx, {
        module: 'mall',
        action: 'remove',
        targetId: Number(id),
        result: 'failed',
        detail: '商品不存在'
      })
      ctx.error('商品不存在', 404)
      return
    }

    await mallService.remove(mall)

    writeAuditLog(ctx, {
      module: 'mall',
      action: 'remove',
      targetId: mall.id,
      result: 'success'
    })

    ctx.success(null, '删除商品成功')
  }
}

module.exports = new MallController()
