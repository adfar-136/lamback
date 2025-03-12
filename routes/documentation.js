const express = require('express');
const router = express.Router();
const Technology = require('../models/Documentation');

// Get all technologies
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await Technology.find().sort('order');
    res.json(technologies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific technology by slug
router.get('/technologies/:slug', async (req, res) => {
  try {
    const technology = await Technology.findOne({ slug: req.params.slug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }
    res.json(technology);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific topic by technology slug and topic slug
router.get('/technologies/:techSlug/topics/:topicSlug', async (req, res) => {
  try {
    const technology = await Technology.findOne({ slug: req.params.techSlug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    const topic = technology.topics.find(t => t.slug === req.params.topicSlug);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed initial documentation data
router.post('/seed', async (req, res) => {
  try {
    const initialData = [
      {
        name: 'HTML',
        slug: 'html',
        description: 'Learn the fundamentals of HTML, the backbone of web content.',
        icon: 'html-icon.svg',
        order: 1,
        topics: [
          {
            title: 'Introduction to HTML',
            slug: 'intro',
            content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.',
            order: 1
          },
          {
            title: 'HTML Elements',
            slug: 'elements',
            content: 'HTML elements are the building blocks of HTML pages. Elements are represented by tags.',
            order: 2
          }
        ]
      },
      {
        name: 'CSS',
        slug: 'css',
        description: 'Master CSS to style and layout your web pages.',
        icon: 'css-icon.svg',
        order: 2,
        topics: [
          {
            title: 'CSS Basics',
            slug: 'basics',
            content: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
            order: 1
          },
          {
            title: 'CSS Selectors',
            slug: 'selectors',
            content: 'CSS selectors are used to select the HTML elements you want to style.',
            order: 2
          }
        ]
      },
      {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Learn JavaScript to create interactive and dynamic web applications.',
        icon: 'js-icon.svg',
        order: 3,
        topics: [
          {
            title: 'JavaScript Fundamentals',
            slug: 'fundamentals',
            content: 'JavaScript is a programming language that enables interactive web pages.',
            order: 1
          },
          {
            title: 'DOM Manipulation',
            slug: 'dom',
            content: 'Learn how to manipulate the Document Object Model (DOM) using JavaScript.',
            order: 2
          }
        ]
      }
    ];

    await Technology.deleteMany({}); // Clear existing data
    await Technology.insertMany(initialData);

    res.json({ message: 'Documentation data seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;