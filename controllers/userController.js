const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Cart } = require('../models/models')
const { Op } = require("sequelize");

const generateJwt = (id, email, role, name, address, phone) => {
    return jwt.sign({ id, email, role, name, address, phone }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role, name } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Wrong email or password'))
        }

        let candidate = await User.findOne({ where: { email } })

        if (candidate) {
            return next(ApiError.badRequest('Указанная почта уже занята'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, name, password: hashPassword })
        const token = generateJwt(user.id, user.email, user.role, user.name, user.address)
        return res.json({ token })
    }
    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return next(ApiError.internal('A user is not found'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) return next(ApiError.internal('Wrong password'))
        const token = generateJwt(user.id, user.email, user.role, user.name, user.address, user.phone)
        return res.json({ token })
    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name, req.user.address, req.user.phone)
        return res.json({ token })
    }

    async update(req, res, next) {
        const { email, name, id } = req.body

        const { phone } = req.body || '';
        const { address } = req.body || '';

        if (!id) {
            return next(ApiError.badRequest('Id не найден'))
        }

        if (!name || !email) {
            return next(ApiError.badRequest('Имя или почта не найдены'))
        }

        let candidate = await User.findOne({
            where:
            {
                email,
                id: {
                    [Op.ne]: id
                }
            }
        })

        if (candidate) {
            return next(ApiError.badRequest('Указанная почта уже занята'))
        }

        if (phone) {
            candidate = await User.findOne({
                where:
                {
                    phone,
                    id: {
                        [Op.ne]: id
                    }
                }
            })

            if (candidate) {
                return next(ApiError.badRequest('Указанный номер телефона уже занят'))
            }
        }

        if (email && name && address && phone) {
            const user = await User.update(
                { name, email, address, phone },
                {
                    where: {
                        id
                    }
                }
            )
        }
        else if (email && name && address) {
            const user = await User.update(
                { name, email, address },
                {
                    where: {
                        id
                    }
                }
            )
        }
        else if (email && name && phone) {
            const user = await User.update(
                { name, email, phone },
                {
                    where: {
                        id
                    }
                }
            )
        }
        else if (email && name) {
            const user = await User.update(
                { name, email },
                {
                    where: {
                        id
                    }
                }
            )
        }

        const currentUser = await User.findOne({
            where:
            {
                id
            }
        })

        const token = generateJwt(currentUser.id, currentUser.email, currentUser.role, currentUser.name, currentUser.phone, currentUser.address)
        return res.json({ token })

        // return res.json(user)
    }

}

module.exports = new UserController()