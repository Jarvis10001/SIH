const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  loginClerk,
  getClerkProfile,
  updateClerkProfile,
  getDashboardStats,
  changePassword,
  getAdmissionApplications,
  verifyStudentApplication,
  getVerificationStats,
  verifyDocument,
  getApplicationDocuments,
  getVerificationSummary,
  createClerk,
  getAllClerks,
  getClerkById,
  updateClerk,
  deleteClerk,
  resetClerkPassword
} = require('../controllers/clerkController');

const router = express.Router();

// @route   POST /api/clerk/login
// @desc    Clerk login
// @access  Public
router.post('/login', loginClerk);

// @route   GET /api/clerk/profile
// @desc    Get clerk profile
// @access  Private (Clerk only)
router.get('/profile', authenticate, getClerkProfile);

// @route   PUT /api/clerk/profile
// @desc    Update clerk profile
// @access  Private (Clerk only)
router.put('/profile', authenticate, updateClerkProfile);

// @route   GET /api/clerk/dashboard-stats
// @desc    Get clerk dashboard statistics
// @access  Private (Clerk only)
router.get('/dashboard-stats', authenticate, getDashboardStats);

// @route   POST /api/clerk/change-password
// @desc    Change clerk password
// @access  Private (Clerk only)
router.post('/change-password', authenticate, changePassword);

// @route   GET /api/clerk/admission-applications
// @desc    Get admission applications for verification
// @access  Private (Clerk only)
router.get('/admission-applications', authenticate, getAdmissionApplications);

// @route   PUT /api/clerk/verify-student/:id
// @desc    Verify student application and assign student ID
// @access  Private (Clerk only)
router.put('/verify-student/:id', authenticate, verifyStudentApplication);

// @route   GET /api/clerk/verification-stats
// @desc    Get verification statistics for clerk dashboard
// @access  Private (Clerk only)
router.get('/verification-stats', authenticate, getVerificationStats);

// @route   PUT /api/clerk/verify-document/:applicationId/:documentType
// @desc    Verify individual document with detailed feedback
// @access  Private (Clerk only)
router.put('/verify-document/:applicationId/:documentType', authenticate, verifyDocument);

// @route   GET /api/clerk/application/:id/documents
// @desc    Get application with detailed document verification status
// @access  Private (Clerk only)
router.get('/application/:id/documents', authenticate, getApplicationDocuments);

// @route   GET /api/clerk/application/:id/verification-summary
// @desc    Get document verification summary for application
// @access  Private (Clerk only)
router.get('/application/:id/verification-summary', authenticate, getVerificationSummary);

// Admin-only routes for clerk management
// @route   POST /api/clerk/create
// @desc    Create new clerk
// @access  Private (Admin only)
router.post('/create', authenticate, authorize(['admin']), createClerk);

// @route   GET /api/clerk/all
// @desc    Get all clerks
// @access  Private (Admin only)
router.get('/all', authenticate, authorize(['admin']), getAllClerks);

// @route   GET /api/clerk/:id
// @desc    Get clerk by ID
// @access  Private (Admin only)
router.get('/:id', authenticate, authorize(['admin']), getClerkById);

// @route   PUT /api/clerk/:id
// @desc    Update clerk
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize(['admin']), updateClerk);

// @route   DELETE /api/clerk/:id
// @desc    Delete clerk
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize(['admin']), deleteClerk);

// @route   PUT /api/clerk/:id/reset-password
// @desc    Reset clerk password
// @access  Private (Admin only)
router.put('/:id/reset-password', authenticate, authorize(['admin']), resetClerkPassword);

module.exports = router;