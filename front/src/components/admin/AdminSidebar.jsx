import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState({});

    // Admin navigation items
    const navigationItems = [
        {
            id: 'overview',
            label: 'Dashboard',
            icon: 'ri-dashboard-3-line',
            type: 'single'
        },
        {
            id: 'users',
            label: 'User Management',
            icon: 'ri-team-line',
            type: 'section',
            children: [
                { id: 'teachers', label: 'Teachers', icon: 'ri-user-line' },
                { id: 'clerks', label: 'Clerks', icon: 'ri-user-settings-line' },
                { id: 'students', label: 'Students', icon: 'ri-graduation-cap-line' }
            ]
        },
        {
            id: 'academic',
            label: 'Academic',
            icon: 'ri-book-open-line',
            type: 'section',
            children: [
                { id: 'courses', label: 'Courses', icon: 'ri-book-line' },
                { id: 'departments', label: 'Departments', icon: 'ri-building-line' },
                { id: 'academic-calendar', label: 'Academic Calendar', icon: 'ri-calendar-line' }
            ]
        },
        {
            id: 'admissions',
            label: 'Admissions',
            icon: 'ri-file-list-3-line',
            type: 'section',
            children: [
                { id: 'applications', label: 'Applications', icon: 'ri-file-text-line' },
                { id: 'admission-reports', label: 'Reports', icon: 'ri-bar-chart-line' }
            ]
        },
        {
            id: 'finance',
            label: 'Finance',
            icon: 'ri-money-dollar-circle-line',
            type: 'section',
            children: [
                { id: 'fee-management', label: 'Fee Management', icon: 'ri-wallet-line' },
                { id: 'payroll', label: 'Payroll', icon: 'ri-bank-line' },
                { id: 'financial-reports', label: 'Reports', icon: 'ri-line-chart-line' }
            ]
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'ri-settings-3-line',
            type: 'single'
        }
    ];

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleNavClick = (item) => {
        if (item.type === 'section') {
            toggleSection(item.id);
        } else {
            setActiveTab(item.id);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    width: isOpen ? '280px' : '80px',
                    transition: { duration: 0.3, ease: 'easeInOut' }
                }}
                className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0C4A6E] text-white z-50 flex flex-col shadow-2xl ${
                    isOpen ? 'lg:relative' : 'lg:relative'
                }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="ri-admin-line text-xl text-white"></i>
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="overflow-hidden"
                                >
                                    <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                                    <p className="text-sm text-blue-200">Management System</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-2 px-4">
                        {navigationItems.map((item) => (
                            <div key={item.id}>
                                {/* Main Item */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleNavClick(item)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                                        activeTab === item.id
                                            ? 'bg-white/20 text-white shadow-lg'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <i className={`${item.icon} text-xl flex-shrink-0`}></i>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="font-medium overflow-hidden whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {/* Expand Arrow for sections */}
                                    {item.type === 'section' && isOpen && (
                                        <motion.i
                                            animate={{ 
                                                rotate: expandedSections[item.id] ? 180 : 0 
                                            }}
                                            className="ri-arrow-down-s-line text-sm ml-auto"
                                        />
                                    )}
                                </motion.button>

                                {/* Children Items */}
                                <AnimatePresence>
                                    {item.type === 'section' && expandedSections[item.id] && isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden ml-4 mt-2 space-y-1"
                                        >
                                            {item.children.map((child) => (
                                                <motion.button
                                                    key={child.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setActiveTab(child.id)}
                                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                                                        activeTab === child.id
                                                            ? 'bg-[#3B82F6]/30 text-white'
                                                            : 'text-blue-200 hover:bg-white/5 hover:text-white'
                                                    }`}
                                                >
                                                    <i className={`${child.icon} text-lg flex-shrink-0`}></i>
                                                    <span className="font-medium text-sm">
                                                        {child.label}
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300"
                    >
                        <i className="ri-logout-box-line text-xl flex-shrink-0"></i>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-medium overflow-hidden whitespace-nowrap"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
};

export default AdminSidebar;