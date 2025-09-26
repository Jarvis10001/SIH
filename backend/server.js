const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database configuration
const { connectDB } = require('./config/database');

// Import models
const Admin = require('./models/Admin');

// Import middleware
const { logger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const usersRoutes = require('./routes/users');
const usersMongoRoutes = require('./routes/usersMongo');
const studentsRoutes = require('./routes/students');
const authRoutes = require('./routes/auth');
const admissionRoutes = require('./routes/admission');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const attendanceRoutes = require('./routes/attendance');
const clerkRoutes = require('./routes/clerk');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom middleware
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to SIH Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      documentation: 'Available endpoints: GET, POST, PUT, DELETE /api/users'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
// Authentication routes
app.use('/api/auth', authRoutes);

// Admission routes
app.use('/api/admission', admissionRoutes);

// Payment routes
app.use('/api/payment', paymentRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Teacher routes
app.use('/api/teacher', teacherRoutes);

// Attendance routes
app.use('/api/attendance', attendanceRoutes);

// Clerk routes
app.use('/api/clerk', clerkRoutes);

// Legacy in-memory users (for backward compatibility)
app.use('/api/users/legacy', usersRoutes);

// MongoDB users (main routes)
app.use('/api/users', usersMongoRoutes);

// Student routes
app.use('/api/students', studentsRoutes);

// Sample data route (for testing)
app.get('/api/data', (req, res) => {
  res.json({ 
    success: true,
    message: 'Sample data retrieved successfully',
    data: [
      { id: 1, name: 'Sample Data 1', type: 'example' },
      { id: 2, name: 'Sample Data 2', type: 'demo' }
    ]
  });
});

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create default admin if not exists
    await Admin.createDefaultAdmin();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
      console.log(`👑 Admin Portal: http://localhost:5173/admin/login`);
      console.log(`📧 Admin Username: admin`);
      console.log(`🔑 Admin Password: Admin@123`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();