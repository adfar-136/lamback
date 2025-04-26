const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  selectedCourse: {
    type: String,
    required: true,
    enum: ['Frontend Development Fundamentals', 'React.js Mastery', 'Node.js Backend Development']
  },
  whatsappNumber: {
    type: String,
    required: true
  },
  contactNumber: String,
  education: {
    type: String,
    required: true
  },
  workStatus: {
    type: String,
    required: true,
    enum: ['student', 'employed', 'unemployed', 'other']
  },
  preferredTime: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'evening']
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'enrolled', 'rejected'],
    default: 'pending'
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema); 