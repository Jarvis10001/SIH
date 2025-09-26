const Admission = require('../models/Admission');

// @desc    Submit admission form
// @route   POST /api/admission/submit
// @access  Private
const submitAdmission = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user has already submitted admission form
    const existingAdmission = await Admission.findOne({ userId });
    if (existingAdmission) {
      return res.status(400).json({
        success: false,
        message: 'Admission form has already been submitted'
      });
    }

    // Extract form data
    const {
      // Personal Information
      name,
      fatherName,
      motherName,
      gender,
      dateOfBirth,
      nationality,
      religion,
      caste,
      category,
      phoneNumber,
      email,
      aadharNumber,
      
      // Address Information
      permanentAddress,
      currentAddress,
      pincode,
      state,
      city,
      
      // Educational Information
      tenthBoard,
      tenthYear,
      tenthPercentage,
      twelfthBoard,
      twelfthYear,
      twelfthPercentage,
      jeeRank,
      jeeScore,
      
      // Course Information
      preferredCourse,
      preferredBranch,
      
      // Additional Information
      hostelRequired,
      transportRequired,
      medicalInfo,
      emergencyContact,
      guardianOccupation,
      annualIncome
    } = req.body;

    // Validate required fields (using the field names that come from frontend)
    if (!name || !fatherName || !email || !phoneNumber || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, fatherName, email, phoneNumber, dateOfBirth'
      });
    }

    // Process uploaded files
    const documents = {};
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        if (req.files[fieldName] && req.files[fieldName][0]) {
          documents[fieldName] = {
            url: req.files[fieldName][0].path,
            publicId: req.files[fieldName][0].filename,
            originalName: req.files[fieldName][0].originalname,
            size: req.files[fieldName][0].size,
            uploadedAt: new Date()
          };
        }
      });
    }

    // Create admission record with correct schema structure
    const admissionData = {
      userId,
      personalInfo: {
        name,
        fatherName,
        motherName,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        mobileNo: phoneNumber,  // schema expects mobileNo, not phoneNumber
        parentsMobileNo: emergencyContact,  // using emergencyContact as parentsMobileNo
        email,
        aadharNo: aadharNumber,  // schema expects aadharNo, not aadharNumber
        nationality,
        religion
      },
      addressInfo: {
        address: permanentAddress,  // schema expects address, not permanentAddress
        city,
        state,
        pincode
      },
      academicInfo: {
        course: preferredCourse,  // schema expects course, not preferredCourse
        branch: preferredBranch,  // schema expects branch, not preferredBranch
        tenth: {
          board: tenthBoard,
          percentage: parseFloat(tenthPercentage),
          yearOfPassing: parseInt(tenthYear)
        },
        twelfth: {
          board: twelfthBoard,
          percentage: parseFloat(twelfthPercentage),
          yearOfPassing: parseInt(twelfthYear)
        },
        jee: {
          rank: jeeRank ? parseInt(jeeRank) : null,
          score: jeeScore ? parseFloat(jeeScore) : null
        }
      },
      categoryInfo: {
        category
      },
      documents,
      status: 'submitted',
      submittedAt: new Date()
    };

    const admission = new Admission(admissionData);
    await admission.save();

    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully',
      admission: {
        id: admission._id,
        applicationNumber: admission.applicationNumber,
        status: admission.status,
        submittedAt: admission.submittedAt
      }
    });

  } catch (error) {
    console.error('Submit admission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit admission form',
      error: error.message
    });
  }
};

// @desc    Get admission form
// @route   GET /api/admission/form
// @access  Private
const getAdmissionForm = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const admission = await Admission.findOne({ userId });
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission form not found'
      });
    }

    res.json({
      success: true,
      admission
    });

  } catch (error) {
    console.error('Get admission form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admission form',
      error: error.message
    });
  }
};

