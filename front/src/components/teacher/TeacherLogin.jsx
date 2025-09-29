import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { themeClasses, iconClasses } from '../../styles/theme';

const TeacherLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        teacherId: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/login`, formData);

            if (response.data.success) {
                localStorage.setItem('teacherToken', response.data.token);
                localStorage.setItem('teacherData', JSON.stringify(response.data.teacher));
                navigate('/teacher/dashboard');
            }
        } catch (error) {
            console.error('Teacher login error:', error);
            if (error.response?.status === 401) {
                setError('Invalid teacher ID or password');
            } else if (error.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(error.response?.data?.message || 'An error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = `
        w-full text-sm px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg
        focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
        text-white placeholder-gray-400
        transition-all duration-300
    `;

    return (
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
            {/* Back Button */}
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
                            <div className="inline-flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-indigo-400/20">
                                    <i className="ri-user-star-line text-white text-lg"></i>
                                </div>
                                <span className="ml-3 text-xl font-bold text-white">
                                    <span className="text-indigo-400">AcademiX</span> Teacher
                                </span>
                            </div>
                        </motion.div>
                        
                        <h1 className="mb-4 font-bold text-4xl bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent">Faculty Access</h1>
                        <p className="pr-3 text-gray-400 leading-relaxed">
                            Sign in to access your teaching dashboard and student management tools
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
                            <h3 className="font-bold text-2xl text-white mb-2">Teacher Login</h3>
                            <p className="text-gray-400">
                                Access your teaching dashboard
                            </p>
                        </div>

                        {/* Teacher Features */}
                        {/* <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center justify-center gap-2 p-3 border border-indigo-200 rounded-xl bg-indigo-900/20 group">
                                <i className="ri-book-open-line text-indigo-400 group-hover:scale-110 transition-transform"></i>
                                <span className="text-sm text-indigo-300 font-medium">Classes</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-3 border border-blue-200 rounded-xl bg-blue-900/20 group">
                                <i className="ri-user-follow-line text-blue-400 group-hover:scale-110 transition-transform"></i>
                                <span className="text-sm text-blue-300 font-medium">Students</span>
                            </div>
                        </div> */}

                        {/* <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-800 text-gray-400 font-medium flex items-center gap-2">
                                    <i className="ri-shield-user-line text-indigo-500"></i>
                                    faculty member access
                                </span>
                            </div>
                        </div> */}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-red-900/50 text-red-400 text-sm border border-red-800"
                                >
                                    <div className="flex items-center gap-2">
                                        <i className="ri-error-warning-line"></i>
                                        {error}
                                    </div>
                                </motion.div>
                            )}

                            {/* Access Information */}
                            <div className="bg-indigo-900/30 border border-indigo-700 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <i className="ri-information-line text-indigo-400 text-lg mt-0.5"></i>
                                    <div>
                                        <h4 className="text-sm font-semibold text-indigo-300 mb-2">Faculty Access</h4>
                                        <p className="text-sm text-indigo-200">
                                            Use your assigned teacher ID and secure password to access your dashboard
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-300">
                                    Teacher ID
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-user-star-line text-indigo-500 group-focus-within:text-indigo-400 transition-colors"></i>
                                    </div>
                                    <input
                                        type="text"
                                        name="teacherId"
                                        value={formData.teacherId}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/10 transition-all duration-300 bg-gray-700 focus:bg-gray-600 text-white placeholder-gray-400"
                                        placeholder="Enter your teacher ID"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-300">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-lock-line text-indigo-500 group-focus-within:text-indigo-400 transition-colors"></i>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100/10 transition-all duration-300 bg-gray-700 focus:bg-gray-600 text-white placeholder-gray-400"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center group cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-600 text-indigo-500 focus:ring-indigo-500/20 bg-gray-700" />
                                    <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-300">Remember faculty session</span>
                                </label>
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <i className="ri-shield-user-line text-indigo-500"></i>
                                    <span className="font-medium">Faculty Access</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 transform
                                    ${loading 
                                        ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <i className="ri-user-star-line text-lg"></i>
                                        Access Dashboard
                                    </div>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                <i className="ri-shield-user-line text-indigo-500"></i>
                                Faculty access to{' '}
                                <span className="text-indigo-400 font-semibold">AcademiX System</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="url(#teacherGradient)" fillOpacity="0.15" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                    <defs>
                        <linearGradient id="teacherGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
};

export default TeacherLogin;