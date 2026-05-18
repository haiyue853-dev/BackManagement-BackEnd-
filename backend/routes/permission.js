const router = require('koa-router')()
const permissionController = require('../controllers/permission')

router.prefix('/permission')

router.post('/getMenu', permissionController.getMenu)

module.exports = router
