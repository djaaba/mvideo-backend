const { Type, Device } = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')

class TypeController {
    async create(req, res) {
        const { name } = req.body;
        const { imgUrl } = req.files;

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

    async delete(req, res) {
        const { id } = req.body;

        Type.destroy({
            where:
            {
                id
            }
        })

        Device.destroy({
            where:
            {
                typeId: id
            }
        })

        return res.json(true)
    }

    async update(req, res) {
        try {
            const { name, id } = req.body;
            const { imgUrl } = req.files || '';

            if (imgUrl) {
                let fileName = uuid.v4() + ".jpg"
                imgUrl.mv(path.resolve(__dirname, '../static/', 'type', fileName))
                let route = "http://localhost:" + process.env.PORT + "/type/" + fileName
                await Type.update(
                    { name, imgUrl: route },
                    {
                        where: {
                            id
                        }
                    }
                )
                return res.json(true)
            }

            await Type.update(
                { name },
                {
                    where: {
                        id
                    }
                }
            )

            return res.json(true)
        } catch (error) {
            console.log(error.message)
            return error.message;
        }
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