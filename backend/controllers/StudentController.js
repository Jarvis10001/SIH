const Student = require('../models/Student');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

// GET /api/students - Get all students with filtering, pagination, and search
const getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      year,
      branch,
      semester,
      accountStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { 'status.isActive': true };
    
    if (year) filter.year = parseInt(year);
    if (branch) filter.branch = branch;
    if (semester) filter.semester = parseInt(semester);
    if (accountStatus) filter['status.accountStatus'] = accountStatus;
    
    if (search) {
      filter.$or = [
        { 'name.firstName': { $regex: search, $options: 'i' } },
        { 'name.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { 'academics.rollNumber': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const students = await Student.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -security.refreshTokens');

    const total = await Student.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalStudents: total,
        limit: parseInt(limit)
      },
      filters: {
        year,
        branch,
        semester,
        accountStatus,
        search
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving students',
      error: error.message
    });
  }
};

// GET /api/students/:id - Get student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findById(id).select('-password -security.refreshTokens');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error retrieving student',
      error: error.message
    });
  }
};

// GET /api/students/student-id/:studentId - Get student by Student ID
const getStudentByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findOne({ studentId }).select('-password -security.refreshTokens');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving student',
      error: error.message
    });
  }
};

// POST /api/students/register - Register new student
const registerStudent = async (req, res) => {
  try {
    const studentData = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [
        { email: studentData.email },
        { studentId: studentData.studentId }
      ]
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Student with this email or student ID already exists'
      });
    }

    // Create new student
    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student.toJSON()
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `A student with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

// POST /api/students/login - Student login
const loginStudent = async (req, res) => {
  try {
    const { studentId, email, password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    if (!studentId && !email) {
      return res.status(400).json({
        success: false,
        message: 'Either student ID or email is required'
      });
    }

    // Find student
    let query = {};
    if (studentId) query.studentId = studentId;
    if (email) query.email = email;

    const student = await Student.findOne(query).select('+password');
    
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if student account is active
    if (!student.status.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    if (student.status.accountStatus !== 'Active') {
      return res.status(401).json({
        success: false,
        message: `Account is ${student.status.accountStatus.toLowerCase()}. Please contact administrator.`
      });
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    student.security.lastLogin = new Date();
    await student.save();

    // Generate tokens
    const token = generateToken({ 
      id: student._id, 
      studentId: student.studentId,
      email: student.email, 
      role: 'student',
      year: student.year,
      branch: student.branch
    });
    
    const refreshToken = generateRefreshToken({ 
      id: student._id, 
      studentId: student.studentId,
      email: student.email 
    });

    // Save refresh token
    await student.addRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        student: student.toJSON(),
        token,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// PUT /api/students/:id - Update student information
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, studentId, email, ...updateData } = req.body;

    // Don't allow updating password, studentId, or email through this endpoint
    if (password || studentId || email) {
      return res.status(400).json({
        success: false,
        message: 'Use dedicated endpoints to change password, student ID, or email'
      });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password -security.refreshTokens');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// PUT /api/students/:id/change-password - Change student password
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const student = await Student.findById(id).select('+password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await student.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    student.password = newPassword;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// PUT /api/students/:id/status - Update student status
const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus, isActive, graduationDate } = req.body;

    const updateData = {};
    if (accountStatus !== undefined) updateData['status.accountStatus'] = accountStatus;
    if (isActive !== undefined) updateData['status.isActive'] = isActive;
    if (graduationDate !== undefined) {
      updateData['status.graduationDate'] = graduationDate;
      updateData['status.isGraduated'] = true;
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -security.refreshTokens');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student status updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student status',
      error: error.message
    });
  }
};

// GET /api/students/analytics/summary - Get student analytics
const getStudentAnalytics = async (req, res) => {
  try {
    const analytics = await Student.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          byYear: [
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ],
          byBranch: [
            { $group: { _id: "$branch", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byStatus: [
            { $group: { _id: "$status.accountStatus", count: { $sum: 1 } } }
          ],
          byGender: [
            { $group: { _id: "$personalInfo.gender", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    const result = analytics[0];

    res.status(200).json({
      success: true,
      message: 'Student analytics retrieved successfully',
      data: {
        totalStudents: result.totalCount[0]?.count || 0,
        distributionByYear: result.byYear,
        distributionByBranch: result.byBranch,
        distributionByStatus: result.byStatus,
        distributionByGender: result.byGender
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving student analytics',
      error: error.message
    });
  }
};

// POST /api/students/logout - Student logout
const logoutStudent = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove specific refresh token or all tokens
    if (refreshToken) {
      await student.removeRefreshToken(refreshToken);
    } else {
      student.security.refreshTokens = [];
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByStudentId,
  registerStudent,
  loginStudent,
  updateStudent,
  changePassword,
  updateStudentStatus,
  getStudentAnalytics,
  logoutStudent
};