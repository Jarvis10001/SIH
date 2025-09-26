const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  // Authentication fields
  teacherId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Personal Information
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/
    },
    alternatePhone: {
      type: String,
      match: /^[6-9]\d{9}$/
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other']
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    aadharNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
      match: /^\d{12}$/
    },
    panNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
      uppercase: true,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    }
  },

  // Address Information
  address: {
    currentAddress: {
      street: String,
      city: String,
      state: String,
      pincode: {
        type: String,
        match: /^\d{6}$/
      },
      country: {
        type: String,
        default: 'India'
      }
    },
    permanentAddress: {
      street: String,
      city: String,
      state: String,
      pincode: {
        type: String,
        match: /^\d{6}$/
      },
      country: {
        type: String,
        default: 'India'
      }
    },
    isSameAddress: {
      type: Boolean,
      default: false
    }
  },

  // Professional Information
  professionalInfo: {
    employeeId: {
      type: String,
      unique: true,
      uppercase: true
    },
    designation: {
      type: String,
      required: true,
      enum: [
        'Professor',
        'Associate Professor', 
        'Assistant Professor',
        'Lecturer',
        'Senior Lecturer',
        'Guest Faculty',
        'Lab Assistant',
        'HOD'
      ]
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Computer Science Engineering',
        'Electronics and Communication Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Information Technology',
        'Chemical Engineering',
        'Biotechnology',
        'Mathematics',
        'Physics',
        'Chemistry',
        'English',
        'Management Studies'
      ]
    },
    specialization: {
      type: String,
      required: true
    },
    qualification: {
      type: String,
      required: true,
      enum: ['PhD', 'M.Tech', 'M.E', 'M.Sc', 'MBA', 'B.Tech', 'B.E', 'B.Sc', 'Other']
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    joiningDate: {
      type: Date,
      required: true
    },
    employmentType: {
      type: String,
      required: true,
      enum: ['Permanent', 'Contract', 'Part-time', 'Guest']
    },
    salary: {
      basic: {
        type: Number,
        required: true
      },
      allowances: {
        type: Number,
        default: 0
      },
      total: {
        type: Number
      }
    }
  },

  // Academic Information
  academicInfo: {
    subjects: [{
      name: String,
      code: String,
      semester: Number,
      branch: String,
      credits: Number
    }],
    researchAreas: [String],
    publications: [{
      title: String,
      journal: String,
      year: Number,
      coAuthors: [String],
      doi: String
    }],
    projects: [{
      title: String,
      fundingAgency: String,
      amount: Number,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Proposed']
      }
    }]
  },

  // System Information
  systemInfo: {
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended', 'On Leave'],
      default: 'Active'
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    accountLocked: {
      type: Boolean,
      default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },

  // Documents
  documents: {
    profilePhoto: {
      filename: String,
      originalName: String,
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    resume: {
      filename: String,
      originalName: String,
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    certificates: [{
      type: String, // 'degree', 'experience', 'achievement'
      title: String,
      filename: String,
      originalName: String,
      url: String,
      publicId: String,
      uploadedAt: Date
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ 'personalInfo.email': 1 });
teacherSchema.index({ 'professionalInfo.employeeId': 1 });
teacherSchema.index({ 'professionalInfo.department': 1 });
teacherSchema.index({ 'systemInfo.status': 1 });

// Virtual for full name
teacherSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for age
teacherSchema.virtual('age').get(function() {
  if (this.personalInfo.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.personalInfo.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Pre-save middleware to hash password
teacherSchema.pre('save', async function(next) {
  // Hash password if it's modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Calculate total salary
  if (this.isModified('professionalInfo.salary')) {
    this.professionalInfo.salary.total = 
      this.professionalInfo.salary.basic + this.professionalInfo.salary.allowances;
  }

  // Copy current address to permanent if same address
  if (this.address.isSameAddress) {
    this.address.permanentAddress = { ...this.address.currentAddress };
  }

  next();
});

// Pre-save middleware to generate teacherId and employeeId
teacherSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate teacherId if not provided
    if (!this.teacherId) {
      const year = new Date().getFullYear();
      const dept = this.professionalInfo.department.substring(0, 3).toUpperCase();
      const count = await this.constructor.countDocuments() + 1;
      this.teacherId = `TCH${year}${dept}${count.toString().padStart(3, '0')}`;
    }

    // Generate employeeId if not provided
    if (!this.professionalInfo.employeeId) {
      const year = new Date().getFullYear();
      const count = await this.constructor.countDocuments() + 1;
      this.professionalInfo.employeeId = `EMP${year}${count.toString().padStart(4, '0')}`;
    }
  }
  next();
});

// Instance methods
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

teacherSchema.methods.incrementLoginAttempts = function() {
  this.systemInfo.loginAttempts += 1;
  if (this.systemInfo.loginAttempts >= 5) {
    this.systemInfo.accountLocked = true;
  }
  return this.save();
};

teacherSchema.methods.resetLoginAttempts = function() {
  this.systemInfo.loginAttempts = 0;
  this.systemInfo.accountLocked = false;
  this.systemInfo.lastLogin = new Date();
  return this.save();
};

teacherSchema.methods.isAccountLocked = function() {
  return this.systemInfo.accountLocked;
};

teacherSchema.methods.isActive = function() {
  return this.systemInfo.status === 'Active';
};

teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to hash password
teacherSchema.pre('save', async function(next) {
  // Hash password if it's modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Calculate total salary
  if (this.isModified('professionalInfo.salary')) {
    this.professionalInfo.salary.total = 
      this.professionalInfo.salary.basic + this.professionalInfo.salary.allowances;
  }

  // Copy current address to permanent if same address
  if (this.address.isSameAddress) {
    this.address.permanentAddress = { ...this.address.currentAddress };
  }

  next();
});

// Static methods
teacherSchema.statics.findByTeacherId = function(teacherId) {
  return this.findOne({ teacherId: teacherId.toUpperCase() });
};

teacherSchema.statics.findByDepartment = function(department) {
  return this.find({ 'professionalInfo.department': department });
};

teacherSchema.statics.getTeacherStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$professionalInfo.department',
        count: { $sum: 1 },
        avgExperience: { $avg: '$professionalInfo.experience' },
        avgSalary: { $avg: '$professionalInfo.salary.total' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  const statusStats = await this.aggregate([
    {
      $group: {
        _id: '$systemInfo.status',
        count: { $sum: 1 }
      }
    }
  ]);

  return { departmentStats: stats, statusStats };
};

module.exports = mongoose.model('Teacher', teacherSchema);