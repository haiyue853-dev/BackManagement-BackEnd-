const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sex: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  addr: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'users'
})

module.exports = User