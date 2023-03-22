const sequelize = require('../db')

const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
},
    {
        timestamps: false,
    })

const Cart = sequelize.define('cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
},
    {
        timestamps: false,
    })

const CartDevice = sequelize.define('cart_device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
},
    {
        timestamps: false,
    })

const Device = sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: { type: DataTypes.INTEGER, defaultValue: 1 },
    description: { type: DataTypes.STRING, allowNull: false },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    discount: { type: DataTypes.INTEGER, defaultValue: 0 },
    discountPrice: { type: DataTypes.INTEGER, allowNull: true },
    viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    purchasesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    // rating: { type: DataTypes.INTEGER, defaultValue: 0 },
},
    {
        timestamps: false,
    })

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    // linkUrl: { type: DataTypes.STRING, allowNull: false },
},
    {
        timestamps: false,
    })

const Brand = sequelize.define('brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    // linkUrl: { type: DataTypes.STRING, allowNull: false },
},
    {
        timestamps: false,
    }
)

const Banner = sequelize.define('banner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    linkUrl: { type: DataTypes.STRING, allowNull: true },
},
    {
        timestamps: false,
    })

// const Rating = sequelize.define('rating', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     rate: { type: DataTypes.INTEGER, allowNull: false },
// })

const DeviceInfo = sequelize.define('device_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
},
    {
        timestamps: false,
    })

const TypeBrand = sequelize.define('type_brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
},
    {
        timestamps: false,
    })

User.hasOne(Cart)
Cart.belongsTo(User)

// User.hasMany(Rating)
// Rating.belongsTo(User)

Cart.hasMany(CartDevice)
CartDevice.belongsTo(Cart)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

// Device.hasMany(Rating)
// Rating.belongsTo(Device)

Device.hasMany(CartDevice)
CartDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, { as: 'info' })
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

module.exports = {
    User,
    Cart,
    CartDevice,
    Device,
    Type,
    Brand,
    Banner,
    // Rating,
    TypeBrand,
    DeviceInfo
}