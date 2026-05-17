const router = require('koa-router')()
const userController = require('../controllers/user')

router.delete('/:id', userController.remove)

router.prefix('/users')

router.get('/', userController.list)

router.get('/:id', userController.getById)

router.post('/', userController.create)

router.put('/:id', userController.update)

module.exports = router
