function toPositiveInteger(value, fallback) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

function readKeyword(query = {}, aliases = []) {
  const keys = ['keyword', ...aliases]

  for (const key of keys) {
    const value = query[key]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

function parseListQuery(query = {}, aliases = []) {
  const page = toPositiveInteger(query.page, 1)
  const pageSize = Math.min(toPositiveInteger(query.pageSize, 10), 100)
  const keyword = readKeyword(query, aliases)

  return {
    page,
    pageSize,
    keyword
  }
}

function buildPageResult(listResult, pagination) {
  return {
    list: listResult.list,
    count: listResult.count,
    page: pagination.page,
    pageSize: pagination.pageSize
  }
}

module.exports = {
  parseListQuery,
  buildPageResult
}
