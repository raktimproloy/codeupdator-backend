// const mongoose = require("mongoose")
// const validator = require("validator")

// const adminUserSchema = mongoose.Schema({
//     first_name:{
//       type: String,
//       required: "Your firstname is required",
//       max: 25,
//     },
//     last_name:{
//       type: String,
//       required: "Your lastname is required",
//       max: 25,
//     },
//     role:{
//       type: String,
//       required: true,
//       default: "admin",
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
//       required: true
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

// const AdminUser = mongoose.model("admin-users", adminUserSchema)
// module.exports = AdminUser


const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const AdminUser = sequelize.define('admin-users', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "admin",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
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
  indexes: [{ unique: true, fields: ['email'] }],
});

module.exports = AdminUser