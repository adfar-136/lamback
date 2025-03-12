const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: Number,
      required: true,
      default: -1 // Default value for unanswered questions
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalScore: {
    type: Number,
    required: true,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentageScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  completedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for calculating pass/fail status
quizAttemptSchema.virtual('isPassed').get(function() {
  return this.percentageScore >= 70; // 70% is passing score
});

// Index for efficient querying
quizAttemptSchema.index({ student: 1, techStack: 1, createdAt: -1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);