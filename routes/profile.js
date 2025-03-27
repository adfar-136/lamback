const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Create or update profile
router.post('/', protect, async (req, res) => {
  try {
    // Basic validation
    if (!req.body.fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    // Create profile fields object with basic data
    const profileFields = {
      user: req.user.id,
      fullName: req.body.fullName.trim(),
      phoneNumber: req.body.phoneNumber || null,
      age: req.body.age || null,
      gender: req.body.gender || null,
      dob: req.body.dob || null,
      linkedinUrl: req.body.linkedinUrl || null,
      githubUrl: req.body.githubUrl || null
    };

    // Handle skills array
    profileFields.skills = Array.isArray(req.body.skills) 
      ? req.body.skills.filter(skill => skill && skill.trim()) 
      : [];

    // Handle education array
    if (Array.isArray(req.body.education)) {
      profileFields.education = req.body.education
        .filter(edu => edu.institution || edu.degree || edu.field)
        .map(edu => ({
          institution: edu.institution?.trim() || '',
          degree: edu.degree?.trim() || '',
          field: edu.field?.trim() || '',
          startYear: edu.startYear || null,
          endYear: edu.current ? null : (edu.endYear || null),
          current: Boolean(edu.current)
        }));
    } else {
      profileFields.education = [];
    }

    // Update or create profile
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).populate('user', 'username email');
    } else {
      // Create
      profile = new Profile(profileFields);
      await profile.save();
      await profile.populate('user', 'username email');
    }

    res.json(profile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', ['username', 'email', 'role']);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get profile by user ID
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id })
      .populate('user', ['username', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete profile & user
router.delete('/', protect, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;