const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const Clerk = require('../models/Clerk');
const Admission = require('../models/Admission');

// @desc    Clerk login
// @route   POST /api/clerk/login
// @access  Public
const loginClerk = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    // Validation
    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide employee ID and password'
      });
    }

    // Check if clerk exists and is active
    const clerk = await Clerk.findOne({ 
      employeeId,
      isActive: true 
    }).select('+password');

    if (!clerk) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account inactive'
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, clerk.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: clerk._id,
        role: 'clerk',
        employeeId: clerk.employeeId,
        systemAccess: clerk.systemAccess
      }
    };

    // Generate JWT token
    const token = generateToken(payload, '24h');

    // Prepare response data (exclude sensitive information)
    const clerkData = {
      id: clerk._id,
      employeeId: clerk.employeeId,
      personalInfo: clerk.personalInfo,
      professionalInfo: clerk.professionalInfo,
      systemAccess: clerk.systemAccess,
      lastLogin: new Date()
    };

    // Update last login
    clerk.lastLogin = new Date();
    await clerk.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      clerk: clerkData
    });

  } catch (error) {
    console.error('Clerk login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get clerk profile
// @route   GET /api/clerk/profile
// @access  Private (Clerk only)
const getClerkProfile = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    const clerk = await Clerk.findById(req.user.id).select('-password');
    
    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    res.json({
      success: true,
      clerk
    });

  } catch (error) {
    console.error('Get clerk profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update clerk profile
// @route   PUT /api/clerk/profile
// @access  Private (Clerk only)
const updateClerkProfile = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    const {
      personalInfo,
      professionalInfo
    } = req.body;

    const clerk = await Clerk.findById(req.user.id);
    
    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    // Update allowed fields only
    if (personalInfo) {
      clerk.personalInfo = {
        ...clerk.personalInfo,
        phone: personalInfo.phone || clerk.personalInfo.phone,
        address: personalInfo.address || clerk.personalInfo.address,
        emergencyContact: personalInfo.emergencyContact || clerk.personalInfo.emergencyContact
      };
    }

    if (professionalInfo) {
      clerk.professionalInfo = {
        ...clerk.professionalInfo,
        experience: professionalInfo.experience || clerk.professionalInfo.experience
      };
    }

    clerk.updatedAt = new Date();
    await clerk.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      clerk: clerk.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } })
    });

  } catch (error) {
    console.error('Update clerk profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Get clerk dashboard statistics
// @route   GET /api/clerk/dashboard-stats
// @access  Private (Clerk only)
const getDashboardStats = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    const clerk = await Clerk.findById(req.user.id);
    
    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    // Basic stats that all clerks can see
    const stats = {
      modules: clerk.systemAccess.modules.length,
      accessLevel: clerk.systemAccess.accessLevel,
      department: clerk.professionalInfo.department,
      workShift: clerk.professionalInfo.workShift,
      lastLogin: clerk.lastLogin || 'Never'
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get clerk dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

// @desc    Change clerk password
// @route   POST /api/clerk/change-password
// @access  Private (Clerk only)
const changePassword = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const clerk = await Clerk.findById(req.user.id).select('+password');
    
    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, clerk.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    clerk.password = await bcrypt.hash(newPassword, salt);
    clerk.updatedAt = new Date();

    await clerk.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change clerk password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
};

// @desc    Get admission applications for verification
// @route   GET /api/clerk/admission-applications
// @access  Private (Clerk only)
const getAdmissionApplications = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    // Check if clerk has admission processing access
    if (!req.user.systemAccess || !req.user.systemAccess.modules.includes('admission_processing')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admission processing permission required.'
      });
    }

    const { status = 'pending' } = req.query;
    
    let query = {};
    if (status === 'pending') {
      query.verificationStatus = { $in: ['pending', null, undefined] };
    } else {
      query.verificationStatus = status;
    }

    const applications = await Admission.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Get admission applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
};

