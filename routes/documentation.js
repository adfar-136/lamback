const express = require('express');
const router = express.Router();
const Technology = require('../models/Documentation');
const { protect, authorize } = require('../middleware/auth');

// Get all technologies with their topics
router.get('/technologies', async (req, res) => {
  try {
    const technologies = await Technology.find().sort('order');
    res.json(technologies);
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

// Create a new technology
router.post('/technologies', async (req, res) => {
  try {
    const { name, slug, description, icon, order } = req.body;

    // Check if technology with the same slug already exists
    const existingTechnology = await Technology.findOne({ slug });
    if (existingTechnology) {
      return res.status(400).json({ message: 'Technology with this slug already exists' });
    }

    const technology = new Technology({
      name,
      slug,
      description,
      icon,
      order,
      topics: []
    });

    const savedTechnology = await technology.save();
    res.status(201).json(savedTechnology);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new topic to a technology
router.post('/technologies/:slug/topics', async (req, res) => {
  try {
    const { title, slug: topicSlug, content, order } = req.body;

    const technology = await Technology.findOne({ slug: req.params.slug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    // Check if topic with the same slug already exists
    const topicExists = technology.topics.some(t => t.slug && t.slug.toLowerCase() === topicSlug.toLowerCase());
    if (topicExists) {
      return res.status(400).json({ message: 'Topic with this slug already exists' });
    }

    // Validate content blocks
    if (content && Array.isArray(content)) {
      for (const block of content) {
        if (!block.type || !['text', 'heading', 'code', 'image', 'list', 'quote', 'table', 'video', 'link', 'button', 'divider'].includes(block.type)) {
          return res.status(400).json({ message: 'Invalid content block type' });
        }
        
        if (!block.content) {
          return res.status(400).json({ message: 'Content is required for each block' });
        }

        // Validate metadata based on block type
        if (block.type === 'heading' && (!block.metadata || !block.metadata.level || 
            block.metadata.level < 1 || block.metadata.level > 6)) {
          return res.status(400).json({ message: 'Heading blocks require a valid level (1-6)' });
        }

        if (block.type === 'code' && (!block.metadata || !block.metadata.language)) {
          return res.status(400).json({ message: 'Code blocks require a language' });
        }

        if (block.type === 'image' && (!block.metadata || !block.metadata.alt)) {
          return res.status(400).json({ message: 'Image blocks require alt text' });
        }
      }
    }

    const newTopic = {
      title,
      slug: topicSlug,
      content: content || [],
      order: order || 0
    };

    technology.topics.push(newTopic);
    await technology.save();

    res.status(201).json(newTopic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add or update content blocks in a topic
router.post('/technologies/:techSlug/topics/:topicSlug/content', async (req, res) => {
  try {
    const { contentBlocks } = req.body;

    if (!contentBlocks || !Array.isArray(contentBlocks)) {
      return res.status(400).json({ message: 'Content blocks array is required' });
    }

    const technology = await Technology.findOne({ slug: req.params.techSlug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    const topicIndex = technology.topics.findIndex(t => t.slug === req.params.topicSlug);
    if (topicIndex === -1) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Validate content blocks
    for (const block of contentBlocks) {
      if (!block.type || !['text', 'heading', 'code', 'image', 'list', 'quote', 'table', 'video', 'link', 'button', 'divider'].includes(block.type)) {
        return res.status(400).json({ message: 'Invalid content block type' });
      }
      
      if (!block.content) {
        return res.status(400).json({ message: 'Content is required for each block' });
      }

      // Validate metadata based on block type
      if (block.type === 'heading' && (!block.metadata || !block.metadata.level || 
          block.metadata.level < 1 || block.metadata.level > 6)) {
        return res.status(400).json({ message: 'Heading blocks require a valid level (1-6)' });
      }

      if (block.type === 'code' && (!block.metadata || !block.metadata.language)) {
        return res.status(400).json({ message: 'Code blocks require a language' });
      }

      if (block.type === 'image' && (!block.metadata || !block.metadata.alt)) {
        return res.status(400).json({ message: 'Image blocks require alt text' });
      }
    }

    // Add new content blocks to the topic
    technology.topics[topicIndex].content = [
      ...technology.topics[topicIndex].content,
      ...contentBlocks
    ];

    await technology.save();

    res.status(200).json(technology.topics[topicIndex]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a technology
router.put('/technologies/:slug', protect, async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    const technology = await Technology.findOne({ slug: req.params.slug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    if (name) technology.name = name;
    if (description) technology.description = description;
    if (icon) technology.icon = icon;
    if (order !== undefined) technology.order = order;

    const updatedTechnology = await technology.save();
    res.json(updatedTechnology);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a topic
router.put('/technologies/:techSlug/topics/:topicSlug', protect, async (req, res) => {
  try {
    const { title, order } = req.body;

    const technology = await Technology.findOne({ slug: req.params.techSlug });
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    const topicIndex = technology.topics.findIndex(t => t.slug === req.params.topicSlug);
    if (topicIndex === -1) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (title) technology.topics[topicIndex].title = title;
    if (order !== undefined) technology.topics[topicIndex].order = order;

    await technology.save();

    res.json(technology.topics[topicIndex]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;