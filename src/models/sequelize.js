// models/index.js or sequelize.js (depending on your structure)
const Sequelize = require('sequelize');
const sequelize = require("../database/index");

const ClientUser = require('./clientUser');
const ProblemPost = require('./problemPost');

// Initialize models
const models = {
  ClientUser: ClientUser,
  ProblemPost: ProblemPost,
};

// Define associations
models.ClientUser.hasMany(models.ProblemPost, {
  foreignKey: 'author',
  as: 'problemPosts',
});
models.ProblemPost.belongsTo(models.ClientUser, {
  foreignKey: 'author',
  as: 'authorDetails',
});

// Sync database
sequelize.sync();

module.exports = {
  ...models,
  sequelize,
};
