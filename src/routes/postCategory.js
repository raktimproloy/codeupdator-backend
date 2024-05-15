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
const postCategory = require("../models/postCategory")
const removeValueFromArray = require("../utils/removeValueFromArray")

router.get("/get/:package", async (req, res) => {
  try {
    // Find the category based on package_name
    const category = await postCategory.findOne({ where: { package_name: req.params.package } });
    
    // Parsing JSON string to array
    const categoryPostsId = JSON.parse(category.posts_id);
    console.log(categoryPostsId);
    
    // Fetching posts based on IDs
    const posts = await UpdatePost.findAll({
      where: { id: categoryPostsId },
      order: [['id', 'DESC']]
    });

    // Constructing response data
    const responseData = {
      category: category,
      posts: posts
    };

    // Sending response
    res.status(200).json({ data: responseData });
  } catch(err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});




// Version Sorting
const compareVersions = (a, b) => {
  const versionA = a.split('.').map(Number);
  const versionB = b.split('.').map(Number);

  for (let i = 0; i < versionA.length; i++) {
      if (versionA[i] < versionB[i]) return 1;
      if (versionA[i] > versionB[i]) return -1;
  }
  return 0;
};


router.put("/update", authenticateJWT, async (req, res) => {
  try {
    const { package_name, version, posts_id } = req.body;
    const category = await postCategory.findOne({ where: { package_name: package_name } });
    if(category){
        // Version Setup
        const oldVersion = JSON.parse(category.version) || []
        if (version && !oldVersion.includes(version)) {
          oldVersion.push(version);
        }
        oldVersion.sort(compareVersions);

        // Version Setup
        const oldPosts_id = JSON.parse(category.posts_id) || []
          if(posts_id && !oldPosts_id.includes(posts_id.toString())){
            oldPosts_id.push(posts_id.toString())
          }

        const updateCategory = {
            version: oldVersion,
            posts_id: oldPosts_id,
        }
        // console.log("updateCategory", updateCategory)
        const updatePost = await postCategory.update(
            {...updateCategory},
            {
                where: { package_name: package_name }
            },
        );
        const updatedCategory = await postCategory.findOne({ where: { package_name: package_name } });
        res.send({message: 'Update Category Successfull'});
    }else{
        const {title, package_name, version, posts_id} = req.body;
        const updateCategory = {
          title,
          package_name,
          version:[version],
          posts_id: [posts_id.toString()]
      }
        const newCategory = await postCategory.create(updateCategory);
        res.send({message: 'New Category Posted Successfull'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
});



// Export the router for use in other files
module.exports = router;
