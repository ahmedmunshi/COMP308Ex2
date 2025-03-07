// user.js
// Load the module dependencies
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Define a new 'UserSchema'
const UserSchema = new Schema({
  username: { 
    type: String, 
    required: [true, 'Please add a username'], 
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Please add an email'], 
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Please add a password'], 
    minlength: [6, 'Password must be at least 6 characters'],
    select: false 
  },
  role: { 
    type: String, 
    enum: ['Admin', 'Member'], 
    default: 'Member' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the 'User' model out of the 'UserSchema'
const User = mongoose.model('User', UserSchema);

// Export the 'User' model
module.exports = User;