const mongoose = require('mongoose');
const CodingQuestion = require('../models/CodingQuestion');

require('dotenv').config();

const MONGODB_URI = 'mongodb+srv://variableverse:test@cluster0.g6wyh.mongodb.net/lamicons';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const simpleConsoleQuestion = {
  title: 'Console Output Test',
  description: 'Write a program that outputs the string "adfar" to the console.',
  difficulty: 'Easy',
  category: 'JavaScript',
  tags: ['console', 'output', 'strings'],
  testCases: [
    {
      input: 'No input required',
      expectedOutput: 'adfar',
      isHidden: false
    },
    {
      input: 'No input required',
      expectedOutput: 'adfar',
      isHidden: true
    }
  ],
  sampleCode: new Map([
    ['javascript', '// Write your code here\n'],
    ['python', '# Write your code here\n'],
    ['java', '// Write your code here\n'],
  ]),
  timeLimit: 2000,
  memoryLimit: 256,
  createdBy: '65f1f8c3e494a2f8c8f9d123', // Admin user ID
  inputFormat: 'No input required.',
  outputFormat: 'Output the string "adfar" to the console.',
  constraints: 'Output must match exactly with the expected string.',
  expectedOutput: 'The program should output exactly "adfar" (without quotes) to the console.',
  isActive: true
};

async function seedSimpleConsoleQuestion() {
  try {
    // Clear existing questions with the same title
    await CodingQuestion.deleteMany({ title: simpleConsoleQuestion.title });
    
    // Create new question
    const question = await CodingQuestion.create(simpleConsoleQuestion);
    console.log('Successfully seeded simple console test question:', question._id);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding simple console test question:', error);
    mongoose.connection.close();
  }
}

seedSimpleConsoleQuestion();