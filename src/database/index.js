// // mongoose.js

// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// // Load environment variables
// dotenv.config();

// // Define the MongoDB connection URI from your .env file
// const mongoURI = process.env.ATLAS_URL;

// // Connect to MongoDB
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Access the Mongoose connection
// const db = mongoose.connection;

// // Handle MongoDB connection events
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// // Export the Mongoose instance and connection
// module.exports = { mongoose, db };



// SQL Database

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