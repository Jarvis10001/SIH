const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    middleName: {
      type: String,
      trim: true,
      maxlength: [50, 'Middle name cannot exceed 50 characters']
    }
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  
  // Academic Information
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [
      /^[A-Z0-9]{6,12}$/,
      'Student ID must be 6-12 characters long and contain only letters and numbers'
    ]
  },
  
  year: {
    type: Number,
    required: [true, 'Academic year is required'],
    min: [1, 'Year must be at least 1'],
    max: [6, 'Year cannot exceed 6'], // For engineering programs
    validate: {
      validator: Number.isInteger,
      message: 'Year must be a whole number'
    }
  },
  
  branch: {
    type: String,
    required: [true, 'Branch/Department is required'],
    enum: {
      values: [
        'Computer Science Engineering',
        'Information Technology', 
        'Electronics and Communication Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Biotechnology',
        'Aerospace Engineering',
        'Automobile Engineering',
        'Business Administration',
        'Master of Computer Applications',
        'Other'
      ],
      message: 'Please select a valid branch'
    }
  },
  
  semester: {
    type: Number,
    required: [true, 'Current semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [12, 'Semester cannot exceed 12'],
    validate: {
      validator: Number.isInteger,
      message: 'Semester must be a whole number'
    }
  },
  
  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Personal Information
  personalInfo: {
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function(value) {
          return value < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: [true, 'Gender is required']
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      uppercase: true
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      default: 'Indian'
    },
    religion: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'Other'],
      required: [true, 'Category is required']
    }
  },
  
  // Contact Details
  contact: {
    phone: {
      primary: {
        type: String,
        required: [true, 'Primary phone number is required'],
        match: [/^[\+]?[1-9][\d]{9,15}$/, 'Please provide a valid phone number']
      },
      secondary: {
        type: String,
        match: [/^[\+]?[1-9][\d]{9,15}$/, 'Please provide a valid phone number']
      }
    },
    address: {
      permanent: {
        street: {
          type: String,
          required: [true, 'Permanent address street is required']
        },
        city: {
          type: String,
          required: [true, 'Permanent address city is required']
        },
        state: {
          type: String,
          required: [true, 'Permanent address state is required']
        },
        pinCode: {
          type: String,
          required: [true, 'Permanent address pin code is required'],
          match: [/^[1-9][0-9]{5}$/, 'Please provide a valid pin code']
        },
        country: {
          type: String,
          required: [true, 'Country is required'],
          default: 'India'
        }
      },
      current: {
        street: String,
        city: String,
        state: String,
        pinCode: {
          type: String,
          match: [/^[1-9][0-9]{5}$/, 'Please provide a valid pin code']
        },
        country: {
          type: String,
          default: 'India'
        },
        isSameAsPermanent: {
          type: Boolean,
          default: false
        }
      }
    }
  },
  
  // Guardian Information
  guardian: {
    father: {
      name: {
        type: String,
        required: [true, "Father's name is required"]
      },
      occupation: String,
      phone: {
        type: String,
        match: [/^[\+]?[1-9][\d]{9,15}$/, 'Please provide a valid phone number']
      },
      email: {
        type: String,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
      },
      annualIncome: {
        type: Number,
        min: [0, 'Annual income cannot be negative']
      }
    },
    mother: {
      name: {
        type: String,
        required: [true, "Mother's name is required"]
      },
      occupation: String,
      phone: {
        type: String,
        match: [/^[\+]?[1-9][\d]{9,15}$/, 'Please provide a valid phone number']
      },
      email: {
        type: String,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
      }
    },
    guardian: {
      name: String,
      relation: String,
      phone: {
        type: String,
        match: [/^[\+]?[1-9][\d]{9,15}$/, 'Please provide a valid phone number']
      },
      email: {
        type: String,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
      }
    }
  },
  
  // Academic Records
  academics: {
    admissionDate: {
      type: Date,
      required: [true, 'Admission date is required']
    },
    admissionType: {
      type: String,
      enum: ['Regular', 'Lateral Entry', 'Transfer', 'Management Quota'],
      required: [true, 'Admission type is required']
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      uppercase: true
    },
    section: {
      type: String,
      uppercase: true,
      maxlength: [2, 'Section cannot exceed 2 characters']
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
      default: 0
    },
    previousEducation: {
      tenthGrade: {
        board: String,
        school: String,
        percentage: {
          type: Number,
          min: [0, 'Percentage cannot be negative'],
          max: [100, 'Percentage cannot exceed 100']
        },
        yearOfPassing: {
          type: Number,
          min: [1990, 'Year of passing seems too old'],
          max: [new Date().getFullYear(), 'Year of passing cannot be in future']
        }
      },
      twelfthGrade: {
        board: String,
        school: String,
        percentage: {
          type: Number,
          min: [0, 'Percentage cannot be negative'],
          max: [100, 'Percentage cannot exceed 100']
        },
        yearOfPassing: {
          type: Number,
          min: [1990, 'Year of passing seems too old'],
          max: [new Date().getFullYear(), 'Year of passing cannot be in future']
        }
      }
    }
  },
  
  // Account Status
  status: {
    isActive: {
      type: Boolean,
      default: true
    },
    isGraduated: {
      type: Boolean,
      default: false
    },
    graduationDate: Date,
    accountStatus: {
      type: String,
      enum: ['Active', 'Suspended', 'Graduated', 'Dropped', 'On Leave'],
      default: 'Active'
    }
  },
  
  // Authentication & Security
  security: {
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },
    lastLogin: Date,
    refreshTokens: [{
      token: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000 // 30 days
      }
    }]
  },
  
  // File References
  documents: {
    profilePhoto: {
      type: String, // File path or URL
      default: null
    },
    signature: {
      type: String, // File path or URL
      default: null
    },
    documents: [{
      name: String,
      type: {
        type: String,
        enum: ['Aadhar', 'PAN', 'Birth Certificate', 'Caste Certificate', 'Income Certificate', 'Other']
      },
      filePath: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Additional ERP Features
  fees: {
    totalFees: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    lastPaymentDate: Date
  },
  
  hostel: {
    isHostelStudent: {
      type: Boolean,
      default: false
    },
    hostelName: String,
    roomNumber: String,
    floorNumber: Number
  },
  
  // Transportation
  transport: {
    usesTransport: {
      type: Boolean,
      default: false
    },
    routeNumber: String,
    stopName: String
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'students'
});

// Indexes for better performance
// Note: email, studentId, and academics.rollNumber indexes are automatically created due to unique: true
studentSchema.index({ year: 1, branch: 1 });
studentSchema.index({ semester: 1 });
studentSchema.index({ 'status.isActive': 1 });
studentSchema.index({ 'status.accountStatus': 1 });
studentSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
studentSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to calculate pending fees
studentSchema.pre('save', function(next) {
  if (this.isModified('fees.totalFees') || this.isModified('fees.paidAmount')) {
    this.fees.pendingAmount = this.fees.totalFees - this.fees.paidAmount;
  }
  next();
});

// Pre-save middleware to auto-generate roll number
studentSchema.pre('save', function(next) {
  if (!this.academics.rollNumber && this.studentId && this.year) {
    // Format: YEAR + BRANCH_CODE + STUDENT_ID_LAST_4
    const branchCodes = {
      'Computer Science Engineering': 'CSE',
      'Information Technology': 'IT',
      'Electronics and Communication Engineering': 'ECE',
      'Electrical Engineering': 'EE',
      'Mechanical Engineering': 'ME',
      'Civil Engineering': 'CE',
      'Chemical Engineering': 'CHE',
      'Biotechnology': 'BT',
      'Aerospace Engineering': 'AE',
      'Automobile Engineering': 'AUTO',
      'Business Administration': 'MBA',
      'Master of Computer Applications': 'MCA'
    };
    
    const branchCode = branchCodes[this.branch] || 'OTH';
    const lastFourDigits = this.studentId.slice(-4);
    this.academics.rollNumber = `${this.year}${branchCode}${lastFourDigits}`;
  }
  next();
});

// Instance method to check password
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get full name
studentSchema.methods.getFullName = function() {
  let fullName = this.name.firstName;
  if (this.name.middleName) {
    fullName += ` ${this.name.middleName}`;
  }
  fullName += ` ${this.name.lastName}`;
  return fullName;
};

// Instance method to calculate age
studentSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Instance method to add refresh token
studentSchema.methods.addRefreshToken = function(token) {
  this.security.refreshTokens.push({ token });
  
  // Keep only last 5 refresh tokens
  if (this.security.refreshTokens.length > 5) {
    this.security.refreshTokens = this.security.refreshTokens.slice(-5);
  }
  
  return this.save();
};

// Instance method to remove refresh token
studentSchema.methods.removeRefreshToken = function(token) {
  this.security.refreshTokens = this.security.refreshTokens.filter(rt => rt.token !== token);
  return this.save();
};

// Static method to find student by student ID with password
studentSchema.statics.findByStudentIdWithPassword = function(studentId) {
  return this.findOne({ studentId }).select('+password');
};

// Static method to find students by branch and year
studentSchema.statics.findByBranchAndYear = function(branch, year) {
  return this.find({ branch, year, 'status.isActive': true });
};

// Static method to find active students
studentSchema.statics.findActiveStudents = function() {
  return this.find({ 'status.isActive': true });
};

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return this.getFullName();
});

// Virtual for age
studentSchema.virtual('age').get(function() {
  return this.getAge();
});

// Transform output to remove sensitive fields
studentSchema.methods.toJSON = function() {
  const studentObject = this.toObject();
  
  delete studentObject.password;
  delete studentObject.security.passwordResetToken;
  delete studentObject.security.passwordResetExpires;
  delete studentObject.security.emailVerificationToken;
  delete studentObject.security.refreshTokens;
  delete studentObject.__v;
  
  return studentObject;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;