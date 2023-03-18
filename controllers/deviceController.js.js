const { Device, DeviceInfo } = require("../models/models")
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')

class DeviceController {
    async create(req, res, next) {
        try {
            let { count, name, price, brandId, typeId, info, description, discount, viewCount } = req.body
            let { imgUrl } = req.files
            let fileName = uuid.v4() + ".jpg"
            imgUrl.mv(path.resolve(__dirname, '../static/', 'device', fileName))
            let route = "http://localhost:" + process.env.PORT + "/device/" + fileName
            const device = await Device.create({ count, name, price, brandId, typeId, imgUrl: route, description, discount, viewCount })

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

    async getAll(req, res) {
        let { brandId, typeId, limit, page } = req.query
        page = page || 1;
        limit = limit || 5;
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({ limit, offset })
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