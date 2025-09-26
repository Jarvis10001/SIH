const express = require('express');
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const { storage, fileFilter } = require('../config/cloudinary');
const {
  submitAdmission,
  getAdmissionForm,
  updateAdmissionForm,
  getAllAdmissions,
  updateAdmissionStatus,
  getDocumentVerificationStatus,
  reuploadDocument
} = require('../controllers/admissionController');

const router = express.Router();

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for documents
  }
});

// Define the fields for file upload
const uploadFields = upload.fields([
  { name: 'tenthMarksheet', maxCount: 1 },
  { name: 'twelfthMarksheet', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 },
  { name: 'jeeResult', maxCount: 1 },
  { name: 'categoryCertificate', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]);

// @route   POST /api/admission/submit
// @desc    Submit admission form
// @access  Private
router.post('/submit', authenticate, uploadFields, submitAdmission);

// @route   GET /api/admission/form
// @desc    Get admission form
// @access  Private
router.get('/form', authenticate, getAdmissionForm);

// @route   PUT /api/admission/update
// @desc    Update admission form
// @access  Private
router.put('/update', authenticate, uploadFields, updateAdmissionForm);

// @route   GET /api/admission/document-status
// @desc    Get document verification status for student
// @access  Private (Student)
router.get('/document-status', authenticate, getDocumentVerificationStatus);

// @route   PUT /api/admission/reupload-document/:documentType
// @desc    Reupload specific rejected document
// @access  Private (Student)
router.put('/reupload-document/:documentType', authenticate, (req, res, next) => {
  // Dynamic field name based on document type
  const documentType = req.params.documentType;
  const dynamicUpload = upload.single(documentType);
  dynamicUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message
      });
    }
    
    // Convert single file to the expected format
    if (req.file) {
      req.files = {};
      req.files[documentType] = [req.file];
    }
    
    next();
  });
}, reuploadDocument);

// @route   GET /api/admission/all
// @desc    Get all admissions (Admin only)
// @access  Private (Admin)
router.get('/all', authenticate, getAllAdmissions);

// @route   PUT /api/admission/:id/status
// @desc    Update admission status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', authenticate, updateAdmissionStatus);

module.exports = router;