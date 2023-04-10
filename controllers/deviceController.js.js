const { Device, DeviceInfo } = require("../models/models")
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const sequelize = require('../db')
const { Op } = require("sequelize");


class DeviceController {
    async create(req, res, next) {
        try {
            let { count, name, price, brandId, typeId, info, description, discount, viewCount, purchasesCount } = req.body
            let { imgUrl } = req.files
            let fileName = uuid.v4() + ".jpg"
            imgUrl.mv(path.resolve(__dirname, '../static/', 'device', fileName))
            let route = "http://localhost:" + process.env.PORT + "/device/" + fileName
            let discountPrice = (price * (100 - discount)) / 100;
            const device = await Device.create({ count, name, price, brandId, typeId, imgUrl: route, description, discount, viewCount, purchasesCount, discountPrice })

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                })
            }

            return res.json(device)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getBestsellers(req, res) {
        let devices = await Device.findAll({ order: [['viewCount', 'DESC']], limit: 3 })

        return res.json(devices)
    }

    async getMostViewed(req, res) {
        let devices = await Device.findAll({ order: [['viewCount', 'DESC']], limit: 2 })

        return res.json(devices)
    }

    async getByMatch(req, res) {
        let { word } = req.query;

        let devices = await Device.findAll({
            limit: 5,
            where: {
                name: {
                    [Op.iLike]: '%' + word + '%'
                },
                // description: {
                //     [Op.like]: '%' + word + '%'
                // }
            }})

        return res.json(devices)
    }

    async getAll(req, res) {
        let { brandId, typeId, limit, page, minPrice, maxPrice } = req.query
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId && minPrice && maxPrice) {
            devices = await Device.findAndCountAll({
                where: {
                    discountPrice: {
                        [Op.between]: [+minPrice, +maxPrice]
                    }
                },
                order: [['discountPrice', 'DESC']],
                limit,
                offset
            })
        }

        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ where: { brandId }, limit, offset })

        }

        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId }, limit, offset })
        }

        if (brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset })
        }

        return res.json(devices)
    }

    async getOne(req, res) {
        const { id } = req.params
        const device = await Device.findOne({
            where: { id },
            include: [{
                model: DeviceInfo,
                as: 'info'
            }]
        })
        device.increment('viewCount');
        return res.json(device)
    }
}

module.exports = new DeviceController()