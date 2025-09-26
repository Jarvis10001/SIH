import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClerkTopNav = ({ activeTab, isOpen, toggleSidebar, clerkData }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    // Get current page title based on activeTab
    const getPageTitle = () => {
        const titleMap = {
            'overview': 'Dashboard Overview',
            'student-verification': 'Student Verification',
            'document-verification': 'Document Verification',
            'application-status': 'Application Status',
            'student-records': 'Student Records',
            'certificates': 'Certificates',
            'fee-collection': 'Fee Collection',
            'exam-management': 'Exam Management',
            'timetable': 'Timetable',
            'attendance': 'Attendance',
            'profile': 'My Profile'
        };
        
        return titleMap[activeTab] || 'Clerk Dashboard';
    };

    // Mock notifications for clerk
    useEffect(() => {
        const mockNotifications = [
            {
                id: '1',
                type: 'verification',
                title: 'New Application Pending',
                message: 'Student ID: ST2025001 requires document verification',
                time: new Date(Date.now() - 10 * 60000),
                read: false
            },
            {
                id: '2',
                type: 'urgent',
                title: 'Urgent Review Required',
                message: 'Application deadline approaching for 5 students',
                time: new Date(Date.now() - 30 * 60000),
                read: false
            },
            {
                id: '3',
                type: 'update',
                title: 'System Update',
                message: 'New verification workflow has been implemented',
                time: new Date(Date.now() - 2 * 60 * 60000),
                read: true
            }
        ];
        
        setNotifications(mockNotifications);
        setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
    }, []);

    const getNotificationIcon = (type) => {
        const iconMap = {
            'verification': 'ri-user-add-line',
            'urgent': 'ri-alert-line',
            'update': 'ri-information-line',
            'document': 'ri-file-check-line'
        };
        return iconMap[type] || 'ri-notification-line';
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            // Mark as read
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
            setUnreadNotifications(prev => prev - 1);
        }
        setShowNotifications(false);
    };

    return (
        <div className="sticky top-0 left-0 z-30">
            <div className="bg-white backdrop-blur-md shadow-sm px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl hover:bg-[#3B82F6]/10 text-[#3B82F6] transition-all duration-300"
                        >
                            <motion.i 
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                className={`${isOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'} text-xl`}
                            />
                        </button>
                        
                        <div>
                            <motion.h1 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-xl font-bold text-[#3B82F6]"
                            >
                                {getPageTitle()}
                            </motion.h1>
                            <p className="text-sm text-[#06B6D4] hidden md:block">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                className="relative p-2 rounded-xl hover:bg-[#3B82F6]/10 text-[#3B82F6] transition-all duration-300"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="ri-notification-3-line text-xl" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        </div>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                                        !notification.read ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <i className={`${getNotificationIcon(notification.type)} text-[#3B82F6] mt-1`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-800 text-sm">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-gray-600 text-xs mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-gray-400 text-xs mt-1">
                                                                {notification.time.toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </p>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-[#3B82F6] rounded-full flex-shrink-0 mt-1.5"></div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                <i className="ri-notification-off-line text-3xl mb-2 block"></i>
                                                <p className="text-sm">No notifications</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Clerk Profile */}
                        <div className="flex items-center gap-2.5 p-2 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-semibold">
                                {clerkData?.personalInfo?.fullName ? clerkData.personalInfo.fullName.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-[#3B82F6]">
                                    {clerkData?.personalInfo?.fullName || 'Clerk'}
                                </p>
                                <p className="text-xs text-[#06B6D4]">
                                    ID: {clerkData?.employeeId || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClerkTopNav;