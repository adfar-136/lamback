const mongoose = require('mongoose');
const Question = require('../models/Question');
const TechStack = require('../models/TechStack');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://variableverse:test@cluster0.g6wyh.mongodb.net/lamicons';

// Test data for tech stacks
const techStacks = [
  {
    name: 'JavaScript',
    description: 'Modern JavaScript programming language fundamentals and advanced concepts',
    icon: 'javascript-icon.svg',
    levels: [
      {
        name: 'Beginner',
        description: 'Basic JavaScript concepts and syntax',
        requiredScore: 70
      },
      {
        name: 'Intermediate',
        description: 'Advanced JavaScript concepts and DOM manipulation',
        requiredScore: 75
      },
      {
        name: 'Advanced',
        description: 'Complex JavaScript patterns and optimization',
        requiredScore: 80
      }
    ]
  },
  {
    name: 'React',
    description: 'Modern React development including hooks, context, and state management',
    icon: 'react-icon.svg',
    levels: [
      {
        name: 'Beginner',
        description: 'React basics and component fundamentals',
        requiredScore: 70
      },
      {
        name: 'Intermediate',
        description: 'Advanced React patterns and hooks',
        requiredScore: 75
      },
      {
        name: 'Advanced',
        description: 'Complex React applications and performance optimization',
        requiredScore: 80
      }
    ]
  },
  {
    name: 'Node.js',
    description: 'Server-side JavaScript development with Node.js',
    icon: 'nodejs-icon.svg',
    levels: [
      {
        name: 'Beginner',
        description: 'Node.js basics and Express fundamentals',
        requiredScore: 70
      },
      {
        name: 'Intermediate',
        description: 'Advanced Express and database integration',
        requiredScore: 75
      },
      {
        name: 'Advanced',
        description: 'Scalable Node.js applications and microservices',
        requiredScore: 80
      }
    ]
  }
];

