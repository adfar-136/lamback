const mongoose = require('mongoose');
const Technology = require('../models/Documentation');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lamicons';

// Additional technology data
const additionalTechnologies = [
  {
    name: 'Python',
    slug: 'python',
    description: 'Master Python programming language for versatile application development, data science, and automation.',
    icon: 'python-icon.svg',
    order: 4,
    topics: [
      {
        title: 'Python Fundamentals',
        slug: 'fundamentals',
        content: [
          {
            type: 'heading',
            content: 'Getting Started with Python',
            metadata: { level: 1 }
          },
          {
            type: 'text',
            content: 'Python is a high-level, interpreted programming language known for its simplicity and readability. This guide will help you get started with Python programming.'
          },
          {
            type: 'heading',
            content: 'Your First Python Program',
            metadata: { level: 2 }
          },
          {
            type: 'code',
            content: 'print("Hello, World!")',
            metadata: { language: 'python' }
          },
          {
            type: 'text',
            content: 'This simple program demonstrates the basic syntax of Python. The print() function is used to output text to the console.'
          }
        ],
        order: 1
      },
      {
        title: 'Object-Oriented Programming',
        slug: 'oop',
        content: [
          {
            type: 'heading',
            content: 'Object-Oriented Programming in Python',
            metadata: { level: 1 }
          },
          {
            type: 'text',
            content: 'Learn how to create and use classes, objects, and implement inheritance in Python.'
          },
          {
            type: 'code',
            content: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"',
            metadata: { language: 'python' }
          },
          {
            type: 'text',
            content: 'This example demonstrates class inheritance and method overriding in Python.'
          }
        ],
        order: 2
      }
    ]
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'Learn modern JavaScript for web development and beyond.',
    icon: 'javascript-icon.svg',
    order: 5,
    topics: [
      {
        title: 'ES6+ Features',
        slug: 'es6-features',
        content: [
          {
            type: 'heading',
            content: 'Modern JavaScript Features',
            metadata: { level: 1 }
          },
          {
            type: 'text',
            content: 'Explore the powerful features introduced in ES6 and beyond that make JavaScript more expressive and maintainable.'
          },
          {
            type: 'code',
            content: '// Arrow Functions\nconst greet = name => `Hello, ${name}!`;\n\n// Destructuring\nconst { x, y } = point;\n\n// Spread Operator\nconst newArray = [...oldArray, newItem];',
            metadata: { language: 'javascript' }
          },
          {
            type: 'text',
            content: 'These modern features help write more concise and readable code.'
          }
        ],
        order: 1
      }
    ]
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert the additional technologies
    for (const tech of additionalTechnologies) {
      await Technology.findOneAndUpdate(
        { slug: tech.slug },
        tech,
        { upsert: true, new: true }
      );
      console.log(`Added/Updated ${tech.name}`);
    }

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase();