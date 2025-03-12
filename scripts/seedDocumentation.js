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
        content: 'Learn the core concepts of Python including variables, data types, control structures, and functions.',
        order: 1
      },
      {
        title: 'Object-Oriented Programming',
        slug: 'oop',
        content: 'Understand object-oriented programming principles in Python including classes, inheritance, and polymorphism.',
        order: 2
      },
      {
        title: 'Data Structures and Algorithms',
        slug: 'dsa',
        content: 'Explore Python data structures like lists, dictionaries, sets, and implement common algorithms.',
        order: 3
      },
      {
        title: 'Web Development with Django',
        slug: 'django',
        content: 'Build web applications using Django framework, including models, views, templates, and forms.',
        order: 4
      }
    ]
  },
  {
    name: 'Java',
    slug: 'java',
    description: 'Learn Java programming for enterprise applications, Android development, and large-scale systems.',
    icon: 'java-icon.svg',
    order: 5,
    topics: [
      {
        title: 'Java Basics',
        slug: 'java-basics',
        content: 'Get started with Java syntax, data types, control flow, and basic object-oriented concepts.',
        order: 1
      },
      {
        title: 'Advanced Java Concepts',
        slug: 'advanced',
        content: 'Deep dive into advanced Java features including generics, collections, multithreading, and exception handling.',
        order: 2
      },
      {
        title: 'Spring Framework',
        slug: 'spring',
        content: 'Learn Spring framework for building enterprise Java applications, including Spring Boot and Spring MVC.',
        order: 3
      }
    ]
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'Master DevOps practices and tools for continuous integration, delivery, and deployment.',
    icon: 'devops-icon.svg',
    order: 6,
    topics: [
      {
        title: 'CI/CD Pipelines',
        slug: 'cicd',
        content: 'Understand continuous integration and continuous delivery concepts, tools, and best practices.',
        order: 1
      },
      {
        title: 'Container Orchestration',
        slug: 'containers',
        content: 'Learn Docker and Kubernetes for containerization and orchestration of applications.',
        order: 2
      },
      {
        title: 'Infrastructure as Code',
        slug: 'iac',
        content: 'Explore infrastructure as code using tools like Terraform and Ansible.',
        order: 3
      }
    ]
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud',
    description: 'Explore cloud computing platforms and services for modern application deployment.',
    icon: 'cloud-icon.svg',
    order: 7,
    topics: [
      {
        title: 'AWS Fundamentals',
        slug: 'aws',
        content: 'Learn core AWS services including EC2, S3, RDS, and Lambda.',
        order: 1
      },
      {
        title: 'Cloud Architecture',
        slug: 'architecture',
        content: 'Design scalable and resilient cloud architectures using best practices.',
        order: 2
      },
      {
        title: 'Serverless Computing',
        slug: 'serverless',
        content: 'Build serverless applications using AWS Lambda and API Gateway.',
        order: 3
      }
    ]
  },
  {
    name: 'Mobile Development',
    slug: 'mobile',
    description: 'Build mobile applications for iOS and Android platforms.',
    icon: 'mobile-icon.svg',
    order: 8,
    topics: [
      {
        title: 'React Native Basics',
        slug: 'react-native',
        content: 'Get started with React Native for cross-platform mobile development.',
        order: 1
      },
      {
        title: 'Native App Development',
        slug: 'native',
        content: 'Learn platform-specific development for iOS (Swift) and Android (Kotlin).',
        order: 2
      },
      {
        title: 'Mobile UI/UX',
        slug: 'mobile-ui',
        content: 'Design and implement user interfaces following mobile design principles.',
        order: 3
      }
    ]
  },
  {
    name: 'Database Systems',
    slug: 'database',
    description: 'Master database design, implementation, and management.',
    icon: 'database-icon.svg',
    order: 9,
    topics: [
      {
        title: 'SQL Fundamentals',
        slug: 'sql',
        content: 'Learn SQL basics, queries, joins, and database design principles.',
        order: 1
      },
      {
        title: 'NoSQL Databases',
        slug: 'nosql',
        content: 'Explore NoSQL databases like MongoDB, Redis, and their use cases.',
        order: 2
      },
      {
        title: 'Database Performance',
        slug: 'performance',
        content: 'Optimize database performance through indexing, query optimization, and caching.',
        order: 3
      }
    ]
  },
  {
    name: 'Cybersecurity',
    slug: 'security',
    description: 'Learn cybersecurity principles, tools, and best practices.',
    icon: 'security-icon.svg',
    order: 10,
    topics: [
      {
        title: 'Security Fundamentals',
        slug: 'security-basics',
        content: 'Understand basic security concepts, threats, and countermeasures.',
        order: 1
      },
      {
        title: 'Web Security',
        slug: 'web-security',
        content: 'Learn about common web vulnerabilities and how to protect against them.',
        order: 2
      },
      {
        title: 'Network Security',
        slug: 'network',
        content: 'Explore network security protocols, firewalls, and intrusion detection systems.',
        order: 3
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