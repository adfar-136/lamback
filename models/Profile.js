const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false
  },
  image: {
    type: String,
  },
  skills: [{
    type: String,
    trim: true
  }],
  dob: {
    type: Date,
    required: false
  },
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    startYear: {
      type: Number,
      required: true
    },
    endYear: {
      type: Number
    },
    current: {
      type: Boolean,
      default: false
    }
  }],
  phoneNumber: {
    type: String,
    required: false
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;