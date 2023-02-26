const { Type } = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')

class TypeController {
    async create(req, res) {
        const { name } = req.body

        const { imgUrl } = req.files
        let fileName = uuid.v4() + ".jpg"
        imgUrl.mv(path.resolve(__dirname, '../static/', 'type', fileName))
        let route = "http://localhost:" + process.env.PORT + "/type/" + fileName
        const type = await Type.create({ name, imgUrl: route })
        
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

    async getOne(req, res) {
        const { id } = req.params
        const type = await Type.findOne({
            where: { id },
        })
        return res.json(type)
    }
}

module.exports = new TypeController()