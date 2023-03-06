const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Cart } = require('../models/models')

const generateJwt = (id, email, role, name) => {
    return jwt.sign({ id, email, role, name }, process.env.SECRET_KEY, { expiresIn: '24h' })
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
        const cart = await Cart.create({ userId: user.id })
        const token = generateJwt(user.id, user.email, user.role, user.name)
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
        const token = generateJwt(user.id, user.email, user.role, user.name)
        return res.json({token})
    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.name)
        return res.json({token})
    }

}

module.exports = new UserController()