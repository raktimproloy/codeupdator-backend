// Database connection
const { Sequelize, DataTypes } = require("sequelize");

const dotenv = require("dotenv")
dotenv.config()

const user = process.env.DATABASE_USER
const password = process.env.DATABASE_PASSWORD
const port = process.env.DATABASE_PORT

const sequelize = new Sequelize('codessta_main', user, password, {
  host: 'localhost', // Remove the port number from here
  port: port, // Include the port separately
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

module.exports = sequelize