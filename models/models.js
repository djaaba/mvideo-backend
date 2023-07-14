const sequelize = require('../db')

const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, defaultValue: "" },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: "" },
},
    {
        timestamps: false,
    })

const CartDevice = sequelize.define('cart_device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    count: { type: DataTypes.INTEGER, allowNull: false },
    order: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false },
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
},
    {
        timestamps: false,
    })

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
},
    {
        timestamps: false,
    })

const Brand = sequelize.define('brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
},
    {
        timestamps: false,
    }
)

const Banner = sequelize.define('banner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
},
    {
        timestamps: false,
    })

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

const Store = sequelize.define('store', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: "test" },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: "8(908)908-90-08" },
    address: { type: DataTypes.STRING, allowNull: false, defaultValue: "test 2" },
    email: { type: DataTypes.STRING, allowNull: false, defaultValue: "test@test.ru" },
    imgUrl: { type: DataTypes.STRING, allowNull: true },
},
    {
        timestamps: false,
    }
)

User.hasMany(CartDevice)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(CartDevice)
CartDevice.belongsTo(Device)
CartDevice.belongsTo(User)

Device.hasMany(DeviceInfo, { as: 'info' })
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

module.exports = {
    User,
    CartDevice,
    Device,
    Type,
    Brand,
    Banner,
    TypeBrand,
    DeviceInfo,
    Store
}