const express = require("express");
const router = express.Router();
const AdminUser = require("../models/adminUser");
const hashPassword = require("../middleware/hashPassword");
const bcrypt = require("bcryptjs")
// jwt create data
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const authenticateJWT = require("../middleware/authenticateJWT")

// Route for user signup
router.post("/signup", hashPassword, async (req, res) => {
  try {
    // Destructuring user input from request body
    const { first_name, last_name, email, password } = req.body;

    // Destructuring hashed password and salt from request object
    const { hashedPassword, salt } = req;

    // Input validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: "Invalid requirement" });
    }

    // Validate email format using a regular expression
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email!" });
    }

    // Check if the password meets the minimum length requirement
    if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid Password! Password must be at least 8 characters long."
      });
    }

    // Create a new AdminUser object with validated data
    const newAdminUser = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };

  const newUser = await AdminUser.create(newAdminUser);
  // console.log(jane.toJSON());
  res.send({message: 'User added successfully', data: newUser});
    // // Create a new AdminUser instance
    // const newUser = new AdminUser(newAdminUser);

    // // Save the new user to the database
    // await newUser
    //   .save()
    //   .then((result) => {
    //     // Successful signup response
    //     res.status(200).json({
    //       message: "Signup Successful",
    //       userId: result._id,
    //     });
    //   })
    //   .catch((err) => {
    //     // Handle database save error
    //     console.error(err);
    //     res.status(500).send({
    //       error: err.message,
    //     });
    //   });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).send({
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const {email, password} = req.body

  const adminUserData = await AdminUser.findOne({ where: { email: email } });
  // const adminUserData = await AdminUser.findOne({email: email})
  if(adminUserData){
    bcrypt.compare(password, adminUserData.password, function(err, result) {
      if (result) {
        const token = jwt.sign({ 
          id: adminUserData.id, 
          first_name: adminUserData.first_name,
          last_name: adminUserData.last_name,
          email: adminUserData.email,
        }, secretKey,
        {
          expiresIn: "10h",
        }
        );
        res.status(200).json({
          message: "Login Successful",
          token: token,
        });
      }else{
        res.status(401).json({ error: "Authentication error!" });
      }
    });
  }else{
    res.status(401).json({ error: "Authentication error!" });
  }
})

router.get("/get", authenticateJWT, async (req, res) => {
    try{
      const users = await AdminUser.findAll({ order: [
        ['id', 'DESC'],
    ],});
      // const users = await AdminUser.find().sort({ timestamp: -1 }).exec();
        res.status(200).send(users);
    }
    catch(err){
      res.status(500).send("internal server error")
    }
})

router.delete("/delete/:id", authenticateJWT, async (req, res) => {
  try{
    const user = await AdminUser.findOne({ where: { id: req.params.id } });

    if(user){
      // await AdminUser.deleteOne({ _id: req.params.id });
      await AdminUser.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({
        message: "User deleted successful!"
      });
    }else{
      res.status(404).send("User not found!")
    }
  }
  catch(err){
    res.status(500).send("internal server error")
  }
})

// Export the router for use in other files
module.exports = router;
