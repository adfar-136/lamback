const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
});

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'default-icon.svg'
  },
  order: {
    type: Number,
    default: 0
  },
  topics: [topicSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Technology', technologySchema);