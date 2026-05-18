const { User, Mall } = require('../models')

const fallbackBrands = ['oppo', 'vivo', '苹果', '小米', '华为', '一加']

const cardMeta = [
  { name: '今日支付订单', icon: 'SuccessFilled', color: '#2ec7c9' },
  { name: '今日收藏订单', icon: 'StarFilled', color: '#ffb980' },
  { name: '今日未支付订单', icon: 'GoodsFilled', color: '#5ab1ef' },
  { name: '本月支付订单', icon: 'SuccessFilled', color: '#2ec7c9' },
  { name: '本月收藏订单', icon: 'StarFilled', color: '#ffb980' },
  { name: '本月未支付订单', icon: 'GoodsFilled', color: '#5ab1ef' }
]

class HomeService {
  async getBaseStats() {
    const [userCount, malls] = await Promise.all([
      User.count(),
      Mall.findAll({ order: [['id', 'DESC']] })
    ])

    const totalStock = malls.reduce((sum, item) => sum + Number(item.stock || 0), 0)
    const totalValue = malls.reduce((sum, item) => sum + Number(item.price || 0), 0)
    const brandNames = malls.length
      ? malls.slice(0, 6).map((item) => item.name)
      : fallbackBrands

    return {
      userCount,
      malls,
      totalStock,
      totalValue,
      brandNames
    }
  }

  async getTableData() {
    const { brandNames, totalStock } = await this.getBaseStats()

    const tableData = brandNames.map((name, index) => {
      const base = totalStock || 200
      const todayBuy = base + (index + 1) * 35
      const monthBuy = todayBuy * 6 + index * 20
      const totalBuy = monthBuy * 5 + index * 300

      return {
        name,
        todayBuy,
        monthBuy,
        totalBuy
      }
    })

    return { tableData }
  }

  async getCountData() {
    const { userCount, malls, totalStock, totalValue } = await this.getBaseStats()

    const paidToday = Math.max(malls.length * 12, 18)
    const favorToday = Math.max(Math.floor(userCount * 2.5), 6)
    const unpaidToday = Math.max(Math.floor(totalStock / 8), 10)
    const paidMonth = paidToday * 9
    const favorMonth = favorToday * 12
    const unpaidMonth = unpaidToday * 8 + Math.floor(totalValue / 100)

    const values = [
      paidToday,
      favorToday,
      unpaidToday,
      paidMonth,
      favorMonth,
      unpaidMonth
    ]

    return cardMeta.map((item, index) => ({
      ...item,
      value: values[index]
    }))
  }

  async getChartData() {
    const { userCount, brandNames, totalStock, totalValue } = await this.getBaseStats()

    const date = [
      '周一',
      '周二',
      '周三',
      '周四',
      '周五',
      '周六',
      '周日'
    ]

    const orderData = {
      date,
      data: date.map((_, dayIndex) => {
        const row = {}

        brandNames.forEach((name, brandIndex) => {
          row[name] = Math.max(
            100,
            Math.round(totalValue * 2 + totalStock * 3 + (dayIndex + 1) * 180 + (brandIndex + 1) * 95)
          )
        })

        return row
      })
    }

    const userData = date.map((label, index) => ({
      date: label,
      new: Math.max(1, userCount + index * 3),
      active: Math.max(20, userCount * 15 + totalStock + index * 40)
    }))

    const videoData = brandNames.map((name, index) => ({
      name,
      value: Math.max(100, Math.round(totalValue * 10 + (index + 1) * 220))
    }))

    return {
      orderData,
      userData,
      videoData
    }
  }
}

module.exports = new HomeService()
