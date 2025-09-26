/**
 * Utility functions for token management
 */

/**
 * Check if a JWT token is valid and not expired
 * @param {string} token - JWT token
 * @returns {object} - { isValid: boolean, expiresAt: Date, timeLeft: number }
 */
export const validateToken = (token) => {
  try {
    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    // Decode JWT payload (without verification, just for expiry check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = new Date(payload.exp * 1000);
    const currentTime = new Date();
    const timeLeft = expiresAt - currentTime;
    const isValid = timeLeft > 0;

    return {
      isValid,
      expiresAt,
      timeLeft,
      hoursLeft: Math.floor(timeLeft / (1000 * 60 * 60)),
      minutesLeft: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

/**
 * Check if admin token is valid, redirect to login if not
 * @param {function} navigate - React Router navigate function
 * @returns {boolean} - true if token is valid
 */
export const validateAdminToken = (navigate) => {
  const token = localStorage.getItem('adminToken');
  const tokenValidation = validateToken(token);

  if (!tokenValidation.isValid) {
    console.warn('❌ Admin token invalid or expired:', tokenValidation.error);
    // Clear invalid token data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('tokenTimestamp');
    
    // Redirect to login
    navigate('/admin/login');
    return false;
  }

  console.log('✅ Admin token valid for', tokenValidation.hoursLeft, 'hours', tokenValidation.minutesLeft, 'minutes');
  return true;
};

/**
 * Get fresh admin token info
 * @returns {object} - token info or null if invalid
 */
export const getAdminTokenInfo = () => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');
  const timestamp = localStorage.getItem('tokenTimestamp');

  if (!token || !adminData) {
    return null;
  }

  const validation = validateToken(token);
  if (!validation.isValid) {
    return null;
  }

  return {
    token,
    admin: JSON.parse(adminData),
    loginTime: timestamp ? new Date(parseInt(timestamp)) : null,
    expiresAt: validation.expiresAt,
    timeLeft: validation.timeLeft,
    hoursLeft: validation.hoursLeft,
    minutesLeft: validation.minutesLeft
  };
};

/**
 * Clear all admin token data
 */
export const clearAdminTokens = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  localStorage.removeItem('tokenTimestamp');
  console.log('🧹 Cleared admin token data');
};