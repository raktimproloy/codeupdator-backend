const express = require("express");
const cors = require("cors");
const path = require("path");

const database = require("./src/database/index");
const cookieSession = require("cookie-session");


// Impport Routers
const adminUserHandler = require("./src/routes/adminUser")
const clientUserHandler = require("./src/routes/clientUser")
const updatePostHandler = require("./src/routes/updatePost")
const postCategoryHandler = require("./src/routes/postCategory")
const problemPostHandler = require("./src/routes/problemPost")

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions ={
   origin:['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', "https://codeupdator.vercel.app"], 
   credentials:true,           
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to codesstackflow." });
});

// Define routes
app.use("/admin-user", adminUserHandler)
app.use("/user", clientUserHandler)

app.use("/update-post", updatePostHandler)
app.use("/post-category", postCategoryHandler)
app.use("/problem-post", problemPostHandler)

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that API!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
