const {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  findUserByEmail
} = require('../models/User');

// GET /api/users - Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = findAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// GET /api/users/:id - Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// POST /api/users - Create new user
const createNewUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user with email already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const newUser = createUser({ name, email });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// PUT /api/users/:id - Update user
const updateExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if user exists
    const existingUser = findUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already taken by another user
    const userWithEmail = findUserByEmail(email);
    if (userWithEmail && userWithEmail.id !== parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Email already taken by another user'
      });
    }

    const updatedUser = updateUser(id, { name, email });
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// DELETE /api/users/:id - Delete user
const deleteExistingUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = deleteUser(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// GET /api/users/email/:email - Find user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
  getUserByEmail
};
