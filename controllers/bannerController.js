const { Banner } = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')

class BannerController {
    async create(req, res) {
        const { linkUrl, name } = req.body

        const { imgUrl } = req.files
        let fileName = uuid.v4() + ".jpg"
        imgUrl.mv(path.resolve(__dirname, '../static/', 'banner', fileName))
        let route = "http://localhost:" + process.env.PORT + "/banner/" + fileName
        const banner = await Banner.create({ linkUrl, name, imgUrl: route })
        
        return res.json(banner)
    }

    async getAll(req, res) {
        const banner = await Banner.findAll()
        return res.json(banner)
    }
}

module.exports = new BannerController()