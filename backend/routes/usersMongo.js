const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
} = require('../controllers/UserControllerMongo');

const { authenticate, authorize, authenticateRefreshToken } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', authenticateRefreshToken, refreshToken);

// Protected routes (authentication required)
router.use(authenticate); // All routes below this require authentication

router.post('/logout', logoutUser);
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'User profile retrieved successfully',
    data: req.user
  });
});

// Admin only routes
router.get('/', authorize(['admin']), getAllUsers);
router.post('/', authorize(['admin']), createUser);
router.get('/:id', authorize(['admin']), getUserById);
router.put('/:id', authorize(['admin']), updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);

module.exports = router;