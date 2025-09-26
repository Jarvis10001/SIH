const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // Class Information
  classInfo: {
    subject: {
      type: String,
      required: true,
      trim: true
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    className: {
      type: String,
      required: true,
      trim: true
    },
    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    academicYear: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/
    }
  },

  // Date and Time Information
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    }
  },

  // Teacher Information
  teacherInfo: {
    teacherId: {
      type: String,
      required: true,
      ref: 'Teacher'
    },
    teacherName: {
      type: String,
      required: true
    }
  },

  // Student Attendance Records
  studentAttendance: [{
    studentId: {
      type: String,
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    rollNumber: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      default: 'Absent'
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],

  // Attendance Statistics
  statistics: {
    totalStudents: {
      type: Number,
      required: true,
      default: 0
    },
    presentCount: {
      type: Number,
      required: true,
      default: 0
    },
    absentCount: {
      type: Number,
      required: true,
      default: 0
    },
    lateCount: {
      type: Number,
      default: 0
    },
    excusedCount: {
      type: Number,
      default: 0
    },
    attendancePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },

  // Upload Information
  uploadInfo: {
    fileName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    fileSize: Number,
    originalData: [{
      type: mongoose.Schema.Types.Mixed
    }]
  },

  // System Information
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
attendanceSchema.index({ 'classInfo.subject': 1, 'classInfo.section': 1, date: -1 });
attendanceSchema.index({ 'teacherInfo.teacherId': 1, date: -1 });
attendanceSchema.index({ 'studentAttendance.studentId': 1, date: -1 });
attendanceSchema.index({ 'classInfo.academicYear': 1, 'classInfo.semester': 1 });

// Pre-save middleware to calculate statistics
attendanceSchema.pre('save', function(next) {
  if (this.studentAttendance && this.studentAttendance.length > 0) {
    this.statistics.totalStudents = this.studentAttendance.length;
    this.statistics.presentCount = this.studentAttendance.filter(s => s.status === 'Present').length;
    this.statistics.absentCount = this.studentAttendance.filter(s => s.status === 'Absent').length;
    this.statistics.lateCount = this.studentAttendance.filter(s => s.status === 'Late').length;
    this.statistics.excusedCount = this.studentAttendance.filter(s => s.status === 'Excused').length;
    
    // Calculate attendance percentage
    const presentAndLate = this.statistics.presentCount + this.statistics.lateCount;
    this.statistics.attendancePercentage = this.statistics.totalStudents > 0 
      ? Math.round((presentAndLate / this.statistics.totalStudents) * 100) 
      : 0;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Static methods
attendanceSchema.statics.getStudentAttendance = async function(studentId, academicYear, semester) {
  return this.find({
    'studentAttendance.studentId': studentId,
    'classInfo.academicYear': academicYear,
    'classInfo.semester': semester,
    isActive: true
  }).select('classInfo date timeSlot teacherInfo studentAttendance.$ statistics')
    .sort({ date: -1 });
};

attendanceSchema.statics.getClassAttendance = async function(classInfo, startDate, endDate) {
  const query = {
    'classInfo.subject': classInfo.subject,
    'classInfo.section': classInfo.section,
    'classInfo.semester': classInfo.semester,
    isActive: true
  };
  
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  return this.find(query).sort({ date: -1 });
};

attendanceSchema.statics.getTeacherAttendance = async function(teacherId, startDate, endDate) {
  const query = {
    'teacherInfo.teacherId': teacherId,
    isActive: true
  };
  
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  
  return this.find(query).sort({ date: -1 });
};

// Instance methods
attendanceSchema.methods.getAttendancePercentage = function() {
  return this.statistics.attendancePercentage;
};

attendanceSchema.methods.getStudentRecord = function(studentId) {
  return this.studentAttendance.find(record => record.studentId === studentId);
};

module.exports = mongoose.model('Attendance', attendanceSchema);