// @desc    Update admission form
// @route   PUT /api/admission/update
// @access  Private
const updateAdmissionForm = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const admission = await Admission.findOne({ userId });
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission form not found'
      });
    }

    // Check if form can be updated (only if not approved/rejected)
    if (['approved', 'rejected'].includes(admission.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update admission form after it has been processed'
      });
    }

    // Handle document uploads and reset verification status for reuploaded documents
    if (req.files) {
      const documentTypes = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'jeeResult', 'categoryCertificate', 'aadharCard', 'photo', 'signature'];
      
      documentTypes.forEach(docType => {
        if (req.files[docType] && req.files[docType][0]) {
          const file = req.files[docType][0];
          
          // Create document object with Cloudinary data
          const documentData = {
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            url: file.path, // Cloudinary secure_url
            publicId: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            cloudinaryData: {
              public_id: file.filename,
              secure_url: file.path,
              resource_type: 'image',
              format: file.originalname.split('.').pop(),
              bytes: file.size,
              created_at: new Date()
            },
            uploadedAt: new Date(),
            // Reset verification status when document is reuploaded
            verificationStatus: 'pending',
            verificationNotes: '',
            verifiedBy: null,
            verifiedAt: null
          };
          
          // Update the document in admission
          if (!admission.documents) admission.documents = {};
          admission.documents[docType] = documentData;
        }
      });
      
      // Recalculate overall verification status after document reupload
      const allDocuments = Object.keys(admission.documents || {});
      const uploadedDocs = allDocuments.filter(docType => 
        admission.documents[docType] && admission.documents[docType].filename
      );
      
      if (uploadedDocs.length > 0) {
        const allVerified = uploadedDocs.every(docType => 
          admission.documents[docType].verificationStatus === 'verified'
        );
        
        const anyRejected = uploadedDocs.some(docType => 
          admission.documents[docType].verificationStatus === 'rejected'
        );
        
        const anyPending = uploadedDocs.some(docType => 
          admission.documents[docType].verificationStatus === 'pending'
        );
        
        // Update overall verification status
        if (anyPending) {
          admission.verificationStatus = 'pending';
          admission.verificationNotes = 'Document verification pending. Some documents have been reuploaded.';
        } else if (anyRejected) {
          admission.verificationStatus = 'rejected';
          admission.verificationNotes = 'One or more documents were rejected. Please check individual document feedback.';
        } else if (allVerified) {
          admission.verificationStatus = 'verified';
          admission.verificationNotes = 'All documents verified successfully.';
        }
      }
    }

    // Update the admission data
    const updateData = { ...req.body };
    delete updateData.userId; // Prevent userId changes
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'documents') { // Don't overwrite documents handled above
        admission[key] = updateData[key];
      }
    });

    admission.updatedAt = new Date();
    await admission.save();

    res.json({
      success: true,
      message: 'Admission form updated successfully',
      admission
    });

  } catch (error) {
    console.error('Update admission form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admission form',
      error: error.message
    });
  }
};

// @desc    Get all admissions (Admin only)
// @route   GET /api/admission/all
// @access  Private (Admin)
const getAllAdmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const admissions = await Admission.find(query)
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Admission.countDocuments(query);

    res.json({
      success: true,
      admissions,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      }
    });

  } catch (error) {
    console.error('Get all admissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admissions',
      error: error.message
    });
  }
};

// @desc    Update admission status (Admin only)
// @route   PUT /api/admission/:id/status
// @access  Private (Admin)
const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const admission = await Admission.findById(id);
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    admission.status = status;
    if (remarks) {
      admission.adminRemarks = remarks;
    }
    admission.updatedAt = new Date();

    await admission.save();

    res.json({
      success: true,
      message: 'Admission status updated successfully',
      admission
    });

  } catch (error) {
    console.error('Update admission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admission status',
      error: error.message
    });
  }
};

