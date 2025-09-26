const express = require('express');
const {
  getAllStudents,
  getStudentById,
  getStudentByStudentId,
  registerStudent,
  loginStudent,
  updateStudent,
  changePassword,
  updateStudentStatus,
  getStudentAnalytics,
  logoutStudent
} = require('../controllers/StudentController');

const { authenticate, authorize, authenticateRefreshToken } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Analytics route (can be public or protected based on requirements)
router.get('/analytics/summary', authenticate, authorize(['admin', 'staff']), getStudentAnalytics);

// Protected routes (authentication required)
router.use(authenticate); // All routes below this require authentication

// Student profile routes
router.post('/logout', logoutStudent);
router.get('/profile', (req, res) => {
  // Return current student's profile
  res.json({
    success: true,
    message: 'Student profile retrieved successfully',
    data: req.user
  });
});

// Admin/Staff only routes for student management
router.get('/', authorize(['admin', 'staff']), getAllStudents);
router.get('/:id', authorize(['admin', 'staff', 'student']), getStudentById);
router.get('/student-id/:studentId', authorize(['admin', 'staff']), getStudentByStudentId);
router.put('/:id', authorize(['admin', 'staff']), updateStudent);
router.put('/:id/status', authorize(['admin']), updateStudentStatus);

// Password change (students can change their own password, admins can change any)
router.put('/:id/change-password', (req, res, next) => {
  // Allow students to change their own password
  if (req.user.role === 'student' && req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only change your own password'
    });
  }
  next();
}, changePassword);

module.exports = router;