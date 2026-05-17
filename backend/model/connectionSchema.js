const mongoose = require('mongoose');
const User = require('../model/User');

const connectionSchema = new mongoose.Schema({
  fromUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  toUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Connection', connectionSchema);