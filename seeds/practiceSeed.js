const mongoose = require('mongoose');
const TechStack = require('../models/TechStack');
const Question = require('../models/Question');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const techStacks = [
  {
    name: 'JavaScript',
    description: 'Core JavaScript concepts and modern ES6+ features',
    icon: 'javascript.png'
  },
  {
    name: 'React',
    description: 'React.js fundamentals, hooks, and state management',
    icon: 'react.png'
  },
  {
    name: 'Node.js',
    description: 'Server-side JavaScript and Express.js framework',
    icon: 'nodejs.png'
  },
  {
    name: 'MongoDB',
    description: 'NoSQL database concepts and Mongoose ODM',
    icon: 'mongodb.png'
  }
];

const questions = [
  // JavaScript questions
  {
    question: 'What is the output of: typeof typeof 1?',
    options: [
      { text: 'number', isCorrect: false },
      { text: 'string', isCorrect: true },
      { text: 'undefined', isCorrect: false },
      { text: 'NaN', isCorrect: false }
    ],
    explanation: 'typeof 1 returns "number" (as a string), and typeof "number" returns "string"',
    difficulty: 'intermediate',
    score: 2,
    timeLimit: 45,
    techStack: null // Will be set dynamically
  },
  {
    question: 'Which method removes the last element from an array?',
    options: [
      { text: 'pop()', isCorrect: true },
      { text: 'push()', isCorrect: false },
      { text: 'shift()', isCorrect: false },
      { text: 'unshift()', isCorrect: false }
    ],
    explanation: 'The pop() method removes the last element from an array and returns that element',
    difficulty: 'beginner',
    score: 1,
    timeLimit: 30,
    techStack: null
  },
  // React questions
  {
    question: 'What hook is used for side effects in React?',
    options: [
      { text: 'useState', isCorrect: false },
      { text: 'useEffect', isCorrect: true },
      { text: 'useContext', isCorrect: false },
      { text: 'useReducer', isCorrect: false }
    ],
    explanation: 'useEffect is used for handling side effects like data fetching, subscriptions, or DOM mutations',
    difficulty: 'beginner',
    score: 1,
    timeLimit: 30,
    techStack: null
  },
  // Node.js questions
  {
    question: 'What is middleware in Express.js?',
    options: [
      { text: 'Database connection', isCorrect: false },
      { text: 'Request/Response handler', isCorrect: true },
      { text: 'Static file server', isCorrect: false },
      { text: 'Template engine', isCorrect: false }
    ],
    explanation: 'Middleware functions are functions that have access to the request and response objects and can process them',
    difficulty: 'intermediate',
    score: 2,
    timeLimit: 45,
    techStack: null
  },
  // MongoDB questions
  {
    question: 'Which operator is used for case-insensitive search?',
    options: [
      { text: '$regex', isCorrect: true },
      { text: '$search', isCorrect: false },
      { text: '$find', isCorrect: false },
      { text: '$match', isCorrect: false }
    ],
    explanation: '$regex with the "i" flag allows for case-insensitive pattern matching in MongoDB queries',
    difficulty: 'advanced',
    score: 3,
    timeLimit: 60,
    techStack: null
  }
];

const seedDatabase = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await TechStack.deleteMany({});
    await Question.deleteMany({});

    // Insert tech stacks
    const createdStacks = await TechStack.insertMany(techStacks);
    console.log('Tech stacks created');

    // Create a map of tech stack names to their IDs
    const stackMap = {};
    createdStacks.forEach(stack => {
      stackMap[stack.name] = stack._id;
    });

    // Assign tech stacks to questions with better matching
    const questionsWithRefs = questions.map(q => {
      let techStackId;
      
      // More robust tech stack matching
      if (q.question.toLowerCase().includes('javascript') || 
          q.question.toLowerCase().includes('array') || 
          q.question.includes('typeof')) {
        techStackId = stackMap['JavaScript'];
      } else if (q.question.toLowerCase().includes('react') || 
                 q.question.toLowerCase().includes('hook') || 
                 q.question.toLowerCase().includes('jsx')) {
        techStackId = stackMap['React'];
      } else if (q.question.toLowerCase().includes('express') || 
                 q.question.toLowerCase().includes('node') || 
                 q.question.toLowerCase().includes('middleware')) {
        techStackId = stackMap['Node.js'];
      } else if (q.question.toLowerCase().includes('mongodb') || 
                 q.question.toLowerCase().includes('$') || 
                 q.question.toLowerCase().includes('database')) {
        techStackId = stackMap['MongoDB'];
      }

      // Validation to ensure every question has a techStack
      if (!techStackId) {
        throw new Error(`Could not determine tech stack for question: ${q.question}`);
      }

      return { ...q, techStack: techStackId };
    });

    // Validate that all questions have a techStack before insertion
    if (questionsWithRefs.some(q => !q.techStack)) {
      throw new Error('Some questions do not have a tech stack assigned');
    }

    await Question.insertMany(questionsWithRefs);
    console.log('Questions created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 