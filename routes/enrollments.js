const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

// Create new enrollment
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      selectedCourse,
      contactNumber,
      whatsappNumber,
      education,
      workStatus,
      reason,
      preferredTime
    } = req.body;

    // Create enrollment record
    const enrollment = new Enrollment({
      fullName,
      email,
      selectedCourse,
      contactNumber,
      whatsappNumber,
      education,
      workStatus,
      reason,
      preferredTime,
      status: 'pending'
    });

    await enrollment.save();

    res.json({ 
      success: true,
      message: 'Enrollment request received successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all enrollments - Admin only route
router.get('/all', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a route to get enrollments without authentication
router.get('/list', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version key
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 