// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

// Authentication middleware
const authenticate = async (req) => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Also check for Authorization header format
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return null;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user by id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
};

// Check if user is authenticated
const isAuthenticated = (user) => {
  if (!user) {
    throw new Error('Not authenticated');
  }
  return true;
};

// Check if user is admin
const isAdmin = (user) => {
  if (!user || user.role !== 'Admin') {
    throw new Error('Not authorized');
  }
  return true;
};

// Check if user is admin or specific user
const isAdminOrSelf = (user, userId) => {
  if (!user || (user.role !== 'Admin' && user._id.toString() !== userId)) {
    throw new Error('Not authorized');
  }
  return true;
};

module.exports = { 
  authenticate,
  isAuthenticated,
  isAdmin,
  isAdminOrSelf
};