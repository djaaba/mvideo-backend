const { Banner } = require('../models/models')
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')

class BannerController {
    async create(req, res) {
        const { name } = req.body

        const { imgUrl } = req.files
        let fileName = uuid.v4() + ".jpg"
        imgUrl.mv(path.resolve(__dirname, '../static/', 'banner', fileName))
        let route = "http://localhost:" + process.env.PORT + "/banner/" + fileName
        const banner = await Banner.create({ name, imgUrl: route })

        return res.json(banner)
    }

    async delete(req, res) {
        const { id } = req.body;

        Banner.destroy({
            where:
            {
                id
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
                imgUrl.mv(path.resolve(__dirname, '../static/', 'banner', fileName))
                let route = "http://localhost:" + process.env.PORT + "/banner/" + fileName
                await Banner.update(
                    { name, imgUrl: route },
                    {
                        where: {
                            id
                        }
                    }
                )
                return res.json(true)
            }

            await Banner.update(
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
        const banner = await Banner.findAll()
        return res.json(banner)
    }
}

module.exports = new BannerController()