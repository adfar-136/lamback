const mongoose = require('mongoose');
const TechStack = require('./models/TechStack');
const Question = require('./models/Question');
require('dotenv').config();

const techStacks = [
  {
    name: 'JavaScript',
    description: 'Modern JavaScript concepts, ES6+ features, and core fundamentals',
    icon: 'javascript-icon.png'
  },
  {
    name: 'React',
    description: 'React.js library concepts, hooks, state management, and best practices',
    icon: 'react-icon.png'
  },
  {
    name: 'Node.js',
    description: 'Server-side JavaScript, Express.js, and backend development concepts',
    icon: 'nodejs-icon.png'
  },
  {
    name: 'MongoDB',
    description: 'NoSQL database concepts, CRUD operations, and Mongoose ODM',
    icon: 'mongodb-icon.png'
  }
];

const createQuestions = (techStackId) => {
  const questions = {
    JavaScript: [
      {
        question: 'What is the output of: console.log(typeof typeof 1)?',
        options: [
          { text: 'number', isCorrect: false },
          { text: 'string', isCorrect: true },
          { text: 'undefined', isCorrect: false },
          { text: 'NaN', isCorrect: false }
        ],
        explanation: 'typeof 1 returns "number" (string), and typeof "number" returns "string"',
        difficulty: 'intermediate',
        score: 2,
        timeLimit: 45
      },
      {
        question: 'Which method removes the last element from an array and returns that element?',
        options: [
          { text: 'pop()', isCorrect: true },
          { text: 'push()', isCorrect: false },
          { text: 'shift()', isCorrect: false },
          { text: 'unshift()', isCorrect: false }
        ],
        explanation: 'pop() removes and returns the last element of an array',
        difficulty: 'beginner',
        score: 1,
        timeLimit: 30
      }
    ],
    React: [
      {
        question: 'Which hook is used for side effects in React?',
        options: [
          { text: 'useState', isCorrect: false },
          { text: 'useEffect', isCorrect: true },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false }
        ],
        explanation: 'useEffect is used for handling side effects like data fetching, subscriptions, or DOM mutations',
        difficulty: 'beginner',
        score: 1,
        timeLimit: 30
      }
    ],
    'Node.js': [
      {
        question: 'What is the purpose of the "middleware" in Express.js?',
        options: [
          { text: 'To handle database connections', isCorrect: false },
          { text: 'To process requests before they reach the route handler', isCorrect: true },
          { text: 'To serve static files', isCorrect: false },
          { text: 'To handle server errors', isCorrect: false }
        ],
        explanation: 'Middleware functions have access to the request and response objects, and can process or modify them before they reach the route handler',
        difficulty: 'intermediate',
        score: 2,
        timeLimit: 45
      }
    ],
    MongoDB: [
      {
        question: 'Which operator is used to perform case-insensitive search in MongoDB?',
        options: [
          { text: '$regex', isCorrect: true },
          { text: '$search', isCorrect: false },
          { text: '$find', isCorrect: false },
          { text: '$match', isCorrect: false }
        ],
        explanation: '$regex operator with the "i" flag allows case-insensitive pattern matching in MongoDB queries',
        difficulty: 'advanced',
        score: 3,
        timeLimit: 60
      }
    ]
  };

  return questions[techStackId];
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await TechStack.deleteMany({});
    await Question.deleteMany({});

    // Create tech stacks
    const createdTechStacks = await TechStack.insertMany(techStacks);
    console.log('Tech stacks created');

    // Create questions for each tech stack
    for (const techStack of createdTechStacks) {
      const questions = createQuestions(techStack.name).map(question => ({
        ...question,
        techStack: techStack._id
      }));
      await Question.insertMany(questions);
    }

    console.log('Questions created');
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 