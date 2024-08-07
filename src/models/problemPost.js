// problemPost.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/index"); // Adjust the path to your sequelize instance

const ProblemPost = sequelize.define('problem-post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  details: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  author: {
    type: DataTypes.INTEGER,
    references: {
      model: 'client-users',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  likes_user_id: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  saves_user_id: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  }
}, {
  sequelize,
});

module.exports = ProblemPost;
