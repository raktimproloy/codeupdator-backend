const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const ClientUser = sequelize.define('client-users', {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  likes_update_post:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  saves_update_post:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  login_system: {
    type: DataTypes.STRING,
    allowNull: true
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  interest: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDark: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  loginCount: {
    type: DataTypes.NUMBER,
    allowNull: true
  },
},
{
  sequelize,
  timestamps: true,
  indexes: [{ unique: true, fields: ["username", 'email'] }],
});

module.exports = ClientUser