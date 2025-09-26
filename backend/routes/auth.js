const express = require('express');
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getCurrentUser
} = require('../controllers/AuthController');

const { authenticate, authenticateRefreshToken } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', authenticateRefreshToken, refreshToken);

// Protected routes (authentication required)
router.use(authenticate); // All routes below this require authentication

router.post('/logout', logoutUser);
router.get('/me', getCurrentUser);

module.exports = router;