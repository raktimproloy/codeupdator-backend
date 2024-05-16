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

router.put("/interest", authenticateJWT, async (req, res) => {
  try {
    const { user_id, remove_interest, add_interest } = req.body;

    // Fetch categories for removal
    const categoriesToRemove = await postCategory.findAll({ where: { package_name: remove_interest } });

    // Fetch categories for addition
    const categoriesToAdd = await postCategory.findAll({ where: { package_name: add_interest } });

    // Update interest counts and user ids for categories to remove
    for (const category of categoriesToRemove) {
      let interest_user_id = JSON.parse(category.interest_user_id);
      const index = interest_user_id.indexOf(user_id.toString());
      if (index !== -1) {
        interest_user_id.splice(index, 1);
        await postCategory.update(
          { interest_user_id: interest_user_id, interest_count: interest_user_id.length },
          { where: { id: category.id } }
        );
      }
    }

    // Update interest counts and user ids for categories to add
    for (const category of categoriesToAdd) {
      let interest_user_id = JSON.parse(category.interest_user_id);
      if (!interest_user_id.includes(user_id.toString())) {
        interest_user_id.push(user_id.toString());
        await postCategory.update(
          { interest_user_id: interest_user_id, interest_count: interest_user_id.length },
          { where: { id: category.id } }
        );
      }
    }

    res.status(200).json({ message: "Interests updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
