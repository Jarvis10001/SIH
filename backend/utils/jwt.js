const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - User data to encode in token
 * @param {string} expiresIn - Token expiration time (default: 7d)
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'sih-backend',
    audience: 'sih-frontend'
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode in token
 * @returns {string} Refresh JWT token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
    issuer: 'sih-backend',
    audience: 'sih-frontend'
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'sih-backend',
    audience: 'sih-frontend'
  });
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: 'sih-backend',
    audience: 'sih-frontend'
  });
};

/**
 * Decode token without verification (for expired token info)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  decodeToken
};