const express = require("express");
const router = express.Router();
const Package = require("../models/package");
const bcrypt = require("bcryptjs")
// jwt create data
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const authenticateJWT = require("../middleware/authenticateJWT")

// Route for user signup
router.post("/add", async (req, res) => {
  try {
    // Destructuring user input from request body
    const { title, slug, font_color, bg_color, status } = req.body;

    // Create a new AdminUser object with validated data
    const newPackage = {
        title,
        slug,
        font_color,
        bg_color,
        status
    };

  const package = await Package.create(newPackage);
  res.send({message: 'Package added successfully', data: package});
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.message,
    });
  }
});

router.put("/update/:id", async (req, res) => {
    const { title, slug, font_color, bg_color, status } = req.body;
    const id = req.params.id;

    const updatePackage = {
        title,
        slug,
        font_color,
        bg_color,
        status,
    }
    try{
        const package = await Package.update(            
          {...updatePackage},
          {
              where: { id: id }
          },);
          res.status(200).send("Package updated!")
    }
    catch(err){
        console.log(err)
        res.status(500).send("internal server error")
    }
})

router.get("/get", async (req, res) => {
    try{
      const package = await Package.findAll({ order: [
        ['id', 'DESC'],
    ],});
        res.status(200).send(package);
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
