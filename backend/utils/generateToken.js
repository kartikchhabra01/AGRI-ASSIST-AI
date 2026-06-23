/**
 * Generate JWT Token
 * Creates a signed JWT token for user authentication
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const payload = {
    userId
  };

  const options = {
    expiresIn: '7d' // Token expires in 7 days
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = generateToken;
