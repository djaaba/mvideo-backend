const Router = require('express')
const router = new Router()
const CartController = require('../controllers/cartController.js')

router.post('/', CartController.create)
router.post('/update', CartController.update)
router.post('/delete', CartController.delete)
router.get('/', CartController.getAll)
router.get('/:order', CartController.getOneByOrder)
router.get('/order/:id', CartController.getOneByUserId)



module.exports = router