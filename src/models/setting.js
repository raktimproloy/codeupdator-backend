// problemPost.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/index"); // Adjust the path to your sequelize instance

const Setting = sequelize.define('setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  site_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  site_logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  site_favicon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  navbar:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  packages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "draft",
  },
}, {
  sequelize,
});

module.exports = Setting;
