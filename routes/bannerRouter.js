const Router = require('express')
const router = new Router()
const BannerController = require('../controllers/bannerController.js')
const checkRole = require('../middleware/CheckRoleMiddleware')

router.post('/', checkRole('ADMIN'), BannerController.create)
router.get('/', BannerController.getAll)

module.exports = router