const express = require("express");
const router = express.Router();
const ClientUser = require("../models/clientUser");
const hashPassword = require("../middleware/hashPassword");
const bcrypt = require("bcryptjs")
// jwt create data
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const authenticateJWT = require("../middleware/authenticateJWT")


function generateUniqueUsername(fullName) {
  // Convert full name to lowercase and remove any extra spaces
  const cleanName = fullName.trim().toLowerCase();
  
  // Generate a unique code (e.g., timestamp or random number)
  const uniqueCode = Date.now().toString(36); // Convert timestamp to base 36 string
  
  // Combine clean name and unique code
  const username = cleanName.replace(/\s+/g, '_') + '_' + uniqueCode;
  
  return username;
}


// Route for user signup
router.post("/signup", hashPassword, async (req, res) => {
  try {
    // Destructuring user input from request body
    const { full_name, username, email, password } = req.body;

    // Destructuring hashed password and salt from request object
    const { hashedPassword, salt } = req;

    // Input validation
    if (!email || !password || !full_name || !username) {
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
      full_name,
      username,
      email,
      password: hashedPassword,
      login_system: "manually"
    };

    await ClientUser.create(newAdminUser)
      .then((result) => {
        const token = jwt.sign({ 
            id: result.id, 
            full_name: result.full_name,
            user_name: result.username,
            email: result.email,
          }, secretKey,
          {
            expiresIn: "10h",
          }
          );
        // Successful signup response
        res.status(200).json({
          message: "Signup Successful",
          userId: result.id,
          token: token
        });
      })
      .catch((err) => {
        // Handle database save error
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  } catch (error) {
    // Handle unexpected errors
    console.error(error);
    res.status(500).send({
      error: error.message,
    });
  }
});

router.post("/google/login", async (req, res) => {
  try {
    // Destructuring user input from request body
    const { full_name, email, profile_image } = req.body;
    // Input validation
    if (!email || !full_name) {
      return res.status(400).json({ error: "Invalid requirement" });
    }

    // Validate email format using a regular expression
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email!" });
    }

    const clientUserData = await ClientUser.findOne({ where: { email: email } });
    // const clientUserData = await ClientUser.findOne({email: email})
    if(clientUserData){
      const token = jwt.sign({ 
        id: clientUserData.id, 
        full_name: clientUserData.first_name,
        username: clientUserData.username,
        email: clientUserData.email,
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
      const createdUsername = generateUniqueUsername(full_name)
      // Create a new AdminUser object with validated data
      const newAdminUser = {
        full_name,
        username: createdUsername,
        email,
        profile_image,
        login_system: "google"
      };
  
      // Create a new AdminUser instance
      // const newUser = new ClientUser(newAdminUser);
  
      // Save the new user to the database
      // await newUser
      //   .save()
      await ClientUser.create(newAdminUser)
        .then((result) => {
          const token = jwt.sign({ 
              id: result._id, 
              full_name: result.full_name,
              email: result.email,
            }, secretKey,
            {
              expiresIn: "10h",
            }
            );
          // Successful signup response
          res.status(200).json({
            message: "Signup Successful",
            userId: result._id,
            token: token
          });
        })
        .catch((err) => {
          // Handle database save error
          console.error(err);
          res.status(500).send({
            error: err.message,
          });
        });
    }
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

  const clientUserData = await ClientUser.findOne({ where: { email: email } });
  if(clientUserData){
    bcrypt.compare(password, clientUserData.password, function(err, result) {
      if (result) {
        const token = jwt.sign({ 
          id: clientUserData.id, 
          full_name: clientUserData.first_name,
          user_name: clientUserData.last_name,
          email: clientUserData.email,
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

router.get("/get/:id", authenticateJWT, async (req, res) => {
  const clientUserData = await ClientUser.findOne({ where: { id: req.params.id } });
  if(clientUserData){
    // Exclude the 'password' field from the response
    const { password, updatedAt, ...userDataWithoutPassword } = clientUserData.toJSON();
    res.status(200).json({
      data: userDataWithoutPassword
    });
  }else{
    res.status(401).json({ error: "Authentication error!" });
  }
})

router.put("/update/:id", authenticateJWT, async (req, res) => {
  try{
    const clientData = await ClientUser.findOne({ where: { id: req.params.id } });
    const result = await ClientUser.update(
      { ...req.body, likes_update_post: JSON.parse(clientData.likes_update_post) },
      {
        where: {
          id: req.params.id
        },
      },
    );

    if (!result) {
      res.status(404).send({ error: "Page not found" });
    } else {
      res.status(200).send(result);
    }
  }
  catch(err){
    res.status(500).send("internal server error")
  }
})


// Export the router for use in other files
module.exports = router;
