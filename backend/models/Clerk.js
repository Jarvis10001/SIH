const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');

const ClerkSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },

  // Professional Information
  professionalInfo: {
    designation: {
      type: String,
      required: true,
      enum: [
        'Office Clerk',
        'Administrative Assistant', 
        'Data Entry Clerk',
        'Admission Clerk',
        'Accounts Clerk',
        'Library Assistant',
        'Reception Clerk',
        'Senior Clerk',
        'Office Supervisor'
      ]
    },
    department: {
      type: String,
      required: true,
      enum: [
        'Administration',
        'Admissions',
        'Accounts',
        'Library',
        'Student Affairs',
        'Examination',
        'HR',
        'IT Support',
        'Maintenance'
      ]
    },
    joiningDate: {
      type: Date,
      required: true
    },
    experience: {
      type: Number, // in years
      min: 0
    },
    reportingTo: {
      type: String // employee ID of supervisor
    },
    workShift: {
      type: String,
      enum: ['Morning', 'Evening', 'Night', 'Rotating'],
      default: 'Morning'
    },
    salary: {
      basic: Number,
      allowances: Number,
      total: Number
    }
  },

  // System Access & Permissions
  systemAccess: {
    modules: [{
      type: String,
      enum: [
        'student_management',
        'admission_processing', 
        'fee_collection',
        'library_management',
        'examination_records',
        'attendance_tracking',
        'document_verification',
        'report_generation'
      ]
    }],
    accessLevel: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    }
  },

  // Authentication
  password: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },

  // Status & Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date
  },

  profilePicture: {
    url: String,
    publicId: String
  },

  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
ClerkSchema.index({ employeeId: 1 });
ClerkSchema.index({ 'personalInfo.email': 1 });
ClerkSchema.index({ 'professionalInfo.department': 1 });
ClerkSchema.index({ isActive: 1 });

// Add pagination plugin
ClerkSchema.plugin(mongoosePaginate);

// Hash password before saving
ClerkSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
ClerkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
ClerkSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get full name
ClerkSchema.methods.getFullName = function() {
  return this.personalInfo.fullName;
};

// Instance method to check if clerk has specific module access
ClerkSchema.methods.hasModuleAccess = function(module) {
  return this.systemAccess.modules.includes(module);
};

// Static method to find by employee ID
ClerkSchema.statics.findByEmployeeId = function(employeeId) {
  return this.findOne({ employeeId });
};

// Static method to find active clerks
ClerkSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find by department
ClerkSchema.statics.findByDepartment = function(department) {
  return this.find({ 
    'professionalInfo.department': department,
    isActive: true 
  });
};

// Virtual for clerk's experience display
ClerkSchema.virtual('experienceDisplay').get(function() {
  const exp = this.professionalInfo.experience;
  if (!exp) return 'Fresher';
  return exp === 1 ? '1 year' : `${exp} years`;
});

// Transform function to remove sensitive data
ClerkSchema.methods.toJSON = function() {
  const clerkObject = this.toObject();
  delete clerkObject.password;
  return clerkObject;
};

const Clerk = mongoose.model('Clerk', ClerkSchema);

module.exports = Clerk;