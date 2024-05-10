// const mongoose = require("mongoose")
// const validator = require("validator")

// const clientUserSchema = mongoose.Schema({
//     full_name:{
//       type: String,
//       required: "Your firstname is required",
//       max: 25,
//     },
//     username:{
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     email:{
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: [validator.isEmail, 'Please provide a valid email address']
//     },
//     password:{
//       type: String,
//       // required: true,
//       default: null
//     },
//     profile_image:{
//       type: String,
//       default: null
//     },
//     isDark:{
//       type: Boolean,
//       default: false,
//     },
//     loginCount: {
//       type: Number,
//       default: 0
//     }
// },{
//     timestamps: true 
// })

// const ClientUser = mongoose.model("client-users", clientUserSchema)
// module.exports = ClientUser


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