// Sample questions for each tech stack
const createQuestions = async (techStackId, adminUserId) => {
  const questions = [
    // React Beginner Questions
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the virtual DOM in React?',
      options: [
        { text: 'A direct copy of the real DOM', isCorrect: false },
        { text: 'A lightweight copy of the real DOM', isCorrect: true },
        { text: 'A database for storing DOM elements', isCorrect: false },
        { text: 'A browser extension', isCorrect: false }
      ],
      explanation: 'The virtual DOM is a lightweight JavaScript representation of the actual DOM, which React uses to optimize rendering performance.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is JSX in React?',
      options: [
        { text: 'A database query language', isCorrect: false },
        { text: 'A styling framework', isCorrect: false },
        { text: 'A syntax extension for JavaScript', isCorrect: true },
        { text: 'A testing framework', isCorrect: false }
      ],
      explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript, making it easier to describe UI components.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    // React Intermediate Questions
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of useEffect hook in React?',
      options: [
        { text: 'To handle side effects in functional components', isCorrect: true },
        { text: 'To create new components', isCorrect: false },
        { text: 'To style components', isCorrect: false },
        { text: 'To define routes', isCorrect: false }
      ],
      explanation: 'useEffect is a React Hook that lets you synchronize a component with an external system and handle side effects in functional components.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    // React Advanced Questions
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is React Fiber?',
      options: [
        { text: 'A new database system', isCorrect: false },
        { text: 'A complete rewrite of React\'s core algorithm', isCorrect: true },
        { text: 'A testing framework', isCorrect: false },
        { text: 'A state management library', isCorrect: false }
      ],
      explanation: 'React Fiber is a complete reimplementation of React\'s core algorithm that enables features like incremental rendering and better error handling.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    // Node.js Beginner Questions
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is npm in Node.js?',
      options: [
        { text: 'Node Package Manager', isCorrect: true },
        { text: 'New Programming Method', isCorrect: false },
        { text: 'Node Programming Module', isCorrect: false },
        { text: 'New Project Manager', isCorrect: false }
      ],
      explanation: 'npm (Node Package Manager) is the default package manager for Node.js, used to install and manage project dependencies.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the purpose of package.json in Node.js?',
      options: [
        { text: 'To store application data', isCorrect: false },
        { text: 'To define project metadata and dependencies', isCorrect: true },
        { text: 'To write server logic', isCorrect: false },
        { text: 'To configure the database', isCorrect: false }
      ],
      explanation: 'package.json is a configuration file that contains project metadata and lists all dependencies required by the project.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    // Node.js Intermediate Questions
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is middleware in Express.js?',
      options: [
        { text: 'Functions that have access to request and response objects', isCorrect: true },
        { text: 'A database system', isCorrect: false },
        { text: 'A testing framework', isCorrect: false },
        { text: 'A deployment tool', isCorrect: false }
      ],
      explanation: 'Middleware functions are functions that have access to the request object, response object, and the next middleware function in the application\'s request-response cycle.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    // Node.js Advanced Questions
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the Event Loop in Node.js?',
      options: [
        { text: 'A database query system', isCorrect: false },
        { text: 'A mechanism to handle asynchronous operations', isCorrect: true },
        { text: 'A routing system', isCorrect: false },
        { text: 'A testing framework', isCorrect: false }
      ],
      explanation: 'The Event Loop is a mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    // Additional JavaScript Questions
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the difference between let and const in JavaScript?',
      options: [
        { text: 'There is no difference', isCorrect: false },
        { text: 'let can be reassigned, const cannot', isCorrect: true },
        { text: 'const is not supported in modern browsers', isCorrect: false },
        { text: 'let is only for numbers', isCorrect: false }
      ],
      explanation: 'let allows variable reassignment while const creates a read-only reference to a value. The value of const cannot be reassigned.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is a Promise in JavaScript?',
      options: [
        { text: 'A guarantee of future payment', isCorrect: false },
        { text: 'An object representing eventual completion of an async operation', isCorrect: true },
        { text: 'A type of loop', isCorrect: false },
        { text: 'A way to declare variables', isCorrect: false }
      ],
      explanation: 'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is a Generator function in JavaScript?',
      options: [
        { text: 'A function that generates random numbers', isCorrect: false },
        { text: 'A function that can be paused and resumed', isCorrect: true },
        { text: 'A function that creates objects', isCorrect: false },
        { text: 'A function that only runs once', isCorrect: false }
      ],
      explanation: 'A Generator function is a special type of function that can be paused and resumed, allowing you to generate a sequence of values over time.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    // Additional React Questions
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the Context API in React?',
      options: [
        { text: 'A way to style components', isCorrect: false },
        { text: 'A way to share state across components', isCorrect: true },
        { text: 'A routing solution', isCorrect: false },
        { text: 'A testing utility', isCorrect: false }
      ],
      explanation: 'The Context API is a React feature that allows you to share values between components without explicitly passing props through every level.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    // Additional Node.js Questions
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the module.exports in Node.js?',
      options: [
        { text: 'To import modules', isCorrect: false },
        { text: 'To export functionality from a module', isCorrect: true },
        { text: 'To create new modules', isCorrect: false },
        { text: 'To delete modules', isCorrect: false }
      ],
      explanation: 'module.exports is used to export functions, objects, or primitives from a module so they can be used in other files.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is clustering in Node.js?',
      options: [
        { text: 'A database organization method', isCorrect: false },
        { text: 'A way to run multiple instances of Node.js', isCorrect: true },
        { text: 'A type of data structure', isCorrect: false },
        { text: 'A testing strategy', isCorrect: false }
      ],
      explanation: 'Clustering in Node.js allows you to create child processes that run simultaneously and share the same server port, enabling better use of multi-core systems.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    // JavaScript Beginner Questions
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the output of: console.log(typeof [])?',
      options: [
        { text: 'array', isCorrect: false },
        { text: 'object', isCorrect: true },
        { text: 'undefined', isCorrect: false },
        { text: 'null', isCorrect: false }
      ],
      explanation: 'In JavaScript, arrays are actually objects, so typeof [] returns "object".',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the purpose of the async/await keywords in JavaScript?',
      options: [
        { text: 'To make code run faster', isCorrect: false },
        { text: 'To handle asynchronous operations in a synchronous way', isCorrect: true },
        { text: 'To create new functions', isCorrect: false },
        { text: 'To define variables', isCorrect: false }
      ],
      explanation: 'async/await is a syntax that makes asynchronous code look and behave more like synchronous code, making it easier to understand and maintain.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the purpose of the map() method in JavaScript?',
      options: [
        { text: 'To create a new object', isCorrect: false },
        { text: 'To create a new array with transformed elements', isCorrect: true },
        { text: 'To modify the original array', isCorrect: false },
        { text: 'To sort array elements', isCorrect: false }
      ],
      explanation: 'The map() method creates a new array with the results of calling a function for every array element, leaving the original array unchanged.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the reduce() method in JavaScript?',
      options: [
        { text: 'To remove elements from an array', isCorrect: false },
        { text: 'To transform an array into a single value', isCorrect: true },
        { text: 'To filter array elements', isCorrect: false },
        { text: 'To sort array elements', isCorrect: false }
      ],
      explanation: 'The reduce() method executes a reducer function on each element of the array, resulting in a single output value.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the useCallback hook in React?',
      options: [
        { text: 'To create new components', isCorrect: false },
        { text: 'To memoize functions', isCorrect: true },
        { text: 'To handle form submissions', isCorrect: false },
        { text: 'To manage routing', isCorrect: false }
      ],
      explanation: 'useCallback is a React Hook that lets you cache a function definition between re-renders, optimizing performance by preventing unnecessary re-renders of child components.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the useMemo hook in React?',
      options: [
        { text: 'To create memoized values', isCorrect: true },
        { text: 'To handle form validation', isCorrect: false },
        { text: 'To manage routing', isCorrect: false },
        { text: 'To create new components', isCorrect: false }
      ],
      explanation: 'useMemo is a React Hook that lets you cache the result of a calculation between re-renders, optimizing performance by avoiding expensive calculations.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of React.memo?',
      options: [
        { text: 'To create new components', isCorrect: false },
        { text: 'To memoize component renders', isCorrect: true },
        { text: 'To handle routing', isCorrect: false },
        { text: 'To manage state', isCorrect: false }
      ],
      explanation: 'React.memo is a higher-order component that can be used to wrap components that render the same results given the same props, preventing unnecessary re-renders.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of the useReducer hook in React?',
      options: [
        { text: 'To manage complex state logic', isCorrect: true },
        { text: 'To handle routing', isCorrect: false },
        { text: 'To create new components', isCorrect: false },
        { text: 'To handle form validation', isCorrect: false }
      ],
      explanation: 'useReducer is a React Hook that manages complex state logic in React applications, similar to how Redux manages state.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of the useRef hook in React?',
      options: [
        { text: 'To create references to DOM elements', isCorrect: true },
        { text: 'To handle routing', isCorrect: false },
        { text: 'To manage state', isCorrect: false },
        { text: 'To create new components', isCorrect: false }
      ],
      explanation: 'useRef is a React Hook that provides a way to create a mutable reference that persists across re-renders, commonly used to access DOM elements directly.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the Express.js router?',
      options: [
        { text: 'To handle database connections', isCorrect: false },
        { text: 'To create modular route handlers', isCorrect: true },
        { text: 'To manage state', isCorrect: false },
        { text: 'To handle authentication', isCorrect: false }
      ],
      explanation: 'Express.js router allows you to modularize your route handlers and create mini-applications that can handle specific routes.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the body-parser middleware in Express.js?',
      options: [
        { text: 'To parse incoming request bodies', isCorrect: true },
        { text: 'To handle authentication', isCorrect: false },
        { text: 'To manage routing', isCorrect: false },
        { text: 'To handle database connections', isCorrect: false }
      ],
      explanation: 'body-parser is a middleware that parses incoming request bodies before your handlers, making it easier to handle POST requests.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of the process.nextTick() in Node.js?',
      options: [
        { text: 'To handle database connections', isCorrect: false },
        { text: 'To defer the execution of a function', isCorrect: true },
        { text: 'To manage routing', isCorrect: false },
        { text: 'To handle authentication', isCorrect: false }
      ],
      explanation: 'process.nextTick() defers the execution of a function until the next iteration of the Event Loop, allowing other operations to complete first.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of the Buffer class in Node.js?',
      options: [
        { text: 'To handle binary data', isCorrect: true },
        { text: 'To manage routing', isCorrect: false },
        { text: 'To handle authentication', isCorrect: false },
        { text: 'To manage database connections', isCorrect: false }
      ],
      explanation: 'The Buffer class in Node.js is used to handle binary data, providing a way to work with streams of raw data in the form of sequences of bytes.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of the stream module in Node.js?',
      options: [
        { text: 'To handle large amounts of data', isCorrect: true },
        { text: 'To manage routing', isCorrect: false },
        { text: 'To handle authentication', isCorrect: false },
        { text: 'To manage database connections', isCorrect: false }
      ],
      explanation: 'The stream module provides an interface for handling streaming data, allowing you to read from or write to a source efficiently.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'Which method is used to add elements to the end of an array?',
      options: [
        { text: 'push()', isCorrect: true },
        { text: 'unshift()', isCorrect: false },
        { text: 'append()', isCorrect: false },
        { text: 'add()', isCorrect: false }
      ],
      explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the result of 3 + "2" in JavaScript?',
      options: [
        { text: '5', isCorrect: false },
        { text: '32', isCorrect: true },
        { text: 'NaN', isCorrect: false },
        { text: 'undefined', isCorrect: false }
      ],
      explanation: 'When adding a number and a string, JavaScript converts the number to a string and performs string concatenation.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the scope of a variable declared with let?',
      options: [
        { text: 'Global scope', isCorrect: false },
        { text: 'Function scope', isCorrect: false },
        { text: 'Block scope', isCorrect: true },
        { text: 'Module scope', isCorrect: false }
      ],
      explanation: 'Variables declared with let have block scope, meaning they are only accessible within the block they are declared in.',
      points: 1,
      timeLimit: 30,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Beginner',
      questionText: 'What is the purpose of the === operator in JavaScript?',
      options: [
        { text: 'Assigns a value to a variable', isCorrect: false },
        { text: 'Compares values only', isCorrect: false },
        { text: 'Compares both value and type', isCorrect: true },
        { text: 'Checks if a variable is defined', isCorrect: false }
      ],
      explanation: 'The === operator performs strict equality comparison, checking both value and type equality.',
      points: 1,
      timeLimit: 45,
      createdBy: adminUserId
    },
    // JavaScript Intermediate Questions
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the "use strict" directive in JavaScript?',
      options: [
        { text: 'To enable strict type checking', isCorrect: false },
        { text: 'To enforce stricter parsing and error handling', isCorrect: true },
        { text: 'To improve code performance', isCorrect: false },
        { text: 'To enable new JavaScript features', isCorrect: false }
      ],
      explanation: '"use strict" enables strict mode which catches common coding mistakes and prevents the use of certain error-prone features.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is event delegation in JavaScript?',
      options: [
        { text: 'A way to handle events on parent elements', isCorrect: true },
        { text: 'A method to prevent event bubbling', isCorrect: false },
        { text: 'A technique to stop event propagation', isCorrect: false },
        { text: 'A way to remove event listeners', isCorrect: false }
      ],
      explanation: 'Event delegation is a technique where you attach an event listener to a parent element to handle events on its children, even those added dynamically.',
      points: 2,
      timeLimit: 45,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Intermediate',
      questionText: 'What is the purpose of the bind() method in JavaScript?',
      options: [
        { text: 'To create a new array', isCorrect: false },
        { text: 'To set the this value for a function', isCorrect: true },
        { text: 'To combine two objects', isCorrect: false },
        { text: 'To create a new function', isCorrect: false }
      ],
      explanation: 'The bind() method creates a new function with a fixed this value, regardless of how the function is called.',
      points: 2,
      timeLimit: 90,
      createdBy: adminUserId
    },
    // JavaScript Advanced Questions
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the output of: Promise.resolve(1).then(() => 2).then(console.log)?',
      options: [
        { text: '1', isCorrect: false },
        { text: '2', isCorrect: true },
        { text: 'undefined', isCorrect: false },
        { text: 'Promise {<resolved>: 2}', isCorrect: false }
      ],
      explanation: 'The first .then transforms the value to 2, which is then passed to console.log in the second .then.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is a closure in JavaScript?',
      options: [
        { text: 'A way to close a browser window', isCorrect: false },
        { text: 'A function with access to its outer scope', isCorrect: true },
        { text: 'A method to end a loop', isCorrect: false },
        { text: 'A way to close database connections', isCorrect: false }
      ],
      explanation: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    },
    {
      techStack: techStackId,
      level: 'Advanced',
      questionText: 'What is the purpose of the Symbol type in JavaScript?',
      options: [
        { text: 'To create unique identifiers', isCorrect: true },
        { text: 'To define mathematical constants', isCorrect: false },
        { text: 'To encrypt data', isCorrect: false },
        { text: 'To compress strings', isCorrect: false }
      ],
      explanation: 'Symbols are unique and immutable primitive values that can be used as keys for object properties to avoid naming conflicts.',
      points: 3,
      timeLimit: 60,
      createdBy: adminUserId
    }
  ];

  await Question.insertMany(questions);
};

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create an admin user ID (you should replace this with a real admin user ID)
    const adminUserId = '507f1f77bcf86cd799439011';

    // Clear existing data
    await TechStack.deleteMany({});
    await Question.deleteMany({});

    // Insert tech stacks and their questions
    for (const stack of techStacks) {
      const techStack = await TechStack.create(stack);
      await createQuestions(techStack._id, adminUserId);
      console.log(`Added ${stack.name} with questions`);
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase();