const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'heading', 'code', 'image', 'table', 'link', 'ordered-list', 'unordered-list']
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function(value) {
        // For list types, content can be empty since we use metadata.items
        if (this.type === 'ordered-list' || this.type === 'unordered-list') {
          return true;
        }
        // For other types, content should be a non-empty string
        return typeof value === 'string' && value.trim() !== '';
      },
      message: 'Content must be a non-empty string for non-list blocks'
    }
  },
  metadata: {
    language: String,
    level: {
      type: Number,
      min: 1,
      max: 6
    },
    alt: String,
    caption: String,
    items: {
      type: [String],
      validate: {
        validator: function(value) {
          if (this.type === 'ordered-list' || this.type === 'unordered-list') {
            return Array.isArray(value) && value.length > 0 && value.every(item => item.trim() !== '');
          }
          return true;
        },
        message: 'Lists must have at least one non-empty item'
      }
    }
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