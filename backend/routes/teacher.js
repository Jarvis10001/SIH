const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  loginTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  getDashboardStats,
  getSchedule,
  getActivities,
  changePassword
} = require('../controllers/teacherController');

const router = express.Router();

// @route   POST /api/teacher/login
// @desc    Teacher login
// @access  Public
router.post('/login', loginTeacher);

// @route   GET /api/teacher/profile
// @desc    Get teacher profile
// @access  Private
router.get('/profile', authenticate, getTeacherProfile);

// @route   PUT /api/teacher/profile
// @desc    Update teacher profile
// @access  Private
router.put('/profile', authenticate, updateTeacherProfile);

// @route   GET /api/teacher/dashboard-stats
// @desc    Get teacher dashboard statistics
// @access  Private
router.get('/dashboard-stats', authenticate, getDashboardStats);

// @route   GET /api/teacher/schedule
// @desc    Get teacher's today schedule
// @access  Private
router.get('/schedule', authenticate, getSchedule);

// @route   GET /api/teacher/activities
// @desc    Get teacher's recent activities
// @access  Private
router.get('/activities', authenticate, getActivities);

// @route   POST /api/teacher/change-password
// @desc    Change teacher password
// @access  Private
router.post('/change-password', authenticate, changePassword);

module.exports = router;