// @desc    Verify student application and assign student ID
// @route   PUT /api/clerk/verify-student/:id
// @access  Private (Clerk only)
const verifyStudentApplication = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    // Check if clerk has admission processing access
    const clerk = await Clerk.findById(req.user.id);
    if (!clerk.systemAccess.modules.includes('admission_processing')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admission processing permission required.'
      });
    }

    const { status, verificationNotes, studentId } = req.body;
    const applicationId = req.params.id;

    // Validation
    if (!status || !['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (verified/rejected) is required'
      });
    }

    if (status === 'verified' && !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required for verification'
      });
    }

    const application = await Admission.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if student ID already exists (if verifying)
    if (status === 'verified') {
      const existingStudent = await Admission.findOne({ 
        studentId: studentId,
        _id: { $ne: applicationId }
      });
      
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Student ID already exists. Please generate a unique ID.'
        });
      }
    }

    // Update application
    application.verificationStatus = status;
    application.verificationNotes = verificationNotes;
    application.verifiedBy = req.user.id;
    application.verifiedAt = new Date();
    
    if (status === 'verified') {
      application.studentId = studentId;
      application.admissionStatus = 'admitted';
    } else {
      application.admissionStatus = 'rejected';
    }

    await application.save();

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      application
    });

  } catch (error) {
    console.error('Verify student application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying application'
    });
  }
};

// @desc    Get verification statistics for clerk dashboard
// @route   GET /api/clerk/verification-stats
// @access  Private (Clerk only)
const getVerificationStats = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    // Check if clerk has admission processing access
    const clerk = await Clerk.findById(req.user.id);
    if (!clerk.systemAccess.modules.includes('admission_processing')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admission processing permission required.'
      });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get overall stats
    const totalApplications = await Admission.countDocuments();
    const pendingApplications = await Admission.countDocuments({
      verificationStatus: { $in: ['pending', null, undefined] }
    });
    const verifiedApplications = await Admission.countDocuments({
      verificationStatus: 'verified'
    });
    const rejectedApplications = await Admission.countDocuments({
      verificationStatus: 'rejected'
    });

    // Get today's verifications by this clerk
    const todayVerifications = await Admission.countDocuments({
      verifiedBy: req.user.id,
      verifiedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const stats = {
      totalApplications,
      pendingApplications,
      verifiedApplications,
      rejectedApplications,
      todayVerifications,
      verificationRate: totalApplications > 0 ? 
        Math.round(((verifiedApplications + rejectedApplications) / totalApplications) * 100) : 0
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get verification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching verification stats'
    });
  }
};

// @desc    Verify individual document
// @route   PUT /api/clerk/verify-document/:applicationId/:documentType
// @access  Private (Clerk only)
const verifyDocument = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    // Check if clerk has admission processing access
    const clerk = await Clerk.findById(req.user.id);
    if (!clerk.systemAccess.modules.includes('admission_processing')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admission processing permission required.'
      });
    }

    const { applicationId, documentType } = req.params;
    const { status, notes } = req.body;

    // Validation
    if (!status || !['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (verified/rejected) is required'
      });
    }

    const validDocumentTypes = [
      'tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 
      'jeeResult', 'categoryCertificate', 'aadharCard', 'photo', 'signature'
    ];

    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    const application = await Admission.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if document exists
    if (!application.documents[documentType] || !application.documents[documentType].filename) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update document verification status
    application.documents[documentType].verificationStatus = status;
    application.documents[documentType].verificationNotes = notes || '';
    application.documents[documentType].verifiedBy = req.user.id;
    application.documents[documentType].verifiedAt = new Date();

    // Check if all uploaded documents are verified
    const documentTypes = Object.keys(application.documents);
    const uploadedDocs = documentTypes.filter(docType => 
      application.documents[docType] && application.documents[docType].filename
    );
    
    const allVerified = uploadedDocs.every(docType => 
      application.documents[docType].verificationStatus === 'verified'
    );
    
    const anyRejected = uploadedDocs.some(docType => 
      application.documents[docType].verificationStatus === 'rejected'
    );

    // Update overall verification status based on individual document statuses
    if (anyRejected) {
      application.verificationStatus = 'rejected';
      application.verificationNotes = 'One or more documents were rejected. Please check individual document feedback.';
    } else if (allVerified) {
      application.verificationStatus = 'verified';
      application.verificationNotes = 'All documents verified successfully.';
    } else {
      application.verificationStatus = 'pending';
    }

    await application.save();

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      application
    });

  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying document'
    });
  }
};

