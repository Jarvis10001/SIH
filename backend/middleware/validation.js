// Validation middleware for request data
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  // Validate name
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 50) {
    errors.push('Name must be less than 50 characters');
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Sanitize input
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

// Validate user ID parameter
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID. ID must be a number'
    });
  }

  next();
};

// Validate email parameter
const validateEmailParam = (req, res, next) => {
  const { email } = req.params;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email parameter is required'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  next();
};

module.exports = {
  validateUser,
  validateUserId,
  validateEmailParam
};
