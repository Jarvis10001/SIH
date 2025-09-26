import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

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
    w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
    focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20
    text-[#333333] placeholder-[#6C757D]
    transition-all duration-300
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B82F6]/5 via-white to-[#3B82F6]/5 relative overflow-hidden">
      {/* Add Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 text-[#3B82F6] bg-transparent hover:bg-white/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg border border-[#3B82F6]/20"
      >
        <i className="ri-arrow-left-s-line text-xl"></i>
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="absolute inset-0 bg-[#3B82F6]/5 backdrop-blur-3xl"></div>
      
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center items-center">
        {/* Left side content */}
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start lg:flex flex-col text-[#333333]">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link to="/" className="inline-flex items-center">
                <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">S</span>
                </div>
                <span className="ml-2 text-lg font-bold text-[#333333]">
                  Smart<span className="text-[#3B82F6]">ERP</span>
                </span>
              </Link>
            </motion.div>
            
            <h1 className="mb-2 font-semibold text-3xl">Welcome Back</h1>
            <p className="pr-3 text-sm text-[#6C757D] opacity-75">
              Sign in to access your college management dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center self-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/80 backdrop-blur-xl mx-auto rounded-2xl w-[400px] shadow-xl"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-xl text-[#333333]">Sign In</h3>
              <p className="text-sm text-[#6C757D]">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#3B82F6] hover:text-[#2563EB]">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#3B82F6]/20 hover:bg-[#3B82F6]/5 transition duration-300">
                <img className="w-5 h-5" src="https://static.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" />
                <span className="text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#3B82F6]/20 hover:bg-[#3B82F6]/5 transition duration-300">
                <i className="ri-apple-fill text-xl"></i>
                <span className="text-sm">Apple</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-[#6C757D]">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-green-50 text-green-600 text-sm border border-green-100"
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
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]/20" />
                  <span className="ml-2 text-sm text-[#6C757D]">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-[#3B82F6] hover:text-[#2563EB]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-2.5 rounded-lg font-semibold transition duration-300
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md shadow-[#3B82F6]/20'
                  }
                `}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#6C757D]">
                By signing in, you agree to our{' '}
                <a href="/terms" className="text-[#3B82F6] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-[#3B82F6] hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#3B82F6" fillOpacity="0.05" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Login;