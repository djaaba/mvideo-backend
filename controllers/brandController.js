const { Brand, Device } = require("../models/models")
const uuid = require('uuid')
const path = require('path')

class BrandController {
    async create(req, res) {
        const { name } = req.body

        const { imgUrl } = req.files
        let fileName = uuid.v4() + ".jpg"
        imgUrl.mv(path.resolve(__dirname, '../static/', 'brand', fileName))
        let route = "http://localhost:" + process.env.PORT + "/brand/" + fileName

        const brand = await Brand.create({ name, imgUrl: route })
        return res.json(brand)
    }

    async delete(req, res) {
        const { id } = req.body;

        Brand.destroy({
            where:
            {
                id
            }
        })

        const devices = Device.findAll({
            where:
            {
                brandId: id
            }
        })

        if (devices) {
            Device.destroy({
                where:
                {
                    brandId: id
                }
            })
        }

        return res.json(true)
    }

    async update(req, res) {
        try {
            const { name, id } = req.body;
            const { imgUrl } = req.files || ''

            if (imgUrl) {
                let fileName = uuid.v4() + ".jpg"
                imgUrl.mv(path.resolve(__dirname, '../static/', 'brand', fileName))
                let route = "http://localhost:" + process.env.PORT + "/brand/" + fileName

                await Brand.update(
                    { name, imgUrl: route },
                    {
                        where: {
                            id
                        }
                    }
                )
                return res.json(true)
            }

            await Brand.update(
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