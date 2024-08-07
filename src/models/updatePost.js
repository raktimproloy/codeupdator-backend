const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const UpdatePost = sequelize.define('update-post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  package_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  status:{
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "draft",
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  likes_user_id:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  saves_user_id:{
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  }
},
{
  sequelize,
});

module.exports = UpdatePost