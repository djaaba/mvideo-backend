const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')
const bannerRouter = require('./bannerRouter')
const storeRouter = require('./storeRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/banners', bannerRouter)
router.use('/store', storeRouter)

module.exports = router