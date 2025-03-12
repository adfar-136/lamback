const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CompanyRequirement = require('../models/CompanyRequirement');

// POST /api/company-requirements - Submit a new company requirement
router.post('/', async (req, res) => {
  try {
    const {
      companyName,
      email,
      contactPerson,
      phone,
      industryType,
      educatorRequirements,
      engagementMode,
      startDate,
      additionalNotes
    } = req.body;

    const companyRequirement = new CompanyRequirement({
      companyName,
      email,
      contactPerson,
      phone,
      industryType,
      educatorRequirements,
      engagementMode,
      startDate: new Date(startDate),
      additionalNotes
    });

    await companyRequirement.save();

    res.status(201).json({
      success: true,
      message: 'Company requirement submitted successfully',
      data: companyRequirement
    });
  } catch (error) {
    console.error('Error submitting company requirement:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting company requirement',
      error: error.message
    });
  }
});

// GET /api/company-requirements - Get all company requirements (admin only)
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const requirements = await CompanyRequirement.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requirements
    });
  } catch (error) {
    console.error('Error fetching company requirements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company requirements',
      error: error.message
    });
  }
});

// GET /api/company-requirements/:id - Get a specific company requirement (admin only)
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const requirement = await CompanyRequirement.findById(req.params.id);
    
    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Company requirement not found'
      });
    }

    res.json({
      success: true,
      data: requirement
    });
  } catch (error) {
    console.error('Error fetching company requirement:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company requirement',
      error: error.message
    });
  }
});

// PUT /api/company-requirements/:id/status - Update requirement status (admin only)
router.put('/:id/status', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { status } = req.body;
    
    if (!['Pending', 'Reviewed', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const requirement = await CompanyRequirement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Company requirement not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: requirement
    });
  } catch (error) {
    console.error('Error updating requirement status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating requirement status',
      error: error.message
    });
  }
});

module.exports = router;