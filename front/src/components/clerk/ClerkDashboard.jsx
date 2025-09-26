import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import StudentVerification from './StudentVerification';
import DocumentVerification from './DocumentVerification';
import ClerkSidebar from './ClerkSidebar';
import ClerkTopNav from './ClerkTopNav';

const ClerkDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [clerkData, setClerkData] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if clerk is logged in
        const token = localStorage.getItem('clerkToken');
        const clerk = localStorage.getItem('clerkData');
        
        if (!token || !clerk) {
            navigate('/clerk/login');
            return;
        }

        setClerkData(JSON.parse(clerk));
        fetchDashboardStats();
    }, [navigate]);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('clerkToken');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/clerk/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setDashboardStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError('Failed to fetch dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('clerkToken');
        localStorage.removeItem('clerkData');
        navigate('/clerk/login');
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">
                            Welcome back, {clerkData?.personalInfo?.fullName}!
                        </h2>
                        <p className="text-blue-100">
                            {clerkData?.professionalInfo?.designation} - {clerkData?.professionalInfo?.department}
                        </p>
                        <p className="text-blue-100 text-sm mt-1">
                            Access Level: {clerkData?.systemAccess?.accessLevel?.toUpperCase()}
                        </p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="ri-user-settings-line text-3xl"></i>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Accessible Modules</p>
                            <p className="text-3xl font-bold text-gray-900">{dashboardStats.modules || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center">
                            <i className="ri-apps-line text-[#3B82F6] text-xl"></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Department</p>
                            <p className="text-lg font-bold text-gray-900">{dashboardStats.department || 'N/A'}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center">
                            <i className="ri-building-line text-[#3B82F6] text-xl"></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Work Shift</p>
                            <p className="text-lg font-bold text-gray-900">{dashboardStats.workShift || 'N/A'}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center">
                            <i className="ri-time-line text-[#3B82F6] text-xl"></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Access Level</p>
                            <p className="text-lg font-bold text-gray-900 capitalize">
                                {dashboardStats.accessLevel || 'Read'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center">
                            <i className="ri-shield-user-line text-[#3B82F6] text-xl"></i>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clerkData?.systemAccess?.modules?.includes('admission_processing') && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab('student-verification')}
                            className="p-4 bg-gradient-to-r from-[#3B82F6]/10 to-[#06B6D4]/10 rounded-xl border border-[#3B82F6]/20 hover:from-[#3B82F6]/20 hover:to-[#06B6D4]/20 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center">
                                    <i className="ri-user-add-line text-white"></i>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">Student Verification</p>
                                    <p className="text-sm text-gray-600">Review admission applications</p>
                                </div>
                            </div>
                        </motion.button>
                    )}

                    {clerkData?.systemAccess?.modules?.includes('document_verification') && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-gradient-to-r from-[#06B6D4]/10 to-[#3B82F6]/10 rounded-xl border border-[#06B6D4]/20 hover:from-[#06B6D4]/20 hover:to-[#3B82F6]/20 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#06B6D4] rounded-lg flex items-center justify-center">
                                    <i className="ri-file-check-line text-white"></i>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">Document Verification</p>
                                    <p className="text-sm text-gray-600">Verify student documents</p>
                                </div>
                            </div>
                        </motion.button>
                    )}

                    {clerkData?.systemAccess?.modules?.includes('fee_collection') && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-gradient-to-r from-[#2563EB]/10 to-[#3B82F6]/10 rounded-xl border border-[#2563EB]/20 hover:from-[#2563EB]/20 hover:to-[#3B82F6]/20 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                                    <i className="ri-money-dollar-circle-line text-white"></i>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">Fee Collection</p>
                                    <p className="text-sm text-gray-600">Manage fee payments</p>
                                </div>
                            </div>
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'student-verification':
                return <StudentVerification />;
            case 'document-verification':
                return <DocumentVerification />;
            case 'application-status':
                return renderApplicationStatus();
            case 'student-records':
                return renderStudentRecords();
            case 'certificates':
                return renderCertificates();
            case 'fee-collection':
                return renderFeeCollection();
            case 'exam-management':
                return renderExamManagement();
            case 'timetable':
                return renderTimetable();
            case 'attendance':
                return renderAttendance();
            case 'profile':
                return renderProfile();
            default:
                return renderOverview();
        }
    };

    // Placeholder render functions for new sections
    const renderApplicationStatus = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-file-search-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Status</h3>
            <p className="text-gray-600">Track and manage application statuses</p>
        </div>
    );

    const renderStudentRecords = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-folder-user-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Records</h3>
            <p className="text-gray-600">Manage student academic records</p>
        </div>
    );

    const renderCertificates = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-award-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certificates</h3>
            <p className="text-gray-600">Issue and manage certificates</p>
        </div>
    );

    const renderFeeCollection = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-money-dollar-circle-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fee Collection</h3>
            <p className="text-gray-600">Manage fee payments and collections</p>
        </div>
    );

    const renderExamManagement = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-file-text-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Exam Management</h3>
            <p className="text-gray-600">Manage exams and results</p>
        </div>
    );

    const renderTimetable = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-calendar-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Timetable</h3>
            <p className="text-gray-600">Manage class schedules and timetables</p>
        </div>
    );

    const renderAttendance = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-user-check-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance</h3>
            <p className="text-gray-600">Track and manage student attendance</p>
        </div>
    );

    const renderProfile = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                    {clerkData?.personalInfo?.fullName?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {clerkData?.personalInfo?.fullName || 'Clerk Profile'}
                    </h3>
                    <p className="text-gray-600">Employee ID: {clerkData?.employeeId}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Email:</span> {clerkData?.personalInfo?.email}</p>
                        <p className="text-sm"><span className="font-medium">Phone:</span> {clerkData?.personalInfo?.phone}</p>
                        <p className="text-sm"><span className="font-medium">Department:</span> {clerkData?.professionalInfo?.department}</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Professional Information</h4>
                    <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Designation:</span> {clerkData?.professionalInfo?.designation}</p>
                        <p className="text-sm"><span className="font-medium">Work Shift:</span> {clerkData?.professionalInfo?.workShift}</p>
                        <p className="text-sm"><span className="font-medium">Access Level:</span> {clerkData?.systemAccess?.accessLevel}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Clerk Sidebar */}
            <ClerkSidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                clerkData={clerkData}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navigation */}
                <ClerkTopNav 
                    activeTab={activeTab}
                    isOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                    clerkData={clerkData}
                />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
                        >
                            <div className="flex items-center gap-2">
                                <i className="ri-error-warning-line"></i>
                                {error}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default ClerkDashboard;