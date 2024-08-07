const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT")
const postCategory = require("../models/postCategory")
const Setting = require("../models/setting")

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

router.get("/get", async (req, res) => {
    try {
      // Find the category based on package_name
      const setting = await Setting.findAll({ where: {  } });
      
      console.log(setting)
      if(setting){
        // Sending response
        res.status(200).json({ data: setting[0] });
      }else{
        res.status(404).send({message: "No Setting Found!"});
      }
    } catch(err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
});

router.post("/post", async (req, res) => {
    try {
      const { site_name, site_logo, site_favicon, email, phone, packages, navbar, status } = req.body;
      console.log(req.body);
  
      const newSettingPost = {
        site_name,
        site_logo,
        site_favicon,
        email,
        phone,
        packages,
        navbar,
        status,
      };
  
      const newSetting = await Setting.create(newSettingPost);
      console.log(newSetting);
  
  
      res.status(201).send({
        message: 'New Setting Post Posted Successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: error.message,
      });
    }
});

router.put("/update/navbar", authenticateJWT, async (req, res) => {
    try {
      const { navbar } = req.body;
        console.log(navbar)
      if (navbar) {
        const updatePost = await Setting.update(
          { navbar: navbar },
          { where: { id: 1 } }
        );
        console.log(updatePost)
        res.send({ message: 'Update Navbar Successful' });
      } else {
        res.status(400).send({ message: 'Invalid Navbar Data' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  });
  


module.exports = router;
