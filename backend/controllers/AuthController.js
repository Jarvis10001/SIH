const User = require('../models/UserMongo');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

// POST /api/auth/register - Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      role: 'user' // Default role for signup
    };

    const user = new User(userData);
    await user.save();

    // Generate tokens
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    
    const refreshToken = generateRefreshToken({ 
      id: user._id, 
      email: user.email 
    });

    // Save refresh token
    await user.addRefreshToken(refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken,
      user: user.toJSON()
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

    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// POST /api/auth/login - Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user and include password
    const user = await User.findByEmailWithPassword(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    
    const refreshToken = generateRefreshToken({ 
      id: user._id, 
      email: user.email 
    });

    // Save refresh token
    await user.addRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// POST /api/auth/refresh-token - Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Find user with this refresh token
    const user = await User.findOne({
      'refreshTokens.token': refreshToken
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    
    const newRefreshToken = generateRefreshToken({ 
      id: user._id, 
      email: user.email 
    });

    // Remove old refresh token and add new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing token',
      error: error.message
    });
  }
};

// POST /api/auth/logout - Logout user
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove specific refresh token or all tokens
    if (refreshToken) {
      await user.removeRefreshToken(refreshToken);
    } else {
      await user.clearRefreshTokens();
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

// GET /api/auth/me - Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(userId).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getCurrentUser
};