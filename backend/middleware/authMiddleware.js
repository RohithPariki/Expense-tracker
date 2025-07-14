// why is this file needed?
// This file is needed to handle authentication for the backend API. 
// It checks if the user is authenticated before allowing access to certain routes.
// It uses JWT (JSON Web Tokens) to verify the user's identity based on the token provided in the request headers.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

 //req.headers.authorization:
// req.headers → contains all HTTP headers sent with the request
// .authorization → is the header that usually contains the JWT token 
//Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...  


// Protect routes middleware
const protect = async (req, res, next) => {
  let token; 

  // Check if token exists in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password'); // if an error is thrown , then it goes to the catch block


      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }


  // If no token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = { protect };