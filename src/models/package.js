// problemPost.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/index"); // Adjust the path to your sequelize instance

const Package = sequelize.define('package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  font_color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bg_color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "draft",
  }
}, {
  sequelize,
});

module.exports = Package;
