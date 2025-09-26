const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt');
const Teacher = require('../models/Teacher');

// @desc    Teacher login
// @route   POST /api/teacher/login
// @access  Public
const loginTeacher = async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    // Validation
    if (!teacherId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide teacher ID and password'
      });
    }

    // Check if teacher exists
    const teacher = await Teacher.findByTeacherId(teacherId).select('+password');
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if teacher is active
    if (!teacher.isActive()) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administration.'
      });
    }

    // Validate password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: teacher._id,
        role: 'teacher',
        teacherId: teacher.teacherId,
        email: teacher.personalInfo.email
      }
    };

    // Generate JWT token
    const token = generateToken(payload, '24h');

    // Remove password from response
    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      teacher: teacherData
    });

  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get teacher profile
// @route   GET /api/teacher/profile
// @access  Private
const getTeacherProfile = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const teacher = await Teacher.findById(req.user.id).select('-password');
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
    console.error('Get teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update teacher profile
// @route   PUT /api/teacher/profile
// @access  Private
const updateTeacherProfile = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const {
      personalInfo,
      professionalInfo,
      academicInfo
    } = req.body;

    // Find teacher
    let teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Update fields if provided
    if (personalInfo) {
      if (personalInfo.fullName) teacher.personalInfo.fullName = personalInfo.fullName;
      if (personalInfo.email) teacher.personalInfo.email = personalInfo.email;
      if (personalInfo.phone) teacher.personalInfo.phone = personalInfo.phone;
      if (personalInfo.dateOfBirth) teacher.personalInfo.dateOfBirth = personalInfo.dateOfBirth;
      if (personalInfo.address) teacher.personalInfo.address = personalInfo.address;
    }

    if (professionalInfo) {
      if (professionalInfo.designation) teacher.professionalInfo.designation = professionalInfo.designation;
      if (professionalInfo.department) teacher.professionalInfo.department = professionalInfo.department;
      if (professionalInfo.joiningDate) teacher.professionalInfo.joiningDate = professionalInfo.joiningDate;
      if (professionalInfo.experience) teacher.professionalInfo.experience = professionalInfo.experience;
      if (professionalInfo.subjects) teacher.professionalInfo.subjects = professionalInfo.subjects;
    }

    if (academicInfo) {
      if (academicInfo.qualification) teacher.academicInfo.qualification = academicInfo.qualification;
      if (academicInfo.specialization) teacher.academicInfo.specialization = academicInfo.specialization;
      if (academicInfo.researchInterests) teacher.academicInfo.researchInterests = academicInfo.researchInterests;
      if (academicInfo.publications) teacher.academicInfo.publications = academicInfo.publications;
    }

    // Save updated teacher
    teacher.updatedAt = Date.now();
    await teacher.save();

    // Remove password from response
    const updatedTeacher = teacher.toObject();
    delete updatedTeacher.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      teacher: updatedTeacher
    });

  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Get teacher dashboard statistics
// @route   GET /api/teacher/dashboard-stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    // Mock data for now - in a real app, you'd calculate these from actual data
    const stats = {
      totalStudents: Math.floor(Math.random() * 200) + 50,
      activeCourses: Math.floor(Math.random() * 8) + 2,
      pendingReviews: Math.floor(Math.random() * 20) + 5,
      classesToday: Math.floor(Math.random() * 5) + 1,
      weeklyOverview: {
        attendance: Math.floor(Math.random() * 20) + 80,
        assignmentsGraded: Math.floor(Math.random() * 50) + 20,
        newMessages: Math.floor(Math.random() * 15) + 5
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get teacher dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get teacher's today schedule
// @route   GET /api/teacher/schedule
// @access  Private
const getSchedule = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    // Mock schedule data - in a real app, you'd fetch from a Schedule model
    const schedule = [
      {
        id: 1,
        subject: 'Mathematics',
        class: 'Class 12-A',
        time: '09:00 AM - 10:00 AM',
        room: 'Room 201',
        attendance: false
      },
      {
        id: 2,
        subject: 'Physics',
        class: 'Class 11-B',
        time: '11:00 AM - 12:00 PM',
        room: 'Lab 102',
        attendance: false
      },
      {
        id: 3,
        subject: 'Chemistry',
        class: 'Class 12-B',
        time: '02:00 PM - 03:00 PM',
        room: 'Lab 203',
        attendance: true
      }
    ];

    res.json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error('Get teacher schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get teacher's recent activities
// @route   GET /api/teacher/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    // Mock activities data - in a real app, you'd fetch from an Activities model
    const activities = [
      {
        id: 1,
        type: 'assignment',
        message: 'New assignment submitted by John Doe',
        time: '2 hours ago',
        color: 'blue'
      },
      {
        id: 2,
        type: 'grade',
        message: 'Graded 15 assignments for Mathematics',
        time: '4 hours ago',
        color: 'green'
      },
      {
        id: 3,
        type: 'attendance',
        message: 'Marked attendance for Class 12-A',
        time: '1 day ago',
        color: 'purple'
      },
      {
        id: 4,
        type: 'message',
        message: 'New message from parent of Sarah Wilson',
        time: '2 days ago',
        color: 'orange'
      }
    ];

    res.json({
      success: true,
      activities
    });

  } catch (error) {
    console.error('Get teacher activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change teacher password
// @route   POST /api/teacher/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Teacher role required.'
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find teacher with password
    const teacher = await Teacher.findById(req.user.id).select('+password');
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, teacher.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(newPassword, salt);
    teacher.updatedAt = Date.now();

    await teacher.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change teacher password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
};

module.exports = {
  loginTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  getDashboardStats,
  getSchedule,
  getActivities,
  changePassword
};