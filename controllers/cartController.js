const { Device, CartDevice, User } = require("../models/models")
const sequelize = require('../db')

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
            attributes: ['order', 'status', 'userId', [sequelize.fn('array_agg', sequelize.col('count')), 'deviceCounts'], [sequelize.fn('array_agg', sequelize.col('deviceId')), 'deviceIds']],
            group: ['order', 'userId', 'user.id', 'status'],
            include: [
                {
                    model: User,
                    as: 'user'
                },
            ],
        })

        return res.json(orders)
    }

    async getOneByOrder(req, res) {
        const { order } = req.params
        const details = await CartDevice.findAll({
            where: { order },
            attributes: {
                exclude: ['']
            },
            include: [
                {
                    model: Device,
                    as: 'device'
                },
            ]
        })
        return res.json(details)
    }

    async getOneByUserId(req, res) {
        const { id } = req.params
        const details = await CartDevice.findAll({
            where: { userId: id },
            attributes: [[sequelize.fn('array_agg', sequelize.col('order')), 'orders']],
            group: ['order'],
            
        })
        return res.json(details)
    }

    async update(req, res) {
        let { order } = req.body

        const orders = await CartDevice.update(
            { status: true },
            {
                where: { order },
            }
        )

        return res.json(true)
    }

    async delete(req, res) {
        const { id } = req.body || '';
        const { order } = req.body || '';

        if (id) {
            CartDevice.destroy({
                where:
                {
                    id
                }
            })
            return res.json(true)
        }

        CartDevice.destroy({
            where:
            {
                order
            }
        })

        return res.json(true)
    }
}

module.exports = new CartController()