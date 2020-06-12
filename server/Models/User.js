const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  firstName: {
    type: String, 
    required: [true, 'Please type your First Name']
  },
  lastName: {
    type: String,
    required: [true, 'Please type your last Name']
  },
  email: {
    type: String,
    required: [true, 'Please type your email address']
  }, 
  password: { 
    type: String, 
    required: [true, 'Please input a strong password'] 
  },
  role: { 
    type: String, 
    required: true, 
    default: 'user' 
  },
  bio: { 
    type: String, 
    required: false 
  }
});

module.exports = mongoose.model('user', userModel);