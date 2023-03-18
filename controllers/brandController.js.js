const { Brand } = require("../models/models")
const uuid = require('uuid')
const path = require('path')

class BrandController {
    async create(req, res) {
        const { name, linkUrl } = req.body

        const { imgUrl } = req.files
        let fileName = uuid.v4() + ".jpg"
        imgUrl.mv(path.resolve(__dirname, '../static/', 'brand', fileName))
        let route = "http://localhost:" + process.env.PORT + "/brand/" + fileName

        const brand = await Brand.create({ name, imgUrl: route, linkUrl })
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async getOne(req, res) {
        const { id } = req.params
        const brand = await Brand.findOne({
            where: { id },
        })
        return res.json(brand)
    }
}

module.exports = new BrandController()