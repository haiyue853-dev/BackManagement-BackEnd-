const router = require('koa-router')()
const homeController = require('../controllers/home')

router.prefix('/home')

router.get('/getTableData', homeController.getTableData)
router.get('/getCountData', homeController.getCountData)
router.get('/getChartData', homeController.getChartData)

module.exports = router
