// team.js
// Load the module dependencies
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'TeamSchema'
const TeamSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a team name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Team name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  teamSlogan: {
    type: String,
    maxlength: [100, 'Team slogan cannot be more than 100 characters']
  },
  expertiseLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  }
});

// Create the 'Team' model out of the 'TeamSchema'
const Team = mongoose.model('Team', TeamSchema);

// Export the 'Team' model
module.exports = Team;