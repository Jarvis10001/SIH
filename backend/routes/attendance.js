const express = require('express');
const router = express.Router();
const {
  upload,
  uploadAttendance,
  getTeacherAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
  downloadTemplate
} = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');

// Public template download (no auth required)
router.get('/template', downloadTemplate);

// All other routes require authentication
router.use(authenticate);

// Teacher routes
router.post('/upload', upload.single('attendanceFile'), uploadAttendance);
router.get('/teacher', getTeacherAttendance);
router.get('/:id', getAttendanceById);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

// Student routes
router.get('/student/:studentId', getStudentAttendance);

module.exports = router;