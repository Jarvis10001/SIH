const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
  getUserByEmail
} = require('../controllers/UserController');
const { validateUser, validateUserId, validateEmailParam } = require('../middleware/validation');

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/email/:email - Find user by email (must come before /:id route)
router.get('/email/:email', validateEmailParam, getUserByEmail);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUserId, getUserById);

// POST /api/users - Create new user
router.post('/', validateUser, createNewUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateUserId, validateUser, updateExistingUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validateUserId, deleteExistingUser);

module.exports = router;
