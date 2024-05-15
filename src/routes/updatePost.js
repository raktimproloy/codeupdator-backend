const express = require("express");
const router = express.Router();
const { Op, where } = require('sequelize');
const { Sequelize, DataTypes } = require("sequelize");
// jwt create data
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const authenticateJWT = require("../middleware/authenticateJWT")
const UpdatePost = require("../models/updatePost")
const ClientUser = require("../models/clientUser");
const removeValueFromArray = require("../utils/removeValueFromArray")

// Route for user signup
router.post("/post", authenticateJWT, async (req, res) => {
  try {
    // Destructuring user input from request body
    const { package_name, version, details, image, date, author, title } = req.body;

    // Input validation
    if (!package_name || !version || !details || !image) {
      return res.status(400).json({ error: "Invalid requirement" });
    }

    // Create a new AdminUser object with validated data
    const newUpdatePost = {
        title,
        package_name,
        version,
        details,
        image,
        date,
        author
    };
    console.log(newUpdatePost)

    const newPost = await UpdatePost.create(newUpdatePost);
    res.send({message: 'New Update Post Posted Successfull', id:newPost.id});
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
    res.status(200).send(posts);
  }
  catch(err){
    res.status(500).send("internal server error")
  }
})

// router.get("/category/:slug", async (req, res) => {
//   try {
//     const posts = await UpdatePost.findAll({
//       where: { package_name: req.params.slug },
//       order: [['id', 'DESC']]
//     });
//     res.status(200).send(posts);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).send("Internal server error");
//   }
// });


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

router.put("/like/:id", authenticateJWT, async (req, res) => {
  try{
    const {post_id, user_id, like_status} = req.body
    const post = await UpdatePost.findOne({ where: { id: post_id } });
    const user = await ClientUser.findOne({ where: { id: user_id } });

    let likes_update_post = JSON.parse(user.likes_update_post)
    let likes_user_id = JSON.parse(post.likes_user_id)

    if(like_status){
      if(!likes_update_post.includes(post_id.toString())){
        likes_update_post.push(post_id.toString())
      }
      if(!likes_user_id.includes(user_id.toString())){
        likes_user_id.push(user_id.toString())
      }
    }else{
      likes_update_post = removeValueFromArray(likes_update_post, post_id.toString());
      likes_user_id = removeValueFromArray(likes_user_id, user_id.toString());
    }
    
    // const updateUser = await ClientUser.update(
    //   { likes_update_post: likes_update_post },
    //   {
    //     where: {
    //       id: user_id
    //     },
    //   },
    // );

    // const updatePost = await UpdatePost.update(
    //   { likes_user_id: likes_user_id },
    //   {
    //     where: {
    //       id: post_id
    //     },
    //   },
    // );


    const [updateUserCount] = await ClientUser.update(
      { likes_update_post: likes_update_post },
      {
        where: {
          id: user_id
        },
      },
    );

    // Fetch the updated user separately
    const updatedUser = await ClientUser.findOne({ where: { id: user_id } });

    const updatePost = await UpdatePost.update(
      { likes_user_id: likes_user_id },
      {
        where: {
          id: post_id
        },
      },
    );
    if (!updateUserCount || !updatePost) {
      res.status(404).send({ error: "Page not found" });
    } else {
      res.status(200).json({message:"Post Liked Successful!", ids: updatedUser.likes_update_post });
    }
  }
  catch(err){
    console.log(err)
    res.status(500).send("internal server error")
  }
})

router.put("/save/:id", authenticateJWT, async (req, res) => {
  try {
    const { post_id, user_id, save_status } = req.body;
    const post = await UpdatePost.findOne({ where: { id: post_id } });
    const user = await ClientUser.findOne({ where: { id: user_id } });

    let saves_update_post = JSON.parse(user.saves_update_post);
    let saves_user_id = JSON.parse(post.saves_user_id);

    if (save_status) {
      if (!saves_update_post.includes(post_id.toString())) {
        saves_update_post.push(post_id.toString());
      }
      if (!saves_user_id.includes(user_id.toString())) {
        saves_user_id.push(user_id.toString());
      }
    } else {
      saves_update_post = removeValueFromArray(saves_update_post, post_id.toString());
      saves_user_id = removeValueFromArray(saves_user_id, user_id.toString());
    }
    const [updateUserCount] = await ClientUser.update(
      { saves_update_post: saves_update_post },
      {
        where: {
          id: user_id
        },
      },
    );

    // Fetch the updated user separately
    const updatedUser = await ClientUser.findOne({ where: { id: user_id } });

    const updatePost = await UpdatePost.update(
      { saves_user_id: saves_user_id },
      {
        where: {
          id: post_id
        },
      },
    );

    if (!updatedUser || !updatePost) {
      res.status(404).send({ error: "Page not found" });
    } else {
      res.status(200).json({ message: "Post Save Successful!", ids: updatedUser.saves_update_post });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
});



router.post("/get/saved/posts", async (req, res) => {
  try {
    console.log(req.body);
    const ids = req.body.ids; // Array of IDs
    const posts = await UpdatePost.findAll({ 
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      order: [
        Sequelize.literal(`FIELD(id, ${ids.join(',')})`),
      ],
    });

    res.status(200).send(posts);
  } catch(err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});


// Export the router for use in other files
module.exports = router;
