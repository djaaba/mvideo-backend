const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Cart } = require('../models/models')
const { Op } = require("sequelize");

const generateJwt = (id, email, role, name, address) => {
    return jwt.sign({ id, email, role, name, address }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role, name } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Wrong email or password'))
        }

        const candidate = await User.findOne({ where: { email } })

        if (candidate) {
            return next(ApiError.badRequest('A user with the same email already exists.'))
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
        const token = generateJwt(user.id, user.email, user.role, user.name, user.address)
        return res.json({ token })
    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name, req.user.address)
        return res.json({ token })
    }

    async update(req, res, next) {
        const { email, name, address, id } = req.body

        if (!id) {
            return next(ApiError.badRequest('Id is not found'))
        }

        if (!name || !email || !address) {
            return next(ApiError.badRequest('Wrong name or email or address'))
        }

        const candidate = await User.findOne({
            where:
            {
                email,
                id: {
                    [Op.ne]: id
                }
            }
        })

        if (candidate) {
            return next(ApiError.badRequest('A user with the same email already exists.'))
        }

        const user = await User.update(
            { name, email, address },
            {
                where: {
                    id
                }
            }
        )

        const currentUser = await User.findOne({
            where:
            {
                id
            }
        })

        const token = generateJwt(currentUser.id, currentUser.email, currentUser.role, currentUser.name, currentUser.address)
        return res.json({ token })

        // return res.json(user)
    }

}

module.exports = new UserController()