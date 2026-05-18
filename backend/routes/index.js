const router = require('koa-router')()
const indexController = require('../controllers/index')

router.get('/', indexController.root)
router.get('/health', indexController.health)

module.exports = router
