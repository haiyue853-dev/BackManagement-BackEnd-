const router = require('koa-router')()
const profileController = require('../controllers/profile')

router.prefix('/profile')

router.get('/', profileController.getCurrent)
router.put('/', profileController.update)

module.exports = router
