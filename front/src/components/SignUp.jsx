import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { themeClasses, iconClasses } from '../styles/theme';

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        email: formData.email,
        password: formData.password,
        name: formData.email.split('@')[0] // Use email username as name
      });

      if (response.data.success) {
        // Redirect to login page with success message
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please log in.',
            type: 'success'
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
              Join AcademiX
            </h1>
            <p className="pr-3 text-gray-400 leading-relaxed">
              Create your account and start managing your academic journey with AcademiX comprehensive management system
            </p>
          </div>
        </div>

        {/* SignUp Form */}
        <div className="flex justify-center self-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-gray-800/95 backdrop-blur-xl mx-auto rounded-2xl w-[420px] shadow-2xl border border-gray-700/50"
          >
            <div className="mb-8 text-center">
              <h3 className="font-bold text-2xl text-white mb-2">Create Account</h3>
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Sign In
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
                <span className="px-4 bg-gray-800 text-gray-400 font-medium">or create account with email</span>
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

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Email Address"
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
                minLength={6}
              />

              {/* <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]/20 mt-1" 
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-[#6C757D]">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#3B82F6] hover:text-[#2563EB]">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#3B82F6] hover:text-[#2563EB]">Privacy Policy</Link>
                </label>
              </div> */}

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform
                  ${loading 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="ri-user-add-line"></i>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
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
          <path fill="url(#signupGradient)" fillOpacity="0.15" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          <defs>
            <linearGradient id="signupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default SignUp;