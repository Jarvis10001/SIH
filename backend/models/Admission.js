const mongoose = require('mongoose');

// Reusable document schema for Cloudinary integration
const documentSchema = {
  filename: String, // Cloudinary public_id
  originalName: String,
  path: String, // Legacy field (for backward compatibility)
  url: String, // Cloudinary secure_url
  publicId: String, // Cloudinary public_id for operations
  size: Number,
  mimetype: String,
  cloudinaryData: {
    public_id: String,
    secure_url: String,
    resource_type: String,
    format: String,
    bytes: Number,
    created_at: Date
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
};

const admissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  personalInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      required: true,
      trim: true
    },
    motherName: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    mobileNo: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/
    },
    parentsMobileNo: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },
    aadharNo: {
      type: String,
      required: true,
      match: /^\d{12}$/,
      unique: true
    },
    religion: {
      type: String,
      trim: true
    },
    nationality: {
      type: String,
      default: 'Indian',
      trim: true
    }
  },
  
  addressInfo: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: /^\d{6}$/
    },
    isOtherState: {
      type: Boolean,
      default: false
    },
    domicileState: {
      type: String,
      trim: true
    }
  },
  
  academicInfo: {
    course: {
      type: String,
      required: true,
      enum: ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'MBA', 'B.Com', 'M.Com', 'BA', 'MA']
    },
    branch: {
      type: String,
      required: true,
      trim: true
    },
    tenth: {
      board: {
        type: String,
        required: true,
        trim: true
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      yearOfPassing: {
        type: Number,
        required: true,
        min: 2000,
        max: 2030
      }
    },
    twelfth: {
      board: {
        type: String,
        required: true,
        trim: true
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      yearOfPassing: {
        type: Number,
        required: true,
        min: 2000,
        max: 2030
      }
    },
    jee: {
      rollNo: {
        type: String,
        trim: true
      },
      rank: {
        type: Number,
        min: 1
      },
      score: {
        type: Number,
        min: 0
      }
    }
  },
  
  categoryInfo: {
    category: {
      type: String,
      required: true,
      enum: ['General', 'OBC-NCL', 'SC', 'ST', 'EWS']
    },
    isMinority: {
      type: Boolean,
      default: false
    },
    minorityType: {
      type: String,
      trim: true
    }
  },
  
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relation: {
      type: String,
      trim: true
    },
    mobile: {
      type: String,
      match: /^[6-9]\d{9}$/
    }
  },
  
  documents: {
    tenthMarksheet: {
      filename: String, // Cloudinary public_id
      originalName: String,
      path: String, // Legacy field (for backward compatibility)
      url: String, // Cloudinary secure_url
      publicId: String, // Cloudinary public_id for operations
      size: Number,
      mimetype: String,
      cloudinaryData: {
        public_id: String,
        secure_url: String,
        resource_type: String,
        format: String,
        bytes: Number,
        created_at: Date
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    twelfthMarksheet: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    medicalCertificate: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    jeeResult: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    categoryCertificate: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    aadharCard: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    photo: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    },
    signature: {
      ...documentSchema,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verificationNotes: {
        type: String,
        trim: true
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clerk'
      },
      verifiedAt: {
        type: Date
      }
    }
  },
  
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'approved', 'rejected', 'pending-documents'],
    default: 'submitted'
  },
  
  adminRemarks: {
    type: String,
    trim: true
  },
  
  applicationNumber: {
    type: String,
    unique: true
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  reviewedAt: {
    type: Date
  },
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Payment related fields
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  admissionStatus: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected', 'confirmed', 'admitted'],
    default: 'submitted'
  },
  
  // Verification fields for clerk processing
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  verificationNotes: {
    type: String,
    trim: true
  },
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clerk'
  },
  
  verifiedAt: {
    type: Date
  },
  
  studentId: {
    type: String,
    sparse: true, // Allow null but ensure uniqueness when set
    unique: true
  },
  
  feeAmount: {
    type: Number,
    default: 65000 // Default total fee amount
  }
}, {
  timestamps: true
});

// Generate application number before saving
admissionSchema.pre('save', async function(next) {
  if (this.isNew && !this.applicationNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      submittedAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.applicationNumber = `ADM${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for efficient queries
admissionSchema.index({ userId: 1 });
admissionSchema.index({ 'personalInfo.aadharNo': 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ 'academicInfo.course': 1 });
admissionSchema.index({ 'academicInfo.branch': 1 });
admissionSchema.index({ submittedAt: -1 });
admissionSchema.index({ applicationNumber: 1 });
admissionSchema.index({ verificationStatus: 1 });
admissionSchema.index({ studentId: 1 });
admissionSchema.index({ verifiedBy: 1 });

// Virtual for age calculation
admissionSchema.virtual('personalInfo.age').get(function() {
  if (this.personalInfo.dateOfBirth) {
    const today = new Date();
    const birthDate = this.personalInfo.dateOfBirth;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Method to check if all required documents are uploaded
admissionSchema.methods.hasAllRequiredDocuments = function() {
  const requiredDocs = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'aadharCard', 'photo'];
  
  // Add course-specific required documents
  if (this.academicInfo.course === 'B.Tech' || this.academicInfo.course === 'M.Tech') {
    requiredDocs.push('jeeResult');
  }
  
  // Add category-specific required documents
  if (['OBC-NCL', 'SC', 'ST', 'EWS'].includes(this.categoryInfo.category)) {
    requiredDocs.push('categoryCertificate');
  }
  
  return requiredDocs.every(doc => this.documents[doc] && this.documents[doc].filename);
};

// Method to get missing documents
admissionSchema.methods.getMissingDocuments = function() {
  const requiredDocs = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'aadharCard', 'photo'];
  
  // Add course-specific required documents
  if (this.academicInfo.course === 'B.Tech' || this.academicInfo.course === 'M.Tech') {
    requiredDocs.push('jeeResult');
  }
  
  // Add category-specific required documents
  if (['OBC-NCL', 'SC', 'ST', 'EWS'].includes(this.categoryInfo.category)) {
    requiredDocs.push('categoryCertificate');
  }
  
  return requiredDocs.filter(doc => !this.documents[doc] || !this.documents[doc].filename);
};

// Static method to get admission statistics
admissionSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        submitted: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
        underReview: { $sum: { $cond: [{ $eq: ['$status', 'under-review'] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        pendingDocuments: { $sum: { $cond: [{ $eq: ['$status', 'pending-documents'] }, 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    pendingDocuments: 0
  };
};

// Static method to get course-wise statistics
admissionSchema.statics.getCourseWiseStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: {
          course: '$academicInfo.course',
          branch: '$academicInfo.branch'
        },
        count: { $sum: 1 },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
        avgTenthPercentage: { $avg: '$academicInfo.tenth.percentage' },
        avgTwelfthPercentage: { $avg: '$academicInfo.twelfth.percentage' }
      }
    },
    {
      $sort: { '_id.course': 1, '_id.branch': 1 }
    }
  ]);
};

module.exports = mongoose.model('Admission', admissionSchema);