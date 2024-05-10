const bcrypt = require("bcryptjs")
const saltRounds = 16; // Number of salt rounds for bcrypt

// Create a middleware function to hash passwords
const hashPassword = async (req, res, next) => {
    try {
      bcrypt.genSalt(saltRounds)
      .then(salt => {
        const password = req.body.password
        if(password){
          req.salt = salt;
          return bcrypt.hash(password, salt); 
        }else{
          res.status(400).json({ error: 'Password is required' });
        }
      })
      .then(hash => {
        req.hashedPassword = hash
        next()
      })
      .catch(err => console.error(err.message))
  } catch (error) {
    res.status(500).json({ error: 'Password hashing failed' });
  }
};

module.exports = hashPassword