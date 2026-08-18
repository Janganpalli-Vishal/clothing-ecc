const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const opts = {
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 20000,
    maxPoolSize: 10,
    minPoolSize: 2,
  };

  cachedDb = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test', opts);
  console.log('MongoDB Connected Successfully');
  return cachedDb;
}

// Connect to database on startup and per-request middleware
connectToDatabase().catch((err) => console.error('MongoDB Connection Error:', err));

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/products', require('../routes/products'));
app.use('/api/cart', require('../routes/cart'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/profile', require('../routes/profile'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Export for Vercel
module.exports = app;
