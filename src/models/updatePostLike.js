const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const UpdatePostLike = sequelize.define('update-post', {
  post_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
},
{
  sequelize,
});

module.exports = UpdatePostLike