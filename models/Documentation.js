const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'heading', 'code', 'image', 'quote', 'table', 'link']
},
  content: {
    type: String,
    required: true
  },
  metadata: {
    language: String, // For code blocks
    level: { // For headings
      type: Number,
      min: 1,
      max: 6
    },
    alt: String, // For images
    caption: String, // For images

  }
});

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: [contentBlockSchema],
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