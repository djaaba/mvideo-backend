const Router = require('express')
const router = new Router()
const DeviceController = require('../controllers/deviceController.js')

router.post('/', DeviceController.create)
router.get('/bestsellers', DeviceController.getBestsellers)
router.get('/mostviewed', DeviceController.getMostViewed)
router.get('/', DeviceController.getAll)
router.get('/:id', DeviceController.getOne)


module.exports = router