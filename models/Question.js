const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  techStack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack',
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  timeLimit: {
    type: Number,
    required: true,
    default: function() {
      const timeLimits = {
        'Beginner': 30,
        'Intermediate': 45,
        'Advanced': 60
      };
      return timeLimits[this.level];
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Set default timeLimit based on level before saving
questionSchema.pre('save', function(next) {
  const timeLimits = {
    'Beginner': 30,
    'Intermediate': 45,
    'Advanced': 60
  };
  this.timeLimit = timeLimits[this.level];
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);