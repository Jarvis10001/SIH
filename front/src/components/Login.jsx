import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { themeClasses, iconClasses } from '../styles/theme';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state to prevent message from persisting on refresh
      navigate('/login', { replace: true });
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store tokens and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputClasses = `
    w-full text-sm px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
    focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
    text-white placeholder-gray-400
    transition-all duration-300
  `;

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Add Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 text-indigo-400 bg-gray-800/90 hover:bg-gray-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700 backdrop-blur-sm"
      >
        <i className="ri-arrow-left-s-line text-xl"></i>
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center items-center">
        {/* Left side content */}
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start lg:flex flex-col text-white">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link to="/" className="inline-flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-indigo-400/20">
                  <i className="ri-graduation-cap-line text-white text-xl"></i>
                </div>
                <span className="ml-3 text-xl font-bold text-white">
                  <span className="text-indigo-400">AcademiX</span>
                </span>
              </Link>
            </motion.div>
            
            <h1 className="mb-4 font-bold text-4xl bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="pr-3 text-gray-400 leading-relaxed">
              Sign in to access your AcademiX dashboard and continue your academic journey
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center self-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-gray-800/95 backdrop-blur-xl mx-auto rounded-2xl w-[420px] shadow-2xl border border-gray-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="font-bold text-2xl text-white mb-2">Sign In</h3>
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-600 rounded-xl hover:border-indigo-500 hover:bg-gray-700 transition duration-300 group bg-gray-700/50">
                <img className="w-5 h-5" src="https://static.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" />
                <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-400">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-600 rounded-xl hover:border-indigo-500 hover:bg-gray-700 transition duration-300 group bg-gray-700/50">
                <i className="ri-apple-fill text-xl text-gray-300 group-hover:text-indigo-400"></i>
                <span className="text-sm font-medium text-gray-300 group-hover:text-indigo-400">Apple</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400 font-medium">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-900/50 text-red-400 text-sm border border-red-800"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-indigo-900/50 text-indigo-400 text-sm border border-indigo-800"
                >
                  {success}
                </motion.div>
              )}
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Email"
                required
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Password"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/20 bg-gray-700" />
                  <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform
                  ${loading 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="ri-login-circle-line"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="/terms" className="text-indigo-400 hover:text-indigo-300 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="url(#gradient)" fillOpacity="0.15" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Login;