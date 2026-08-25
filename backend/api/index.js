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

// Database Connection with proper connection-state checking for Serverless (Vercel)
let connPromise = null;

async function connectToDatabase() {
  // If already connected (readyState 1 = connected), return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress (readyState 2 = connecting), wait for pending promise
  if (mongoose.connection.readyState === 2 && connPromise) {
    await connPromise;
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://vishalvicky181_db_user:ME8NgxsZXsOHrivy@cluster0.twbyebh.mongodb.net/test?appName=Cluster0';

  const opts = {
    bufferCommands: false, // Disable buffering so DB connection issues fail fast instead of timing out after 10s
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  };

  connPromise = mongoose.connect(mongoUri, opts).catch((err) => {
    connPromise = null;
    throw err;
  });

  await connPromise;
  console.log('MongoDB Connected Successfully');
  return mongoose.connection;
}

// Middleware to ensure DB is connected before executing any route handler
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database connection error. Please verify MONGODB_URI and MongoDB Atlas IP Access settings (allow 0.0.0.0/0).',
      error: err.message
    });
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
