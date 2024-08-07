const { DataTypes } = require("sequelize");
const sequelize = require("../database/index")
// Model definition
const AdminUser = sequelize.define('admin-users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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