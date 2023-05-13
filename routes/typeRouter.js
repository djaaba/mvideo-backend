const Router = require('express')
const router = new Router()
const TypeController = require('../controllers/typeController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', checkRole('ADMIN'), TypeController.create)
router.post('/update', checkRole('ADMIN'), TypeController.update)
router.post('/delete', checkRole('ADMIN'), TypeController.delete)
router.get('/', TypeController.getAll)
router.get('/:id', TypeController.getOne)

module.exports = router