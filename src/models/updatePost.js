// const mongoose = require("mongoose")

// const updatePostSchema = mongoose.Schema({
//     package_name:{
//       type: String,
//       required: "Your package name is required",
//     },
//     version:{
//       type: String,
//       required: "Your version is required",
//     },
//     details:{
//       type: String,
//       required: true,
//     },
//     image:{
//       type: String,
//       required: true
//     }
// },{
//     timestamps: true 
// })

// const UpdatePost = mongoose.model("update-post", updatePostSchema)
// module.exports = UpdatePost




const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const UpdatePost = sequelize.define('update-post', {
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
},
{
  sequelize,
});

module.exports = UpdatePost