const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tech stack name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  icon: {
    type: String,
    default: 'default-icon.png'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TechStack', techStackSchema);