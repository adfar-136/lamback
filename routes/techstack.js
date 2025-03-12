const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const TechStack = require('../models/TechStack');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const { protect } = require('../middleware/auth');

// Get all tech stacks
router.get('/', async (req, res) => {
  try {
    const techStacks = await TechStack.find({ isActive: true });
    res.json(techStacks);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    res.status(500).json({ message: 'Error fetching tech stacks' });
  }
});

// Get questions for a specific tech stack and level
router.get('/:techStackId/questions/:level', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to access questions' });
    }

    const { techStackId, level } = req.params;
    
    // Validate level parameter
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }

    // Validate techStackId format
    if (!mongoose.Types.ObjectId.isValid(techStackId)) {
      return res.status(400).json({ message: 'Invalid tech stack ID format' });
    }

    // Check if tech stack exists
    const techStack = await TechStack.findById(techStackId);
    if (!techStack) {
      return res.status(404).json({ message: 'Tech stack not found' });
    }

    // Get 10 random questions for the specified tech stack and level
    const questions = await Question.aggregate([
      { 
        $match: {
          techStack: new mongoose.Types.ObjectId(techStackId),
          level,
          isActive: true
        }
      },
      { $sample: { size: 10 } },
      { 
        $project: {
          questionText: 1,
          options: {
            $map: {
              input: "$options",
              as: "option",
              in: {
                text: "$$option.text",
                _id: "$$option._id"
              }
            }
          },
          timeLimit: 1,
          points: 1
        }
      }
    ]);

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this tech stack and level' });
    }

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tech stack ID format' });
    }
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Submit quiz answers
router.post('/:techStackId/questions/:level/submit', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to submit quiz' });
    }

    const { techStackId, level } = req.params;
    const { answers } = req.body;

    // Enhanced validation for answers format
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format - answers must be an array' });
    }

    // Validate answer structure
    const isValidAnswerFormat = answers.every(answer => {
      return (
        answer.questionId &&
        mongoose.Types.ObjectId.isValid(answer.questionId) &&
        (typeof answer.selectedOptionIndex === 'number' && answer.selectedOptionIndex >= -1)
      );
    });

    if (!isValidAnswerFormat) {
      return res.status(400).json({
        message: 'Invalid answer format - each answer must have questionId and selectedOptionIndex'
      });
    }

    // Validate level parameter
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }

    // Validate techStackId format
    if (!mongoose.Types.ObjectId.isValid(techStackId)) {
      return res.status(400).json({ message: 'Invalid tech stack ID format' });
    }

    // Get the original questions to verify answers
    const questions = await Question.find({
      _id: { $in: answers.map(a => a.questionId) },
      techStack: techStackId,
      level
    });

    if (!questions.length) {
      return res.status(404).json({ message: 'Questions not found' });
    }

    if (questions.length !== answers.length) {
      return res.status(400).json({
        message: 'Mismatch between submitted answers and valid questions'
      });
    }

    // Calculate score and prepare attempt details
    const questionAttempts = [];
    let totalScore = 0;
    const pointsPerQuestion = 5;

    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (!question) {
        return res.status(400).json({
          message: `Question with ID ${answer.questionId} not found or does not belong to this quiz`
        });
      }

      // Handle unanswered questions
      if (answer.selectedOptionIndex === undefined) {
        questionAttempts.push({
          question: question._id,
          selectedOption: -1, // Indicate no answer was selected
          isCorrect: false,
          timeSpent: answer.timeSpent || 60 // Default to max time if not provided
        });
        continue;
      }

      if (answer.selectedOptionIndex >= question.options.length) {
        return res.status(400).json({
          message: `Invalid option index for question ${answer.questionId}`
        });
      }

      // Check if the question was answered within the time limit (60 seconds)
      const timeSpent = answer.timeSpent || 0;
      const isWithinTimeLimit = timeSpent <= 60; // 60 seconds time limit
      
      // Only award points if the answer is correct AND within time limit
      const isCorrect = question.options[answer.selectedOptionIndex]?.isCorrect || false;
      const points = (isCorrect && isWithinTimeLimit) ? pointsPerQuestion : 0;
      totalScore += points;

      questionAttempts.push({
        question: question._id,
        selectedOption: answer.selectedOptionIndex,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      });
    }

    // Calculate total time spent
    const totalTimeSpent = questionAttempts.reduce((total, attempt) => total + (attempt.timeSpent || 0), 0);

    // Create quiz attempt record
    const quizAttempt = new QuizAttempt({
      student: req.user._id,
      techStack: techStackId,
      level,
      questions: questionAttempts,
      totalScore,
      totalQuestions: questions.length,
      percentageScore: (totalScore / (questions.length * pointsPerQuestion)) * 100,
      totalTimeSpent,
      completedAt: new Date()
    });

    await quizAttempt.save();

    res.json({
      message: 'Quiz submitted successfully',
      totalScore,
      percentageScore: quizAttempt.percentageScore,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      message: 'Error submitting quiz',
      error: error.message || 'Unknown error occurred'
    });
  }
});

module.exports = router;