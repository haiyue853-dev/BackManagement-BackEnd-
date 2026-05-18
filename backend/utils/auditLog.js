const logger = require('./log4js')

function writeAuditLog(ctx, payload = {}) {
  try {
    logger.audit({
      requestId: ctx.state.requestId,
      operator: ctx.state.user?.username || 'system',
      role: ctx.state.user?.role || '',
      module: payload.module || '',
      action: payload.action || '',
      targetId: payload.targetId ?? null,
      result: payload.result || 'success',
      detail: payload.detail || ''
    })
  } catch (error) {
    logger.warn({
      requestId: ctx.state.requestId,
      action: 'audit_log_failed',
      message: error.message
    })
  }
}

module.exports = {
  writeAuditLog
}
