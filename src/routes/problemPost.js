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
const ProblemPost = require("../models/problemPost");
const removeValueFromArray = require("../utils/removeValueFromArray")

// Route for user signup
router.post("/post", authenticateJWT, async (req, res) => {
  try {
    // Destructuring user input from request body
    const { packages, details, image, date, author, status } = req.body;
    // Input validation
    if (!details) {
      return res.status(400).json({ error: "Invalid requirement" });
    }

    const user = await ClientUser.findOne({ where: { id: author } });
    let problem_posts = JSON.parse(user.problem_posts_id)

    // Create a new AdminUser object with validated data
    const newProblemPost = {
        packages,
        details,
        status,
        image,
        date,
        author
    };

    const newProblem = await ProblemPost.create(newProblemPost);
    console.log(newProblem.id)
    if(!problem_posts.includes(newProblem.id.toString())){
      problem_posts.push(newProblem.id.toString())
    }

    const [updateUserCount] = await ClientUser.update(
      { problem_posts_id: problem_posts },
      {
        where: {
          id: author
        },
      },
    );
    res.send({message: 'New Problem Post Posted Successfull', id:newProblem.id});
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
    const post = await ProblemPost.findOne({ where: { id: req.params.id } });
      res.status(200).send(post);
  }
  catch(err){
    res.status(500).send("internal server error")
  }
})

router.get("/:page", async (req, res) => {
  try {
    // Get the page number from the route parameters
    const page = parseInt(req.params.page);
    const pageSize = 30; // Number of records per page

    if (isNaN(page) || page < 1) {
      return res.status(400).send("Invalid page number");
    }

    // Calculate the offset based on the page number and page size
    const offset = (page - 1) * pageSize;

    // Fetch records using pagination
    const posts = await ProblemPost.findAll({
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    });

    if (posts.length === 0) {
      return res.status(200).send([]);
    }

    // Use Promise.all to handle async operations in parallel
    const updatedPosts = await Promise.all(posts.map(async (post) => {
      const user = await ClientUser.findOne({ where: { id: post.author } });

      return {
        ...post.get(), // Convert the Sequelize instance to a plain object
        author_image: user ? user.profile_image : null,
        author_name: user ? user.full_name : null,
        author_username: user ? user.username : null
      };
    }));

    // Sending the response
    res.status(200).send(updatedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

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
    const post = await ProblemPost.findOne({ where: { id: post_id } });
    const user = await ClientUser.findOne({ where: { id: user_id } });

    let likes_problem_post = JSON.parse(user.likes_problem_post)
    let likes_user_id = JSON.parse(post.likes_user_id)

    if(like_status){
      if(!likes_problem_post.includes(post_id.toString())){
        likes_problem_post.push(post_id.toString())
      }
      if(!likes_user_id.includes(user_id.toString())){
        likes_user_id.push(user_id.toString())
      }
    }else{
      likes_problem_post = removeValueFromArray(likes_problem_post, post_id.toString());
      likes_user_id = removeValueFromArray(likes_user_id, user_id.toString());
    }
    const [updateUserCount] = await ClientUser.update(
      { likes_problem_post: likes_problem_post },
      {
        where: {
          id: user_id
        },
      },
    );

    // Fetch the updated user separately
    const updatedUser = await ClientUser.findOne({ where: { id: user_id } });

    const updatePost = await ProblemPost.update(
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
      res.status(200).json({message:"Post Liked Successful!", ids: updatedUser.likes_problem_post });
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
    const post = await ProblemPost.findOne({ where: { id: post_id } });
    const user = await ClientUser.findOne({ where: { id: user_id } });

    let saves_problem_post = JSON.parse(user.saves_problem_post);
    let saves_user_id = JSON.parse(post.saves_user_id);

    if (save_status) {
      if (!saves_problem_post.includes(post_id.toString())) {
        saves_problem_post.push(post_id.toString());
      }
      if (!saves_user_id.includes(user_id.toString())) {
        saves_user_id.push(user_id.toString());
      }
    } else {
      saves_problem_post = removeValueFromArray(saves_problem_post, post_id.toString());
      saves_user_id = removeValueFromArray(saves_user_id, user_id.toString());
    }
    const [updateUserCount] = await ClientUser.update(
      { saves_problem_post: saves_problem_post },
      {
        where: {
          id: user_id
        },
      },
    );

    // Fetch the updated user separately
    const updatedUser = await ClientUser.findOne({ where: { id: user_id } });

    const updatePost = await ProblemPost.update(
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
      res.status(200).json({ message: "Post Save Successful!", ids: updatedUser.saves_problem_post });
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
