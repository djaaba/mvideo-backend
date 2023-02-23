const Router = require('express')
const router = new Router()
const BrandController = require('../controllers/brandController.js')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', checkRole('ADMIN'), BrandController.create)
router.get('/', BrandController.getAll)


module.exports = router