const express = require("express");
const cors = require("cors");
const path = require("path");
// const { mongoose, db } = require("./src/database/index");


// Impport Routers
// const userHandler = require("./src/routes/user")


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions ={
   origin:['http://localhost:4173', 'http://localhost:3000', 'http://localhost:3002', 'https://min.nextctl.co.uk', "http://localhost:3006"], 
   credentials:true,           
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, "/public")));

// Define routes
// app.use("/user", userHandler)

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
