const express = require("express");
const router = express.Router();
// jwt create data
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const authenticateJWT = require("../middleware/authenticateJWT")
const UpdatePost = require("../models/updatePost")

// Route for user signup
router.post("/post", authenticateJWT, async (req, res) => {
  try {
    // Destructuring user input from request body
    const { package_name, version, details, image, date } = req.body;

    // Input validation
    if (!package_name || !version || !details || !image) {
      return res.status(400).json({ error: "Invalid requirement" });
    }


    // Create a new AdminUser object with validated data
    const newUpdatePost = {
        package_name,
        version,
        details,
        image,
        date
    };

    const newPost = await UpdatePost.create(newUpdatePost);
    res.send({message: 'New Update Post Posted Successfull'});
    // // Create a new AdminUser instance
    // const newPost = new UpdatePost(newUpdatePost);

    // // Save the new user to the database
    // await newPost
    //   .save()
    //   .then((result) => {
    //     // Successful signup response
    //     res.status(200).json({
    //       message: "New Update Post Posted Successfull",
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

router.get("/get/:id", authenticateJWT, async (req, res) => {
  try{
    const post = await UpdatePost.findOne({ where: { id: req.params.id } });
    // const post = await UpdatePost.findOne({ _id: req.params.id });
      res.status(200).send(post);
  }
  catch(err){
    res.status(500).send("internal server error")
  }
})

router.get("/get", async (req, res) => {
  try{
    const posts = await UpdatePost.findAll({ order: [
      ['id', 'DESC'],
    ],});
    // const posts = await UpdatePost.find().sort({ timestamp: -1 }).exec();
    res.status(200).send(posts);
  }
  catch(err){
    res.status(500).send("internal server error")
  }
})


router.put("/update/:id", authenticateJWT, async (req, res) => {
  try{
    const result = await UpdatePost.update(
      { ...req.body },
      {
        where: {
          id: req.params.id
        },
      },
    );
    // Use async/await to handle the promise returned by findOneAndUpdate
    // const result = await UpdatePost.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });

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

router.delete("/delete/:id", authenticateJWT, async (req, res) => {
  try{
    const post = await UpdatePost.findOne({ where: { id: req.params.id } });
    // const post = await UpdatePost.findOne({ _id: req.params.id });
    if(post){
      await UpdatePost.destroy({
        where: {
          id: req.params.id,
        },
      });
      // await UpdatePost.deleteOne({ id: req.params.id });
      res.status(200).json({
        message: "Post deleted successful!"
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
