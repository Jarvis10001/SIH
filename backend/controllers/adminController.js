const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Clerk = require('../models/Clerk');
const { generateToken } = require('../utils/jwt');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: admin._id,
        role: 'admin',
        username: admin.username
      }
    };

    // Generate JWT token using utility function with proper issuer/audience
    const token = generateToken(payload, '24h');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private (Admin only)
const getAllTeachers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const teachers = await Teacher.find({}).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: teachers.length,
      teachers
    });

  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teachers'
    });
  }
};

// @desc    Get teacher by ID
// @route   GET /api/admin/teachers/:id
// @access  Private (Admin only)
const getTeacherById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const teacher = await Teacher.findById(req.params.id).select('-password');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      teacher
    });

  } catch (error) {
    console.error('Get teacher by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teacher'
    });
  }
};

// @desc    Create new teacher
// @route   POST /api/admin/teachers
// @access  Private (Admin only)
const createTeacher = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const {
      teacherId,
      personalInfo,
      professionalInfo,
      academicInfo,
      password
    } = req.body;

    console.log('[2025-09-17T19:41:16.544Z] Request Body:', {
      teacherId,
      personalInfo,
      professionalInfo,
      academicInfo
    });

    // Validation
    if (!teacherId || !personalInfo?.fullName || !personalInfo?.email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: teacherId, fullName, email, and password'
      });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({
      $or: [
        { teacherId },
        { 'personalInfo.email': personalInfo.email }
      ]
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this teacher ID or email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new teacher
    const teacher = new Teacher({
      teacherId,
      personalInfo,
      professionalInfo,
      academicInfo,
      password: hashedPassword,
      systemInfo: {
        status: 'Active',
        createdBy: req.user.id
      }
    });

    await teacher.save();

    // Remove password from response
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher: teacherResponse
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating teacher'
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/admin/teachers/:id
// @access  Private (Admin only)
const updateTeacher = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const {
      personalInfo,
      professionalInfo,
      academicInfo,
      isActive
    } = req.body;

    // Find teacher
    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Update fields if provided
    if (personalInfo) {
      teacher.personalInfo = { ...teacher.personalInfo, ...personalInfo };
    }

    if (professionalInfo) {
      teacher.professionalInfo = { ...teacher.professionalInfo, ...professionalInfo };
    }

    if (academicInfo) {
      teacher.academicInfo = { ...teacher.academicInfo, ...academicInfo };
    }

    if (typeof isActive === 'boolean') {
      teacher.isActive = isActive;
    }

    teacher.updatedAt = Date.now();
    await teacher.save();

    // Remove password from response
    const updatedTeacher = teacher.toObject();
    delete updatedTeacher.password;

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: updatedTeacher
    });

  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating teacher'
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/admin/teachers/:id
// @access  Private (Admin only)
const deleteTeacher = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    await Teacher.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });

  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting teacher'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Get actual counts
    const totalTeachers = await Teacher.countDocuments({});
    const activeTeachers = await Teacher.countDocuments({ isActive: true });
    const inactiveTeachers = totalTeachers - activeTeachers;

    // Mock data for other stats - in a real app, you'd get these from actual models
    const stats = {
      totalTeachers,
      activeTeachers,
      inactiveTeachers,
      totalStudents: Math.floor(Math.random() * 1000) + 500,
      pendingApplications: Math.floor(Math.random() * 50) + 10,
      monthlyRevenue: Math.floor(Math.random() * 100000) + 50000
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};

// ============ CLERK MANAGEMENT FUNCTIONS ============

// @desc    Get all clerks
// @route   GET /api/admin/clerks
// @access  Private (Admin only)
const getAllClerks = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const clerks = await Clerk.find({}).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: clerks.length,
      clerks
    });

  } catch (error) {
    console.error('Get all clerks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching clerks'
    });
  }
};

// @desc    Get clerk by ID
// @route   GET /api/admin/clerks/:id
// @access  Private (Admin only)
const getClerkById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const clerk = await Clerk.findById(req.params.id).select('-password');
    
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
    console.error('Get clerk by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching clerk'
    });
  }
};

// @desc    Create new clerk
// @route   POST /api/admin/clerks
// @access  Private (Admin only)
const createClerk = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const {
      employeeId,
      personalInfo,
      professionalInfo,
      systemAccess,
      password
    } = req.body;

    // Validation
    if (!employeeId || !personalInfo?.fullName || !personalInfo?.email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: employeeId, fullName, email, and password'
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

    // Create new clerk
    const clerk = new Clerk({
      employeeId,
      personalInfo,
      professionalInfo,
      systemAccess,
      password,
      isActive: true,
      createdBy: req.user.id
    });

    await clerk.save();

    // Remove password from response
    const clerkResponse = clerk.toObject();
    delete clerkResponse.password;

    res.status(201).json({
      success: true,
      message: 'Clerk created successfully',
      clerk: clerkResponse
    });

  } catch (error) {
    console.error('Create clerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating clerk'
    });
  }
};

// @desc    Update clerk
// @route   PUT /api/admin/clerks/:id
// @access  Private (Admin only)
const updateClerk = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const {
      personalInfo,
      professionalInfo,
      systemAccess,
      isActive
    } = req.body;

    // Find clerk
    let clerk = await Clerk.findById(req.params.id);
    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    // Update fields if provided
    if (personalInfo) {
      clerk.personalInfo = { ...clerk.personalInfo, ...personalInfo };
    }

    if (professionalInfo) {
      clerk.professionalInfo = { ...clerk.professionalInfo, ...professionalInfo };
    }

    if (systemAccess) {
      clerk.systemAccess = { ...clerk.systemAccess, ...systemAccess };
    }

    if (typeof isActive === 'boolean') {
      clerk.isActive = isActive;
    }

    clerk.updatedAt = Date.now();
    await clerk.save();

    // Remove password from response
    const updatedClerk = clerk.toObject();
    delete updatedClerk.password;

    res.json({
      success: true,
      message: 'Clerk updated successfully',
      clerk: updatedClerk
    });

  } catch (error) {
    console.error('Update clerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating clerk'
    });
  }
};

// @desc    Delete clerk
// @route   DELETE /api/admin/clerks/:id
// @access  Private (Admin only)
const deleteClerk = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const clerk = await Clerk.findById(req.params.id);
    
    if (!clerk) {
      return res.status(404).json({
        success: false,
        message: 'Clerk not found'
      });
    }

    await Clerk.findByIdAndDelete(req.params.id);

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

module.exports = {
  loginAdmin,
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getDashboardStats,
  // Clerk management functions
  getAllClerks,
  getClerkById,
  createClerk,
  updateClerk,
  deleteClerk
};