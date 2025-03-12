const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CodingQuestion = require('../models/CodingQuestion');
const CodingSubmission = require('../models/CodingSubmission');

// Get all coding questions with filters
router.get('/questions', protect, async (req, res) => {
  try {
    const { category, difficulty, tags, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (page - 1) * limit;

    const questions = await CodingQuestion.find(query)
      .select('-testCases.isHidden') // Exclude hidden test cases
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await CodingQuestion.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching coding questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get a specific coding question
router.get('/questions/:id', protect, async (req, res) => {
  try {
    const question = await CodingQuestion.findById(req.params.id)
      .select('-testCases.isHidden'); // Exclude hidden test cases

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Error fetching coding question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Run code against test cases
router.post('/run/:questionId', protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    const question = await CodingQuestion.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // TODO: Implement actual code execution
    // For now, return mock test results
    const mockResults = {
      results: question.testCases.map(testCase => ({
        passed: Math.random() > 0.5,
        expected: testCase.expectedOutput,
        actual: 'Sample output',
        error: null
      }))
    };

    res.json(mockResults);
  } catch (error) {
    console.error('Error running code:', error);
    res.status(500).json({ message: 'Error running code' });
  }
});

// Submit a solution
router.post('/submit/:questionId', protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    const question = await CodingQuestion.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create submission record
    const submission = new CodingSubmission({
      student: req.user.id,
      question: question._id,
      code,
      language,
      totalTestCases: question.testCases.length
    });

    // TODO: Implement code execution and test case validation
    // This would typically be handled by a separate service
    // For now, we'll just save the submission
    await submission.save();

    // Update question submission stats
    await CodingQuestion.findByIdAndUpdate(question._id, {
      $inc: { 'submissions.total': 1 }
    });

    res.status(201).json({
      message: 'Solution submitted successfully',
      submissionId: submission._id
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ message: 'Error submitting solution' });
  }
});

// Get submission history for a user
router.get('/submissions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const submissions = await CodingSubmission.find({ student: req.user.id })
      .populate('question', 'title difficulty category')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await CodingSubmission.countDocuments({ student: req.user.id });

    // Calculate user statistics
    const stats = {
      totalSubmissions: total,
      acceptedSubmissions: await CodingSubmission.countDocuments({
        student: req.user.id,
        status: 'Accepted'
      }),
      averageScore: await CodingSubmission.aggregate([
        { $match: { student: req.user.id } },
        { $group: { _id: null, avg: { $avg: '$score' } } }
      ]).then(result => result[0]?.avg || 0)
    };

    res.json({
      submissions,
      stats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching submission history:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// Create a new coding question (admin only)
router.post('/questions', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create questions' });
    }

    const question = new CodingQuestion({
      ...req.body,
      createdBy: req.user.id
    });

    await question.save();

    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    console.error('Error creating coding question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

module.exports = router;