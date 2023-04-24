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
            }
        })

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
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
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

        if (!brandId && !typeId && !minPrice && !maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                order: [['discountPrice', 'DESC']],
                limit,
                offset
            })
        }

        if (brandId && !typeId && !minPrice && !maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                where: {
                    brandId
                },
                limit,
                offset
            })
        }

        if (brandId && !typeId && minPrice && maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                where: {
                    brandId,
                    discountPrice: {
                        [Op.between]: [+minPrice, +maxPrice]
                    }
                },
                limit,
                offset
            })
        }

        if (!brandId && typeId && minPrice && maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                where: {
                    typeId,
                    discountPrice: {
                        [Op.between]: [+minPrice, +maxPrice]
                    }
                },
                limit,
                offset
            })
        }

        if (!brandId && typeId && !minPrice && !maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                where: {
                    typeId
                },
                limit,
                offset
            })
        }

        if (brandId && typeId && minPrice && maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                where: {
                    brandId,
                    typeId,
                    discountPrice: {
                        [Op.between]: [+minPrice, +maxPrice]
                    }
                },
                limit,
                offset
            })
        }

        if (brandId && typeId && !minPrice && !maxPrice) {
            devices = await Device.findAndCountAll({
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }],
                where: {
                    brandId, typeId
                },
                limit,
                offset
            })
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

    async update(req, res) {
        try {
            let { id, count, name, price, brandId, typeId, info, description, discount, viewCount, purchasesCount } = req.body
            let { imgUrl } = req.files
            let fileName = uuid.v4() + ".jpg"
            imgUrl.mv(path.resolve(__dirname, '../static/', 'device', fileName))
            let route = "http://localhost:" + process.env.PORT + "/device/" + fileName
            let discountPrice = (price * (100 - discount)) / 100;

            const device = await Device.update(
                { count, name, price, brandId, typeId, imgUrl: route, description, discount, viewCount, purchasesCount, discountPrice },
                {
                    where: {
                        id
                    }
                }
            )

            DeviceInfo.destroy({
                where:
                {
                    deviceId: id
                }
            })

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: id
                    })
                })
            }

            const currentDevice = await Device.findOne({
                where: { id },
                include: [{
                    model: DeviceInfo,
                    as: 'info'
                }]
            })

            return res.json(currentDevice)
        } catch (error) {
            console.log(error.message)
            return error.message;
        }
    }

    async delete(req, res) {
        const { id } = req.body

        Device.destroy({
            where:
            {
                id
            }
        })

        DeviceInfo.destroy({
            where:
            {
                deviceId: id
            }
        })

        return res.json(true);
    }
}

module.exports = new DeviceController()