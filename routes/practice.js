const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const TechStack = require('../models/TechStack');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const mongoose = require('mongoose');

// Public route - anyone can view tech stacks
router.get('/tech-stacks', async (req, res) => {
  try {
    const techStacks = await TechStack.find({ isActive: true });
    
    const techStacksWithCounts = await Promise.all(techStacks.map(async (stack) => {
      const counts = await Question.aggregate([
        {
          $match: {
            techStack: stack._id,
            isActive: true
          }
        },
        {
          $group: {
            _id: '$difficulty',
            count: { $sum: 1 }
          }
        }
      ]);

      const questionCounts = {
        beginner: 0,
        intermediate: 0,
        advanced: 0
      };

      counts.forEach(count => {
        questionCounts[count._id] = count.count;
      });

      return {
        _id: stack._id,
        name: stack.name,
        description: stack.description,
        questionCounts
      };
    }));

    res.json(techStacksWithCounts);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    res.status(500).json({ message: 'Error fetching tech stacks' });
  }
});

// Protected routes - require login but no other authorization
router.use(protect); // Apply protect middleware to all routes below this

// Start a new quiz
router.post('/start', async (req, res) => {
  try {
    const { techStackId, difficulty } = req.body;

    // Get random questions for the quiz
    const questions = await Question.aggregate([
      {
        $match: {
          techStack: new mongoose.Types.ObjectId(techStackId),
          difficulty,
          isActive: true
        }
      },
      { $sample: { size: 10 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions available' });
    }

    // Create new quiz attempt
    const quizAttempt = new QuizAttempt({
      user: req.user.id,
      techStack: techStackId,
      difficulty,
      questions: questions.map(q => ({
        question: q._id
      }))
    });

    await quizAttempt.save();

    // Send questions without correct answers
    const sanitizedQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options.map(opt => opt.text),
      timeLimit: q.timeLimit,
      score: q.score
    }));

    res.json({
      attemptId: quizAttempt._id,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz attempt
router.post('/submit/:attemptId', async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('questions.question');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    let totalScore = 0;
    attempt.questions = attempt.questions.map((q, i) => {
      const isCorrect = q.question.options[answers[i]].isCorrect;
      if (isCorrect) totalScore += q.question.score;
      
      return {
        ...q,
        selectedOption: answers[i],
        isCorrect
      };
    });

    attempt.totalScore = totalScore;
    attempt.completed = true;
    await attempt.save();

    res.json({
      totalScore,
      questions: attempt.questions.map(q => ({
        question: q.question.question,
        selectedOption: q.selectedOption,
        isCorrect: q.isCorrect,
        explanation: q.question.explanation
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's quiz history
router.get('/history', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user.id })
      .populate('techStack', 'name')
      .sort('-createdAt');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add tech stack - any logged in user can add
router.post('/tech-stacks', async (req, res) => {
  try {
    const techStack = new TechStack({
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon || 'default-icon.png',
      isActive: true
    });
    
    await techStack.save();
    res.status(201).json(techStack);
  } catch (error) {
    console.error('Error adding tech stack:', error);
    res.status(500).json({ 
      message: error.code === 11000 
        ? 'Tech stack with this name already exists' 
        : error.message 
    });
  }
});

// Add question - any logged in user can add
router.post('/questions', async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      createdBy: req.user.id // Add the user ID who created the question
    });
    
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get questions - any logged in user can view
router.get('/questions/:techStackId/:difficulty', async (req, res) => {
  try {
    const questions = await Question.find({
      techStack: req.params.techStackId,
      difficulty: req.params.difficulty,
      isActive: true
    }).select('-options.isCorrect'); // Don't send correct answers to frontend

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

module.exports = router; 