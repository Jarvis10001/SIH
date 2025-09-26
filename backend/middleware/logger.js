// Logger middleware to log HTTP requests
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const logBody = { ...req.body };
    // Remove sensitive fields if they exist
    delete logBody.password;
    delete logBody.token;
    console.log(`[${timestamp}] Request Body:`, logBody);
  }
  
  next();
};

module.exports = { logger };