// @desc    Get document verification status for student
// @route   GET /api/admission/document-status
// @access  Private (Student)
const getDocumentVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const admission = await Admission.findOne({ userId })
      .populate('documents.tenthMarksheet.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.twelfthMarksheet.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.medicalCertificate.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.jeeResult.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.categoryCertificate.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.aadharCard.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.photo.verifiedBy', 'personalInfo.fullName employeeId')
      .populate('documents.signature.verifiedBy', 'personalInfo.fullName employeeId');
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission form not found'
      });
    }

    // Prepare document summary for student view
    const documentSummary = {};
    const documentTypes = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'jeeResult', 'categoryCertificate', 'aadharCard', 'photo', 'signature'];
    
    documentTypes.forEach(docType => {
      const doc = admission.documents[docType];
      if (doc && doc.filename) {
        documentSummary[docType] = {
          uploaded: true,
          filename: doc.filename,
          originalName: doc.originalName,
          uploadedAt: doc.uploadedAt,
          verificationStatus: doc.verificationStatus || 'pending',
          verificationNotes: doc.verificationNotes || '',
          verifiedAt: doc.verifiedAt,
          verifiedBy: doc.verifiedBy ? {
            name: doc.verifiedBy.personalInfo?.fullName,
            employeeId: doc.verifiedBy.employeeId
          } : null
        };
      } else {
        documentSummary[docType] = {
          uploaded: false,
          verificationStatus: 'not_uploaded'
        };
      }
    });

    // Calculate verification statistics
    const uploadedDocs = documentTypes.filter(docType => 
      admission.documents[docType] && admission.documents[docType].filename
    );
    
    const verifiedDocs = uploadedDocs.filter(docType => 
      admission.documents[docType].verificationStatus === 'verified'
    );
    
    const rejectedDocs = uploadedDocs.filter(docType => 
      admission.documents[docType].verificationStatus === 'rejected'
    );

    const verificationSummary = {
      totalDocuments: documentTypes.length,
      uploaded: uploadedDocs.length,
      notUploaded: documentTypes.length - uploadedDocs.length,
      verified: verifiedDocs.length,
      rejected: rejectedDocs.length,
      pending: uploadedDocs.length - verifiedDocs.length - rejectedDocs.length,
      completionPercentage: uploadedDocs.length > 0 ? Math.round((verifiedDocs.length / uploadedDocs.length) * 100) : 0,
      overallStatus: admission.verificationStatus || 'pending',
      overallNotes: admission.verificationNotes || ''
    };

    res.json({
      success: true,
      data: {
        applicationNumber: admission.applicationNumber,
        submittedAt: admission.submittedAt,
        verificationSummary,
        documents: documentSummary,
        personalInfo: {
          name: admission.personalInfo?.name,
          email: admission.personalInfo?.email
        },
        academicInfo: {
          course: admission.academicInfo?.course,
          branch: admission.academicInfo?.branch
        }
      }
    });

  } catch (error) {
    console.error('Get document verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document verification status',
      error: error.message
    });
  }
};

// @desc    Reupload specific document
// @route   PUT /api/admission/reupload-document/:documentType
// @access  Private (Student)
const reuploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentType } = req.params;
    
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

    if (!req.files || !req.files[documentType] || !req.files[documentType][0]) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const admission = await Admission.findOne({ userId });
    
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission form not found'
      });
    }

    // Check if the application is not in final status
    if (['approved', 'rejected'].includes(admission.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reupload documents after final processing'
      });
    }

    const file = req.files[documentType][0];
    
    // Create new document object with reset verification status
    const documentData = {
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      url: file.path, // Cloudinary secure_url
      publicId: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      cloudinaryData: {
        public_id: file.filename,
        secure_url: file.path,
        resource_type: 'image',
        format: file.originalname.split('.').pop(),
        bytes: file.size,
        created_at: new Date()
      },
      uploadedAt: new Date(),
      // Reset verification status for reuploaded document
      verificationStatus: 'pending',
      verificationNotes: '',
      verifiedBy: null,
      verifiedAt: null
    };
    
    // Update the specific document
    if (!admission.documents) admission.documents = {};
    admission.documents[documentType] = documentData;
    
    // Recalculate overall verification status
    const allDocuments = Object.keys(admission.documents || {});
    const uploadedDocs = allDocuments.filter(docType => 
      admission.documents[docType] && admission.documents[docType].filename
    );
    
    if (uploadedDocs.length > 0) {
      const allVerified = uploadedDocs.every(docType => 
        admission.documents[docType].verificationStatus === 'verified'
      );
      
      const anyRejected = uploadedDocs.some(docType => 
        admission.documents[docType].verificationStatus === 'rejected'
      );
      
      const anyPending = uploadedDocs.some(docType => 
        admission.documents[docType].verificationStatus === 'pending'
      );
      
      // Update overall verification status
      if (anyPending) {
        admission.verificationStatus = 'pending';
        admission.verificationNotes = `Document reuploaded for verification. ${documentType} has been submitted for review.`;
      } else if (anyRejected) {
        admission.verificationStatus = 'rejected';
        admission.verificationNotes = 'One or more documents were rejected. Please check individual document feedback.';
      } else if (allVerified) {
        admission.verificationStatus = 'verified';
        admission.verificationNotes = 'All documents verified successfully.';
      }
    }

    admission.updatedAt = new Date();
    await admission.save();

    res.json({
      success: true,
      message: `${documentType} reuploaded successfully and queued for verification`,
      data: {
        documentType,
        verificationStatus: 'pending',
        uploadedAt: documentData.uploadedAt,
        overallStatus: admission.verificationStatus
      }
    });

  } catch (error) {
    console.error('Reupload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reupload document',
      error: error.message
    });
  }
};

module.exports = {
  submitAdmission,
  getAdmissionForm,
  updateAdmissionForm,
  getAllAdmissions,
  updateAdmissionStatus,
  getDocumentVerificationStatus,
  reuploadDocument
};