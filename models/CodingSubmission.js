const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingQuestion',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby']
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Running', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error'],
    default: 'Pending'
  },
  executionTime: {
    type: Number,
    default: 0 // in milliseconds
  },
  memoryUsed: {
    type: Number,
    default: 0 // in MB
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    required: true
  },
  errorMessage: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
codingSubmissionSchema.index({ student: 1, question: 1 });
codingSubmissionSchema.index({ status: 1 });
codingSubmissionSchema.index({ createdAt: -1 });

// Virtual field for success rate
codingSubmissionSchema.virtual('successRate').get(function() {
  return this.testCasesPassed / this.totalTestCases * 100;
});

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);