// index.js (or another file where you initialize Sequelize)
const Sequelize = require('sequelize');
const sequelize = new Sequelize(/* database credentials */);

const ClientUser = require('../models/clientUser');
const ProblemPost = require('../models/problemPost');

// Define associations
ClientUser.hasMany(ProblemPost, {
  foreignKey: 'author',
  as: 'problemPosts',
});

ProblemPost.belongsTo(ClientUser, {
  foreignKey: 'author',
  as: 'authorDetails',
});

// Synchronize models with the database
sequelize.sync();

module.exports = {
  ClientUser,
  ProblemPost,
  sequelize,
};
