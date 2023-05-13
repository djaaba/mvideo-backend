const Router = require('express')
const router = new Router()
const BrandController = require('../controllers/brandController.js')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', checkRole('ADMIN'), BrandController.create)
router.post('/update', checkRole('ADMIN'), BrandController.update)
router.post('/delete', checkRole('ADMIN'), BrandController.delete)
router.get('/', BrandController.getAll)
router.get('/:id', BrandController.getOne)

module.exports = router