// @desc    Get application with detailed document verification status
// @route   GET /api/clerk/application/:id/documents
// @access  Private (Clerk only)
const getApplicationDocuments = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    // Check if clerk has admission processing access
    const clerk = await Clerk.findById(req.user.id);
    if (!clerk.systemAccess.modules.includes('admission_processing')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admission processing permission required.'
      });
    }

    const { id } = req.params;

    const application = await Admission.findById(id)
      .populate('verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.tenthMarksheet.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.twelfthMarksheet.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.medicalCertificate.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.jeeResult.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.categoryCertificate.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.aadharCard.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.photo.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.signature.verifiedBy', 'personalInfo.fullName employeeId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Prepare document summary
    const documentSummary = {};
    const documentTypes = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'jeeResult', 'categoryCertificate', 'aadharCard', 'photo', 'signature'];
    
    documentTypes.forEach(docType => {
      const doc = application.documents[docType];
      if (doc && doc.filename) {
        documentSummary[docType] = {
          uploaded: true,
          filename: doc.filename,
          originalName: doc.originalName,
          url: doc.url,
          uploadedAt: doc.uploadedAt,
          verificationStatus: doc.verificationStatus || 'pending',
          verificationNotes: doc.verificationNotes || '',
          verifiedBy: doc.verifiedBy,
          verifiedAt: doc.verifiedAt,
          size: doc.size,
          mimetype: doc.mimetype
        };
      } else {
        documentSummary[docType] = {
          uploaded: false,
          verificationStatus: 'not_uploaded'
        };
      }
    });

    res.json({
      success: true,
      application: {
        _id: application._id,
        applicationNumber: application.applicationNumber,
        personalInfo: application.personalInfo,
        academicInfo: application.academicInfo,
        categoryInfo: application.categoryInfo,
        addressInfo: application.addressInfo,
        verificationStatus: application.verificationStatus,
        verificationNotes: application.verificationNotes,
        submittedAt: application.submittedAt,
        documents: documentSummary
      }
    });

  } catch (error) {
    console.error('Get application documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application documents'
    });
  }
};

// @desc    Get document verification statistics for specific application
// @route   GET /api/clerk/application/:id/verification-summary
// @access  Private (Clerk only)
const getVerificationSummary = async (req, res) => {
  try {
    // Check if user is clerk
    if (req.user.role !== 'clerk') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Clerk role required.'
      });
    }

    const { id } = req.params;

    const application = await Admission.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const documentTypes = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'jeeResult', 'categoryCertificate', 'aadharCard', 'photo', 'signature'];
    
    let uploaded = 0;
    let verified = 0;
    let rejected = 0;
    let pending = 0;

    documentTypes.forEach(docType => {
      const doc = application.documents[docType];
      if (doc && doc.filename) {
        uploaded++;
        const status = doc.verificationStatus || 'pending';
        if (status === 'verified') verified++;
        else if (status === 'rejected') rejected++;
        else pending++;
      }
    });

    const summary = {
      totalDocuments: documentTypes.length,
      uploaded,
      notUploaded: documentTypes.length - uploaded,
      verified,
      rejected,
      pending,
      completionPercentage: uploaded > 0 ? Math.round((verified / uploaded) * 100) : 0,
      overallStatus: application.verificationStatus || 'pending'
    };

    res.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Get verification summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching verification summary'
    });
  }
};

