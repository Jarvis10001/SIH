const Attendance = require('../models/Attendance');
const Teacher = require('../models/Teacher');
const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.match(/\.(xlsx|xls|csv)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload Excel (.xlsx, .xls) or CSV files only.'), false);
    }
  }
});

// @desc    Upload attendance from Excel/CSV file
// @route   POST /api/attendance/upload
// @access  Private (Teacher only)
const uploadAttendance = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { 
      subject, 
      subjectCode, 
      className, 
      section, 
      semester, 
      academicYear,
      date,
      startTime,
      endTime 
    } = req.body;

    // Validate required fields
    if (!subject || !subjectCode || !className || !section || !semester || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required class information'
      });
    }

    // Get teacher information
    const teacher = await Teacher.findById(req.user.id).select('teacherId personalInfo.firstName personalInfo.lastName');
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Parse Excel/CSV file
    let jsonData = [];
    let extractedDate = null;
    
    try {
      if (req.file.mimetype.includes('csv')) {
        // Handle CSV files
        const csvData = req.file.buffer.toString('utf8');
        const lines = csvData.split('\n');
        
        // Try to extract date from first row
        const firstLine = lines[0].trim();
        const dateMatch = firstLine.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/);
        if (dateMatch) {
          extractedDate = dateMatch[0];
        }
        
        // Process attendance data starting from row that contains SID
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= 2 && values[0]) {
              jsonData.push({
                SID: values[0],
                status: values[1] || 'Absent'
              });
            }
          }
        }
      } else {
        // Handle Excel files
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get the range of the worksheet
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        
        // Try to extract date from the first few cells
        for (let row = range.s.r; row <= Math.min(range.s.r + 2, range.e.r); row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            if (cell && cell.v) {
              const cellValue = cell.v.toString();
              const dateMatch = cellValue.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/);
              if (dateMatch) {
                extractedDate = dateMatch[0];
                break;
              }
            }
          }
          if (extractedDate) break;
        }
        
        // Find the starting row for SID data (look for "SID" or similar)
        let dataStartRow = 1; // Default to row 1 if not found
        for (let row = range.s.r; row <= Math.min(range.s.r + 5, range.e.r); row++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
          const cell = worksheet[cellAddress];
          if (cell && cell.v && cell.v.toString().toLowerCase().includes('sid')) {
            dataStartRow = row + 1;
            break;
          }
        }
        
        // Extract SID and attendance data
        for (let row = dataStartRow; row <= range.e.r; row++) {
          const sidCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 0 })];
          const statusCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 1 })];
          
          if (sidCell && sidCell.v) {
            const sid = sidCell.v.toString().trim();
            const status = statusCell && statusCell.v ? statusCell.v.toString().trim() : 'Absent';
            
            if (sid) {
              jsonData.push({
                SID: sid,
                status: status
              });
            }
          }
        }
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Error parsing file. Please check file format.',
        error: error.message
      });
    }

    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No data found in the uploaded file'
      });
    }

    // Use extracted date if available, otherwise use provided date
    const attendanceDate = extractedDate ? new Date(extractedDate) : (date ? new Date(date) : new Date());

    // Process attendance data
    const studentAttendance = [];
    const errors = [];

    jsonData.forEach((row, index) => {
      try {
        // Get SID and status from the simplified format
        const studentId = row.SID || row.sid || row.StudentID || row.student_id || '';
        const status = row.status || row.Status || row.attendance || row.Attendance || 'Absent';

        // Validate required fields
        if (!studentId) {
          errors.push(`Row ${index + 2}: Missing Student ID (SID)`);
          return;
        }

        // Validate status
        const validStatuses = ['Present', 'Absent', 'Late', 'Excused'];
        let normalizedStatus = status.toString().trim();
        
        // Handle common status variations
        if (['P', 'Present', 'present', '1', 'YES', 'Yes', 'yes', 'Y', 'y'].includes(normalizedStatus)) {
          normalizedStatus = 'Present';
        } else if (['A', 'Absent', 'absent', '0', 'NO', 'No', 'no', 'N', 'n'].includes(normalizedStatus)) {
          normalizedStatus = 'Absent';
        } else if (['L', 'Late', 'late'].includes(normalizedStatus)) {
          normalizedStatus = 'Late';
        } else if (['E', 'Excused', 'excused'].includes(normalizedStatus)) {
          normalizedStatus = 'Excused';
        } else {
          normalizedStatus = 'Absent'; // Default to absent for invalid status
        }

        studentAttendance.push({
          studentId: studentId.toString().trim(),
          studentName: `Student ${studentId}`, // Default name since not provided
          rollNumber: studentId.toString().trim(), // Use SID as roll number
          status: normalizedStatus,
          remarks: ''
        });

      } catch (error) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errors found in attendance data',
        errors: errors,
        processedRecords: studentAttendance.length,
        totalRecords: jsonData.length
      });
    }

    if (studentAttendance.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid attendance records found'
      });
    }

    // Check if attendance already exists for this class on this date
    const existingAttendance = await Attendance.findOne({
      'classInfo.subject': subject,
      'classInfo.section': section,
      'classInfo.semester': semester,
      'teacherInfo.teacherId': teacher.teacherId,
      date: {
        $gte: new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate()),
        $lt: new Date(attendanceDate.getFullYear(), attendanceDate.getMonth(), attendanceDate.getDate() + 1)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already exists for this class on the selected date'
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      classInfo: {
        subject,
        subjectCode,
        className,
        section,
        semester: parseInt(semester),
        academicYear
      },
      date: attendanceDate,
      timeSlot: {
        startTime: startTime || '09:00',
        endTime: endTime || '10:00'
      },
      teacherInfo: {
        teacherId: teacher.teacherId,
        teacherName: `${teacher.personalInfo.firstName} ${teacher.personalInfo.lastName}`
      },
      studentAttendance,
      uploadInfo: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        originalData: jsonData
      }
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance uploaded successfully',
      data: {
        attendanceId: attendance._id,
        totalStudents: attendance.statistics.totalStudents,
        presentCount: attendance.statistics.presentCount,
        absentCount: attendance.statistics.absentCount,
        attendancePercentage: attendance.statistics.attendancePercentage,
        date: attendance.date,
        classInfo: attendance.classInfo
      }
    });

  } catch (error) {
    console.error('Upload attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading attendance',
      error: error.message
    });
  }
};

