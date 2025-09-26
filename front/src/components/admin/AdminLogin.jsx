import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { clearAdminTokens } from '../../utils/tokenUtils';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            clearAdminTokens();

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, formData);

            if (response.data.success) {
                const { token, admin } = response.data;
                
                try {
                    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                    const expiryTime = new Date(tokenPayload.exp * 1000);
                    const currentTime = new Date();
                    
                    if (expiryTime <= currentTime) {
                        throw new Error('Received expired token');
                    }
                    
                    localStorage.setItem('adminToken', token);
                    localStorage.setItem('adminData', JSON.stringify(admin));
                    localStorage.setItem('tokenTimestamp', Date.now().toString());
                    
                    navigate('/admin/dashboard');
                } catch (tokenError) {
                    console.error('Token validation failed:', tokenError);
                    setError('Invalid token received. Please try again.');
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setError('Invalid username or password');
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
        w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
        focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20
        text-[#333333] placeholder-[#6C757D]
        transition-all duration-300
    `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#3B82F6]/5 via-white to-[#06B6D4]/5 relative overflow-hidden">
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 text-[#3B82F6] bg-transparent hover:bg-white/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg border border-[#3B82F6]/20"
            >
                <i className="ri-arrow-left-s-line text-xl"></i>
                <span className="font-medium">Back to Home</span>
            </button>

            <div className="absolute inset-0 bg-[#3B82F6]/5 backdrop-blur-3xl"></div>
            
            <div className="relative min-h-screen sm:flex sm:flex-row justify-center items-center">
                <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
                    <div className="self-start lg:flex flex-col text-[#333333]">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <div className="inline-flex items-center">
                                <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                                    <i className="ri-admin-line text-white text-lg"></i>
                                </div>
                                <span className="ml-2 text-lg font-bold text-[#333333]">
                                    Admin<span className="text-[#3B82F6]">Portal</span>
                                </span>
                            </div>
                        </motion.div>
                        
                        <h1 className="mb-2 font-semibold text-3xl">Administrator Access</h1>
                        <p className="pr-3 text-sm text-[#6C757D] opacity-75">
                            Sign in to access the college ERP administration panel
                        </p>
                    </div>
                </div>

                <div className="flex justify-center self-center z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-white/80 backdrop-blur-xl mx-auto rounded-2xl w-[400px] shadow-xl"
                    >
                        <div className="mb-6">
                            <h3 className="font-semibold text-xl text-[#333333]">Admin Login</h3>
                            <p className="text-sm text-[#6C757D]">
                                Secure access to administration panel
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl bg-[#3B82F6]/5">
                                <i className="ri-team-line text-[#3B82F6]"></i>
                                <span className="text-sm text-[#3B82F6]">User Mgmt</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl bg-[#06B6D4]/5">
                                <i className="ri-settings-3-line text-[#06B6D4]"></i>
                                <span className="text-sm text-[#06B6D4]">System</span>
                            </div>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-[#6C757D]">secure admin access</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <i className="ri-error-warning-line"></i>
                                        {error}
                                    </div>
                                </motion.div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <i className="ri-information-line text-blue-500 text-sm mt-0.5"></i>
                                    <div>
                                        <h4 className="text-xs font-medium text-blue-800 mb-1">Default Credentials</h4>
                                        <p className="text-xs text-blue-700">
                                            Username: <span className="font-mono font-semibold">admin</span><br/>
                                            Password: <span className="font-mono font-semibold">Admin@123</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Admin Username"
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="Admin Password"
                                required
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6]/20" />
                                    <span className="ml-2 text-sm text-[#6C757D]">Remember session</span>
                                </label>
                                <span className="text-sm text-[#6C757D]">
                                    Secure Access
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`
                                    w-full py-2.5 rounded-lg font-semibold transition duration-300
                                    ${loading 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20'
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <i className="ri-loader-4-line animate-spin"></i>
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <i className="ri-shield-check-line"></i>
                                        Access Admin Panel
                                    </div>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-[#6C757D]">
                                Secure administrative access to{' '}
                                <span className="text-[#3B82F6] font-medium">College ERP System</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#3B82F6" fillOpacity="0.05" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
            </div>
        </div>
    );
};

export default AdminLogin;