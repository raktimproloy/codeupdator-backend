const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ error: 'Authentication failed' });
    const token = authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'Authentication failed' });
    try {
        const decoded = jwt.verify(token, secretKey);

        const { id, first_name, last_name, email, exp } = decoded;

        // Get the current timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (exp && exp > currentTimestamp) {
            req.user = decoded;
            console.log(decoded)
            next();
        }else{
            res.status(401).json({ error: 'Authentication failed' });
        }
    } catch (error) {
      res.status(400).json({ message: 'Authentication failed' });
    }
  };

module.exports = authenticateJWT