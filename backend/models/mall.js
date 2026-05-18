const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Mall = sequelize.define('Mall', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '上架'
  },
  coverTag: {
    type: DataTypes.STRING,
    allowNull: true
  },
  desc: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'malls'
})

module.exports = Mall
