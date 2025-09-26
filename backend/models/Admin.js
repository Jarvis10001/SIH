const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Authentication fields
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 8
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
    }
  },

  // Admin Role and Permissions
  role: {
    type: String,
    required: true,
    enum: ['Super Admin', 'Academic Admin', 'HR Admin', 'Finance Admin'],
    default: 'Academic Admin'
  },
  
  permissions: {
    students: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: false }
    },
    teachers: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: false }
    },
    admissions: {
      view: { type: Boolean, default: true },
      approve: { type: Boolean, default: true },
      reject: { type: Boolean, default: true },
      edit: { type: Boolean, default: true }
    },
    payments: {
      view: { type: Boolean, default: true },
      process: { type: Boolean, default: false },
      refund: { type: Boolean, default: false }
    },
    reports: {
      view: { type: Boolean, default: true },
      generate: { type: Boolean, default: true },
      export: { type: Boolean, default: true }
    },
    system: {
      settings: { type: Boolean, default: false },
      users: { type: Boolean, default: false },
      backup: { type: Boolean, default: false }
    }
  },

  // System Information
  systemInfo: {
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
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
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    sessionId: String,
    ipAddress: String,
    userAgent: String
  },

  // Activity Tracking
  activityLog: [{
    action: String,
    target: String,
    targetId: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String
  }],

  // Profile
  profile: {
    avatar: String,
    bio: String,
    department: String,
    designation: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
adminSchema.index({ username: 1 });
adminSchema.index({ 'personalInfo.email': 1 });
adminSchema.index({ 'systemInfo.status': 1 });
adminSchema.index({ role: 1 });

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Instance methods
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.incrementLoginAttempts = function() {
  this.systemInfo.loginAttempts += 1;
  if (this.systemInfo.loginAttempts >= 5) {
    this.systemInfo.accountLocked = true;
  }
  return this.save();
};

adminSchema.methods.resetLoginAttempts = function() {
  this.systemInfo.loginAttempts = 0;
  this.systemInfo.accountLocked = false;
  this.systemInfo.lastLogin = new Date();
  return this.save();
};

adminSchema.methods.isAccountLocked = function() {
  return this.systemInfo.accountLocked;
};

adminSchema.methods.isActive = function() {
  return this.systemInfo.status === 'Active';
};

adminSchema.methods.hasPermission = function(module, action) {
  return this.permissions[module] && this.permissions[module][action];
};

adminSchema.methods.logActivity = function(action, target, targetId, details, ipAddress) {
  this.activityLog.push({
    action,
    target,
    targetId,
    details,
    ipAddress
  });
  
  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }
  
  return this.save();
};

// Static methods
adminSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

adminSchema.statics.createDefaultAdmin = async function() {
  const adminExists = await this.findOne({ role: 'Super Admin' });
  
  if (!adminExists) {
    const defaultAdmin = new this({
      username: 'admin',
      password: 'Admin@123',
      personalInfo: {
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@collegeerp.com',
        phone: '9999999999'
      },
      role: 'Super Admin',
      permissions: {
        students: { view: true, create: true, edit: true, delete: true },
        teachers: { view: true, create: true, edit: true, delete: true },
        admissions: { view: true, approve: true, reject: true, edit: true },
        payments: { view: true, process: true, refund: true },
        reports: { view: true, generate: true, export: true },
        system: { settings: true, users: true, backup: true }
      },
      profile: {
        bio: 'System Administrator with full access to all modules',
        department: 'IT Administration',
        designation: 'System Administrator'
      }
    });
    
    await defaultAdmin.save();
    console.log('✅ Default admin created successfully');
    console.log('📧 Username: admin');
    console.log('🔑 Password: Admin@123');
    
    return defaultAdmin;
  }
  
  return adminExists;
};

module.exports = mongoose.model('Admin', adminSchema);