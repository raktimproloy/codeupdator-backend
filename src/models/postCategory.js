const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const postCategory = sequelize.define('post-category', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  package_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.STRING,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  version: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  posts_id:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  interest_user_id:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  interest_count:{
    type: DataTypes.NUMBER,
    allowNull: true,
    defaultValue: 0,
  },
},
{
  sequelize,
});

module.exports = postCategory