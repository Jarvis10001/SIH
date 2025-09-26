const { verifyToken, verifyRefreshToken } = require('../utils/jwt');

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Add user info to request object
    // Handle both admin token structure (with user object) and regular token structure
    if (decoded.user) {
      // Admin/Clerk/Teacher token structure: { user: { id, role, username, employeeId, systemAccess, teacherId } }
      req.user = {
        id: decoded.user.id,
        email: decoded.user.email || decoded.user.username,
        role: decoded.user.role || 'user',
        username: decoded.user.username,
        employeeId: decoded.user.employeeId,
        systemAccess: decoded.user.systemAccess,
        teacherId: decoded.user.teacherId
      };
    } else {
      // Regular token structure: { id, email, role, studentId, year, branch }
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
        studentId: decoded.studentId, // Add studentId for student tokens
        year: decoded.year,
        branch: decoded.branch
      };
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token has expired.',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.',
        error: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      error: error.message
    });
  }
};

/**
 * Middleware to authenticate refresh tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No refresh token provided.'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired. Please login again.',
        error: 'REFRESH_TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.',
        error: 'INVALID_REFRESH_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during refresh token authentication.',
      error: error.message
    });
  }
};

/**
 * Middleware to authorize user roles
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.'
        });
      }

      // If no roles specified, just check authentication
      if (allowedRoles.length === 0) {
        return next();
      }

      // Check if user role is in allowed roles
      const userRole = req.user.role || 'user';
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
          requiredRoles: allowedRoles,
          userRole: userRole
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authorization.',
        error: error.message
      });
    }
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    // Try to verify token
    const decoded = verifyToken(token);
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    // Token is invalid but we don't fail - just continue without user info
    next();
  }
};

module.exports = {
  authenticate,
  authenticateRefreshToken,
  authorize,
  optionalAuth
};