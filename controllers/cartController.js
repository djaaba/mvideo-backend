const { Device, DeviceInfo, CartDevice, User } = require("../models/models")
const ApiError = require('../error/apiError')
const uuid = require('uuid')
const path = require('path')
const sequelize = require('../db')
const { Op } = require("sequelize");


class CartController {
    async create(req, res, next) {
        const { devices, userId, order } = req.body;
        devices.forEach(item => (async function () {
            let { id, count, name, price, brandId, typeId, info, description, discount, viewCount, purchasesCount } = item
            const newCount = purchasesCount ? purchasesCount * count : ++purchasesCount * count;

            await Device.update(
                { purchasesCount: newCount },
                {
                    where: { id },
                }
            )

            await CartDevice.create({ count, deviceId: id, userId, order, status: false })
        })())

        return res.json(true)
    }

    async getAll(req, res) {
        const orders = await CartDevice.findAll({
            order: [['order', 'DESC']],
            include: [{
                model: User,
                as: 'user'
            },
            {
                model: Device,
                as: 'device'
            }
            ]
        })

        return res.json(orders)
    }

    async getBestsellers(req, res) {
        let devices = await Device.findAll({ order: [['viewCount', 'DESC']], limit: 3 })

        return res.json(devices)
    }

    async update(req, res) {
        // try {
        //     let { id, count, name, price, brandId, typeId, info, description, discount, viewCount, purchasesCount } = req.body
        //     let { imgUrl } = req.files
        //     let fileName = uuid.v4() + ".jpg"
        //     imgUrl.mv(path.resolve(__dirname, '../static/', 'device', fileName))
        //     let route = "http://localhost:" + process.env.PORT + "/device/" + fileName
        //     let discountPrice = (price * (100 - discount)) / 100;

        //     const device = await Device.update(
        //         { count, name, price, brandId, typeId, imgUrl: route, description, discount, viewCount, purchasesCount, discountPrice },
        //         {
        //             where: {
        //                 id
        //             }
        //         }
        //     )

        //     DeviceInfo.destroy({
        //         where:
        //         {
        //             deviceId: id
        //         }
        //     })

        //     if (info) {
        //         info = JSON.parse(info)
        //         info.forEach(i => {
        //             DeviceInfo.create({
        //                 title: i.title,
        //                 description: i.description,
        //                 deviceId: id
        //             })
        //         })
        //     }

        //     const currentDevice = await Device.findOne({
        //         where: { id },
        //         include: [{
        //             model: DeviceInfo,
        //             as: 'info'
        //         }]
        //     })

        //     return res.json(currentDevice)
        // } catch (error) {
        //     console.log(error.message)
        //     return error.message;
        // }
    }

    async delete(req, res) {
        // const { id } = req.body

        // Device.destroy({
        //     where:
        //     {
        //         id
        //     }
        // })

        // DeviceInfo.destroy({
        //     where:
        //     {
        //         deviceId: id
        //     }
        // })

        return res.json(true);
    }
}

module.exports = new CartController()