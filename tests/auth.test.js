// backend/tests/auth.test.js

const request = require('supertest');
const {app} = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
    // Clear test database before tests
    beforeEach(async () => {
        // Clean up the users collection before each test
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(201);
    });

    it('should login a user', async () => {
        // First register the user
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });

        // Then try to login
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        
    });

    it('should handle invalid login credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
       
    });
});