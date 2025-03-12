const mongoose = require('mongoose');

const companyRequirementSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  industryType: {
    type: String,
    required: true,
    trim: true
  },
  educatorRequirements: {
    type: String,
    required: true,
    trim: true
  },
  engagementMode: {
    type: String,
    required: true,
    enum: ['Live', 'Recorded', 'Both'],
    default: 'Live'
  },
  startDate: {
    type: Date,
    required: true
  },
  additionalNotes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
    default: 'Pending'
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

// Update timestamp on save
companyRequirementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CompanyRequirement', companyRequirementSchema);