// @desc    Get attendance records for a teacher
// @route   GET /api/attendance/teacher
// @access  Private (Teacher only)
const getTeacherAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const { startDate, endDate, subject, section } = req.query;
    const teacher = await Teacher.findById(req.user.id).select('teacherId');

    let query = {
      'teacherInfo.teacherId': teacher.teacherId,
      isActive: true
    };

    // Add date filter if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Add subject filter if provided
    if (subject) {
      query['classInfo.subject'] = subject;
    }

    // Add section filter if provided
    if (section) {
      query['classInfo.section'] = section;
    }

    const attendanceRecords = await Attendance.find(query)
      .sort({ date: -1 })
      .select('-uploadInfo.originalData'); // Exclude original file data for performance

    res.json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords
    });

  } catch (error) {
    console.error('Get teacher attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
};

// @desc    Get attendance record by ID
// @route   GET /api/attendance/:id
// @access  Private (Teacher only)
const getAttendanceById = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      data: attendance
    });

  } catch (error) {
    console.error('Get attendance by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Teacher only)
const updateAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const { studentAttendance, timeSlot, remarks } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Update fields if provided
    if (studentAttendance) {
      attendance.studentAttendance = studentAttendance;
    }

    if (timeSlot) {
      attendance.timeSlot = timeSlot;
    }

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating attendance'
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Teacher only)
const deleteAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Soft delete - mark as inactive
    attendance.isActive = false;
    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance deleted successfully'
    });

  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting attendance'
    });
  }
};

// @desc    Get student attendance records
// @route   GET /api/attendance/student/:studentId
// @access  Private (Student only)
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear, semester, subject } = req.query;

    // Authorization check: Students can only access their own attendance
    if (req.user.role === 'student' && req.user.studentId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own attendance records.'
      });
    }

    let query = {
      'studentAttendance.studentId': studentId,
      isActive: true
    };

    if (academicYear) {
      query['classInfo.academicYear'] = academicYear;
    }

    if (semester) {
      query['classInfo.semester'] = parseInt(semester);
    }

    if (subject) {
      query['classInfo.subject'] = subject;
    }

    const attendanceRecords = await Attendance.find(query)
      .select('classInfo date timeSlot teacherInfo studentAttendance statistics')
      .sort({ date: -1 });

    // Filter student-specific records
    const studentRecords = attendanceRecords.map(record => {
      const studentRecord = record.studentAttendance.find(s => s.studentId === studentId);
      return {
        _id: record._id,
        classInfo: record.classInfo,
        date: record.date,
        timeSlot: record.timeSlot,
        teacherInfo: record.teacherInfo,
        attendance: studentRecord,
        classStatistics: record.statistics
      };
    });

    res.json({
      success: true,
      count: studentRecords.length,
      data: studentRecords
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student attendance'
    });
  }
};

// @desc    Download attendance template
// @route   GET /api/attendance/template
// @access  Public
const downloadTemplate = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const csvContent = `# Student Attendance Template
# Instructions:
# 1. Fill in your class information below (optional header info)
# 2. Update the SID and Status columns with your student data
# 3. Status options: Present, Absent, Late, Excused (or P/A/L/E)
# 4. Save as CSV and upload through the Teacher Dashboard

Date: ${today}
Class: [Your Subject] - Section [A/B/C] - Semester [1-8]
Teacher: [Your Name] ([Your Teacher ID])

SID,Status
STU001,Present
STU002,Absent
STU003,Present
STU004,Late
STU005,Excused
STU006,Present
STU007,Absent
STU008,Late
STU009,Present
STU010,Excused`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_template_${today}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Download template error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating template'
    });
  }
};

module.exports = {
  upload,
  uploadAttendance,
  getTeacherAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
  downloadTemplate
};