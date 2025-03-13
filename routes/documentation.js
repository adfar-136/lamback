const express = require('express');
const router = express.Router();
const Technology = require('../models/Documentation');

// Get all technologies with their topics
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await Technology.find().sort('order');
    res.json(technologies);
    console.log(technologies[0].topics[0].content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get a specific technology by slug with its topics
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

module.exports = router;