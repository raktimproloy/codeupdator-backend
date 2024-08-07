const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT;
const host = process.env.DATABASE_HOST || 'localhost'; // Use environment variable for host, fallback to localhost
const database = process.env.DATABASE_NAME || 'codessta_main';

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: 'mysql',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync(); // Sync models with the database
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
