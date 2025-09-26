const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  loginAdmin,
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getDashboardStats,
  getAllClerks,
  getClerkById,
  createClerk,
  updateClerk,
  deleteClerk
} = require('../controllers/adminController');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', loginAdmin);

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard-stats', authenticate, getDashboardStats);

// @route   GET /api/admin/teachers
// @desc    Get all teachers
// @access  Private (Admin only)
router.get('/teachers', authenticate, getAllTeachers);

// @route   GET /api/admin/teachers/:id
// @desc    Get teacher by ID
// @access  Private (Admin only)
router.get('/teachers/:id', authenticate, getTeacherById);

// @route   POST /api/admin/teachers
// @desc    Create new teacher
// @access  Private (Admin only)
router.post('/teachers', authenticate, createTeacher);

// @route   PUT /api/admin/teachers/:id
// @desc    Update teacher
// @access  Private (Admin only)
router.put('/teachers/:id', authenticate, updateTeacher);

// @route   DELETE /api/admin/teachers/:id
// @desc    Delete teacher
// @access  Private (Admin only)
router.delete('/teachers/:id', authenticate, deleteTeacher);

// ============ CLERK MANAGEMENT ROUTES ============

// @route   GET /api/admin/clerks
// @desc    Get all clerks
// @access  Private (Admin only)
router.get('/clerks', authenticate, getAllClerks);

// @route   GET /api/admin/clerks/:id
// @desc    Get clerk by ID
// @access  Private (Admin only)
router.get('/clerks/:id', authenticate, getClerkById);

// @route   POST /api/admin/clerks
// @desc    Create new clerk
// @access  Private (Admin only)
router.post('/clerks', authenticate, createClerk);

// @route   PUT /api/admin/clerks/:id
// @desc    Update clerk
// @access  Private (Admin only)
router.put('/clerks/:id', authenticate, updateClerk);

// @route   DELETE /api/admin/clerks/:id
// @desc    Delete clerk
// @access  Private (Admin only)
router.delete('/clerks/:id', authenticate, deleteClerk);

module.exports = router;