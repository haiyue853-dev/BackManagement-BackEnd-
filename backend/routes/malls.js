const router = require('koa-router')()
const mallController = require('../controllers/mall')

router.prefix('/malls')

router.delete('/:id', mallController.remove)

router.get('/', mallController.list)

router.get('/:id', mallController.getById)

router.post('/', mallController.create)

router.put('/:id', mallController.update)

module.exports = router
