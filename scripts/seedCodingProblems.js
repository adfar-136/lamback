const mongoose = require('mongoose');
const CodingQuestion = require('../models/CodingQuestion');

// MongoDB connection URI
const MONGODB_URI = 'mongodb+srv://variableverse:test@cluster0.g6wyh.mongodb.net/lamicons';

// Sample coding problems data
const codingProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: 'JavaScript',
    tags: ['Array', 'Hash Table'],
    testCases: [
      {
        input: '[2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        isHidden: false
      },
      {
        input: '[3,2,4], target = 6',
        expectedOutput: '[1,2]',
        isHidden: false
      },
      {
        input: '[3,3], target = 6',
        expectedOutput: '[0,1]',
        isHidden: true
      }
    ],
    sampleCode: new Map([
      ['JavaScript', 'function twoSum(nums, target) {\n    // Your code here\n}'],
      ['Python', 'def two_sum(nums, target):\n    # Your code here\n    pass']
    ]),
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: '65f1f8c3e494a2f8c8f9d123', // Replace with actual admin user ID
    isActive: true
  },
  {
    title: 'String Reversal',
    description: 'Write a function that reverses a string. The input is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
    difficulty: 'Easy',
    category: 'JavaScript',
    tags: ['String', 'Two Pointers'],
    testCases: [
      {
        input: '[\'h\',\'e\',\'l\',\'l\',\'o\']',
        expectedOutput: '[\'o\',\'l\',\'l\',\'e\',\'h\']',
        isHidden: false
      },
      {
        input: '[\'H\',\'a\',\'n\',\'n\',\'a\',\'h\']',
        expectedOutput: '[\'h\',\'a\',\'n\',\'n\',\'a\',\'H\']',
        isHidden: false
      }
    ],
    sampleCode: new Map([
      ['JavaScript', 'function reverseString(s) {\n    // Your code here\n}'],
      ['Python', 'def reverse_string(s):\n    # Your code here\n    pass']
    ]),
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: '65f1f8c3e494a2f8c8f9d123', // Replace with actual admin user ID
    isActive: true
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: 1. Open brackets must be closed by the same type of brackets. 2. Open brackets must be closed in the correct order.',
    difficulty: 'Medium',
    category: 'JavaScript',
    tags: ['Stack', 'String'],
    testCases: [
      {
        input: '()',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        input: '()[]{}',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        input: '(]',
        expectedOutput: 'false',
        isHidden: false
      },
      {
        input: '([)]',
        expectedOutput: 'false',
        isHidden: true
      }
    ],
    sampleCode: new Map([
      ['JavaScript', 'function isValid(s) {\n    // Your code here\n}'],
      ['Python', 'def is_valid(s):\n    # Your code here\n    pass']
    ]),
    timeLimit: 1500,
    memoryLimit: 128,
    createdBy: '65f1f8c3e494a2f8c8f9d123', // Replace with actual admin user ID
    isActive: true
  }
];

// Function to seed the database
async function seedCodingProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing coding problems
    await CodingQuestion.deleteMany({});
    console.log('Cleared existing coding problems');

    // Insert new coding problems
    const result = await CodingQuestion.insertMany(codingProblems);
    console.log(`Successfully seeded ${result.length} coding problems`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding coding problems:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedCodingProblems();