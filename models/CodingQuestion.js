const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    trim: true
  },
  expectedOutput: {
    type: String,
    required: true,
    trim: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const codingQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  category: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby']
  },
  tags: [{
    type: String,
    trim: true
  }],
  testCases: [testCaseSchema],
  sampleCode: {
    type: Map,
    of: String,
    required: true
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 2000 // Time limit in milliseconds
  },
  memoryLimit: {
    type: Number,
    required: true,
    default: 256 // Memory limit in MB
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  submissions: {
    total: {
      type: Number,
      default: 0
    },
    successful: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
codingQuestionSchema.index({ category: 1, difficulty: 1 });
codingQuestionSchema.index({ tags: 1 });

module.exports = mongoose.model('CodingQuestion', codingQuestionSchema);