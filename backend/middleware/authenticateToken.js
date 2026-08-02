const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token == null) {
    console.error('No token provided');
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  // backend/middleware/authenticateToken.js
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }
    req.user = { id: decodedToken.userId }; // renamed from _id to id to match Postgres convention
    next();
  });
};

module.exports = authenticateToken;


