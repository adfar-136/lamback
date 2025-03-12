const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'default-stack-icon.svg'
  },
  levels: [{
    name: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description: {
      type: String,
      required: true
    },
    requiredScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

techStackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TechStack', techStackSchema);