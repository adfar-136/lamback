const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const documentationRoutes = require('./routes/documentation');
const techStackRoutes = require('./routes/techstack');
const companyRequirementRoutes = require('./routes/company-requirements');
const contactRoutes = require('./routes/contact');
const codingRoutes = require('./routes/coding');

const app = express();
// Middleware
dotenv.config();
app.use(cors({
  origin: ['http://localhost:5174','http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//  MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://variableverse:test@cluster0.g6wyh.mongodb.net/lamicons';
console.log("adfar",MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documentation', documentationRoutes);
app.use('/api/techstack', techStackRoutes);
app.use('/api/company-requirements', companyRequirementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/coding', codingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lamicons API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app };