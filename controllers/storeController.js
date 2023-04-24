const { Store } = require("../models/models")
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const sequelize = require('../db')
const { Op } = require("sequelize");

class StoreController {
    async update(req, res) {
        const test = await Store.findAndCountAll()

        let { name, phone, address, email } = req.body
        let { imgUrl } = req.files
        let fileName = uuid.v4() + ".png"
        imgUrl.mv(path.resolve(__dirname, '../static/', 'store', fileName))
        let route = "http://localhost:" + process.env.PORT + "/store/" + fileName

        if (!test.count) {
            const store = await Store.create({ name, phone, address, email, imgUrl: route })
            return res.json(store)
        }

        const store = await Store.update(
            { name, phone, address, email, imgUrl: route },
            {
                where: {
                    name: {
                        [Op.ne]: null
                    }
                }
            }
        )
        return res.json(store)
    }

    async get(req, res) {
        const store = await Store.findOne(
            {
                order: [ [ 'id', 'DESC' ]],
            }
        )
        return res.json(store)
    }
}

module.exports = new StoreController()