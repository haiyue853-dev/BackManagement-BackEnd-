const router = require('koa-router')()
const userController = require('../controllers/user')

router.prefix('/users')

router.get('/', userController.list)

router.get('/:id', userController.getById)

router.post('/', userController.create)

module.exports = router
