// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Default error response
  let error = {
    success: false,
    message: 'Internal Server Error',
    statusCode: 500
  };

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.statusCode = 400;
    error.details = err.message;
  } else if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.statusCode = 400;
  } else if (err.code === 11000) {
    error.message = 'Duplicate field value';
    error.statusCode = 400;
  } else if (err.message) {
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete error.details;
  } else {
    error.stack = err.stack;
  }

  res.status(error.statusCode).json(error);
};

// 404 Not Found middleware
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
