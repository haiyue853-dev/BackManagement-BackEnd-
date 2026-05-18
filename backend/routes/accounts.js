const router = require('koa-router')()
const accountController = require('../controllers/account')
const adminOnly = require('../middleware/adminOnly')

router.prefix('/accounts')

router.use(adminOnly)

router.get('/', accountController.list)
router.post('/', accountController.create)
router.put('/:id', accountController.update)
router.put('/:id/password', accountController.updatePassword)
router.delete('/:id', accountController.remove)

module.exports = router
