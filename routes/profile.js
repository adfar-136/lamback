const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/auth');

// Create or update profile
router.post('/', protect, async (req, res) => {
  try {
    const profileFields = {
      user: req.user.id,
      fullName: req.body.fullName,
      age: req.body.age,
      gender: req.body.gender,
      image: req.body.image,
      skills: req.body.skills,
      dob: req.body.dob,
      education: req.body.education,
      phoneNumber: req.body.phoneNumber,
      linkedinUrl: req.body.linkedinUrl,
      githubUrl: req.body.githubUrl
    };

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Create
      profile = new Profile(profileFields);
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
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

// Get top 5 quiz attempts for current user
router.get('/quiz-attempts', protect, async (req, res) => {
  try {
    const quizAttempts = await QuizAttempt.find({ student: req.user.id })
      .populate('techStack', ['name', 'icon'])
      .sort({ percentageScore: -1, completedAt: -1 })
      .limit(5);

    // Calculate overall statistics
    const stats = {
      totalAttempts: await QuizAttempt.countDocuments({ student: req.user.id }),
      averageScore: await QuizAttempt.aggregate([
        { $match: { student: req.user.id } },
        { $group: { _id: null, avg: { $avg: "$percentageScore" } } }
      ]).then(result => result[0]?.avg || 0),
      totalPassed: await QuizAttempt.countDocuments({
        student: req.user.id,
        percentageScore: { $gte: 70 }
      })
    };

    res.json({
      quizAttempts,
      stats: {
        totalAttempts: stats.totalAttempts,
        averageScore: Math.round(stats.averageScore * 10) / 10,
        passRate: stats.totalAttempts ? Math.round((stats.totalPassed / stats.totalAttempts) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ message: 'Error fetching quiz attempts' });
  }
});

module.exports = router;