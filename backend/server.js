// server.js or app.js - Fixed Express Server Configuration
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create express app
const app = express();

// CORS Configuration - Enhanced to ensure frontend can communicate properly
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'https://salesrep-891v.onrender.com',
    'https://salesrep-backend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Response debugging middleware
app.use((req, res, next) => {
  // Store original res.json function
  const originalJson = res.json;
  
  // Override res.json
  res.json = function(body) {
    // Log response for debugging
    console.log(`[${new Date().toISOString()}] Response for ${req.method} ${req.path}:`,
      typeof body === 'object' ? JSON.stringify(body).substring(0, 200) + '...' : body);
    
    // Call original function
    return originalJson.call(this, body);
  };
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body).substring(0, 200) + '...');
  }
  next();
});

// File upload static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

// If in production and frontend files are included, serve static frontend
if (process.env.NODE_ENV === 'production' && process.env.SERVE_FRONTEND === 'true') {
  // Serve static files
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

// Catch-all route for undefined API routes
app.use('/api/*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Get status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Always return a JSON response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    // Only include stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Server setup
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection at:', promise, 'error:', err);
  
  // Log complete error details
  if (err instanceof Error) {
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
  }
  
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  
  // Log complete error details
  if (err instanceof Error) {
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
  }
  
  // Exit process
  process.exit(1);
});

module.exports = app;