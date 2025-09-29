import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { themeClasses, iconClasses } from '../../styles/theme';

const ClerkSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState({});
    const clerkData = JSON.parse(localStorage.getItem('clerkData') || '{}');

    const getNavigationItems = () => {
        const baseItems = [
            { id: 'overview', label: 'Dashboard', icon: 'ri-dashboard-3-line', type: 'single' }
        ];

        if (clerkData?.systemAccess?.modules?.includes('admission_processing')) {
            baseItems.push({
                id: 'admissions',
                label: 'Admission Management',
                icon: 'ri-file-list-3-line',
                type: 'section',
                children: [
                    { id: 'student-verification', label: 'Student Verification', icon: 'ri-user-add-line' },
                    { id: 'document-verification', label: 'Document Verification', icon: 'ri-file-check-line' },
                    { id: 'application-status', label: 'Application Status', icon: 'ri-file-search-line' }
                ]
            });
        }

        if (clerkData?.systemAccess?.modules?.includes('student_services')) {
            baseItems.push({
                id: 'student-services',
                label: 'Student Services',
                icon: 'ri-graduation-cap-line',
                type: 'section',
                children: [
                    { id: 'student-records', label: 'Student Records', icon: 'ri-folder-user-line' },
                    { id: 'certificates', label: 'Certificates', icon: 'ri-award-line' },
                    { id: 'fee-collection', label: 'Fee Collection', icon: 'ri-money-dollar-circle-line' }
                ]
            });
        }

        if (clerkData?.systemAccess?.modules?.includes('academic_support')) {
            baseItems.push({
                id: 'academic',
                label: 'Academic Support',
                icon: 'ri-book-open-line',
                type: 'section',
                children: [
                    { id: 'exam-management', label: 'Exam Management', icon: 'ri-file-text-line' },
                    { id: 'timetable', label: 'Timetable', icon: 'ri-calendar-line' },
                    { id: 'attendance', label: 'Attendance', icon: 'ri-user-check-line' }
                ]
            });
        }

        // Library Management - Available to all clerks
        baseItems.push({ 
            id: 'library-management', 
            label: 'Library Management', 
            icon: 'ri-book-2-line', 
            type: 'single' 
        });

        baseItems.push({ id: 'profile', label: 'Profile', icon: 'ri-user-line', type: 'single' });
        return baseItems;
    };

    // Clerk navigation items based on access permissions
    const navigationItems = getNavigationItems();
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
        localStorage.removeItem('clerkToken');
        localStorage.removeItem('clerkData');
        navigate('/clerk/login');
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
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar: off-canvas on mobile; collapse on md+ with CSS transitions */}
            <div className={`fixed left-0 top-0 h-screen ${themeClasses.pageBackground.replace('min-h-screen ', '')} bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 flex flex-col shadow-2xl transform transition-all duration-300 md:duration-700 border-r border-slate-700/30 ${isOpen ? 'translate-x-0 w-72 md:w-72' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-user-settings-line text-xl ${iconClasses.primary}`}></i>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 md:duration-700 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
                            <h2 className="text-lg font-bold text-white">Clerk Portal</h2>
                            <p className="text-sm text-slate-400">AcademiX</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-2 px-4">
                        {navigationItems.map((item) => (
                            <div key={item.id}>
                                {/* Main Item */}
                                <button
                                    onClick={() => handleNavClick(item)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                                        activeTab === item.id ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-white shadow-lg border border-indigo-500/30' : 'text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-indigo-600/10 hover:text-white'
                                    }`}
                                >
                                    <i className={`${item.icon} text-xl flex-shrink-0 ${activeTab === item.id ? iconClasses.primary : 'text-slate-400 group-hover:text-indigo-400'}`}></i>
                                    <span className={`font-medium overflow-hidden whitespace-nowrap transition-all duration-300 md:duration-700 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
                                        {item.label}
                                    </span>
                                    {item.type === 'section' && isOpen && (
                                        <motion.i animate={{ rotate: expandedSections[item.id] ? 180 : 0 }} className="ri-arrow-down-s-line text-sm ml-auto" />
                                    )}
                                </button>

                                {/* Children Items */}
                                <AnimatePresence>
                                    {item.type === 'section' && expandedSections[item.id] && isOpen && (
                                        <div className="overflow-hidden ml-4 mt-2 space-y-1">
                                            {item.children.map((child) => (
                                                <button
                                                    key={child.id}
                                                    onClick={() => setActiveTab(child.id)}
                                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                                                        activeTab === child.id ? 'bg-indigo-600/30 text-white border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                                                    }`}
                                                >
                                                    <i className={`${child.icon} text-lg flex-shrink-0 ${activeTab === child.id ? iconClasses.primary : 'text-slate-500'}`}></i>
                                                    <span className="font-medium text-sm">{child.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/30">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/30">
                        <i className="ri-logout-box-line text-xl flex-shrink-0"></i>
                        <span className={`font-medium overflow-hidden whitespace-nowrap transition-all duration-300 md:duration-700 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ClerkSidebar;