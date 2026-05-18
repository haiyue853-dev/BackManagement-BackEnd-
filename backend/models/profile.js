const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  signature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastLoginCity: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'profiles'
})

module.exports = Profile
