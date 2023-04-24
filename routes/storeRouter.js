const Router = require('express')
const router = new Router()
const StoreController = require('../controllers/storeController')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', checkRole('ADMIN'), StoreController.update)
router.get('/', StoreController.get)

module.exports = router