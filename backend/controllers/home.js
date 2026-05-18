const homeService = require('../services/home')

class HomeController {
  async getTableData(ctx) {
    const data = await homeService.getTableData()
    ctx.success(data)
  }

  async getCountData(ctx) {
    const data = await homeService.getCountData()
    ctx.success(data)
  }

  async getChartData(ctx) {
    const data = await homeService.getChartData()
    ctx.success(data)
  }
}

module.exports = new HomeController()