// @desc    Create new clerk (Admin only)
// @route   POST /api/clerk/create
// @access  Private (Admin only)
const createClerk = async (req, res) => {
  try {
    const {
      employeeId,
      personalInfo,
      professionalInfo,
      systemAccess,
      password = 'clerk123' // Default password
    } = req.body;

    // Validation
    if (!employeeId || !personalInfo?.fullName || !personalInfo?.email || !professionalInfo?.designation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if clerk already exists
    const existingClerk = await Clerk.findOne({
      $or: [
        { employeeId },
        { 'personalInfo.email': personalInfo.email }
      ]
    });

    if (existingClerk) {
      return res.status(400).json({
        success: false,
        message: 'Clerk with this employee ID or email already exists'
      });
    }

    // Calculate total salary if components provided
    if (professionalInfo.salary && (professionalInfo.salary.basic || professionalInfo.salary.allowances)) {
      professionalInfo.salary.total = (professionalInfo.salary.basic || 0) + (professionalInfo.salary.allowances || 0);
    }

    // Create new clerk
    const clerk = new Clerk({
      employeeId,
      personalInfo,
      professionalInfo,
      systemAccess: systemAccess || {
        modules: ['student_management'],
        accessLevel: 'read'
      },
      password,
      createdBy: req.user.id
    });

    await clerk.save();

    // Remove password from response
    const clerkResponse = clerk.toJSON();
    delete clerkResponse.password;

    res.status(201).json({
      success: true,
      message: 'Clerk created successfully',
      data: clerkResponse
    });

  } catch (error) {
    console.error('Create clerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating clerk'
    });
  }
};

// @desc    Get all clerks (Admin only)
// @route   GET /api/clerk/all
// @access  Private (Admin only)
const getAllClerks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query['professionalInfo.department'] = department;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOptions,
      populate: {
        path: 'createdBy',
        select: 'username'
      }
    };

    const result = await Clerk.paginate(query, options);

    res.json({
      success: true,
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        limit: result.limit,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get all clerks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching clerks'
    });
  }
};

// @desc    Get clerk by ID (Admin only)
// @route   GET /api/clerk/:id
// @access  Private (Admin only)
const getClerkById = async (req, res) => {
  try {
    const clerk = await Clerk.findById(req.params.id).populate('createdBy', 'username');

    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    res.json({
      success: true,
      data: clerk
    });

  } catch (error) {
    console.error('Get clerk by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching clerk'
    });
  }
};

// @desc    Update clerk (Admin only)
// @route   PUT /api/clerk/:id
// @access  Private (Admin only)
const updateClerk = async (req, res) => {
  try {
    const {
      personalInfo,
      professionalInfo,
      systemAccess,
      isActive
    } = req.body;

    const clerk = await Clerk.findById(req.params.id);

    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    // Update fields
    if (personalInfo) {
      Object.assign(clerk.personalInfo, personalInfo);
    }

    if (professionalInfo) {
      Object.assign(clerk.professionalInfo, professionalInfo);
      
      // Recalculate total salary if components changed
      if (professionalInfo.salary && (professionalInfo.salary.basic !== undefined || professionalInfo.salary.allowances !== undefined)) {
        clerk.professionalInfo.salary.total = (clerk.professionalInfo.salary.basic || 0) + (clerk.professionalInfo.salary.allowances || 0);
      }
    }

    if (systemAccess) {
      Object.assign(clerk.systemAccess, systemAccess);
    }

    if (isActive !== undefined) {
      clerk.isActive = isActive;
    }

    await clerk.save();

    res.json({
      success: true,
      message: 'Clerk updated successfully',
      data: clerk
    });

  } catch (error) {
    console.error('Update clerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating clerk'
    });
  }
};

// @desc    Delete clerk (Admin only)
// @route   DELETE /api/clerk/:id
// @access  Private (Admin only)
const deleteClerk = async (req, res) => {
  try {
    const clerk = await Clerk.findById(req.params.id);

    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    // Soft delete - set isActive to false
    clerk.isActive = false;
    await clerk.save();

    res.json({
      success: true,
      message: 'Clerk deleted successfully'
    });

  } catch (error) {
    console.error('Delete clerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting clerk'
    });
  }
};

// @desc    Reset clerk password (Admin only)
// @route   PUT /api/clerk/:id/reset-password
// @access  Private (Admin only)
const resetClerkPassword = async (req, res) => {
  try {
    const { newPassword = 'clerk123' } = req.body;

    const clerk = await Clerk.findById(req.params.id);

    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    clerk.password = newPassword;
    await clerk.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password'
    });
  }
};

module.exports = {
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
};