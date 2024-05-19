const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const ProblemPost = sequelize.define('problem-post', {
  packages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    default: "draft"
  },
  details: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  author: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
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

module.exports = ProblemPost