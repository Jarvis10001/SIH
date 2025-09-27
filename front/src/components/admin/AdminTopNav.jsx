import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../styles/theme';

const AdminTopNav = ({ activeTab, isOpen, toggleSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    
    // Get admin data from localStorage
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

    // Get current page title based on activeTab
    const getPageTitle = () => {
        const titleMap = {
            'overview': 'Dashboard Overview',
            'teachers': 'Teacher Management',
            'clerks': 'Clerk Management', 
            'students': 'Student Management',
            'courses': 'Course Management',
            'departments': 'Department Management',
            'academic-calendar': 'Academic Calendar',
            'applications': 'Admission Applications',
            'admission-reports': 'Admission Reports',
            'fee-management': 'Fee Management',
            'payroll': 'Payroll Management',
            'financial-reports': 'Financial Reports',
            'settings': 'System Settings'
        };
        
        return titleMap[activeTab] || 'Admin Dashboard';
    };

    // Mock notifications for admin
    useEffect(() => {
        const mockNotifications = [
            {
                id: '1',
                type: 'alert',
                title: 'System Maintenance',
                message: 'Scheduled maintenance tonight at 2:00 AM',
                time: new Date(Date.now() - 15 * 60000),
                read: false
            },
            {
                id: '2',
                type: 'user',
                title: 'New Teacher Registration',
                message: 'Dr. Sarah Wilson has submitted registration',
                time: new Date(Date.now() - 45 * 60000),
                read: false
            },
            {
                id: '3',
                type: 'report',
                title: 'Monthly Report Ready',
                message: 'September admission report is available',
                time: new Date(Date.now() - 2 * 60 * 60000),
                read: true
            }
        ];
        
        setNotifications(mockNotifications);
        setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
    }, []);

    const getNotificationIcon = (type) => {
        const iconMap = {
            'alert': 'ri-alert-line',
            'user': 'ri-user-add-line',
            'report': 'ri-file-chart-line',
            'system': 'ri-settings-line'
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
            <div className="bg-gray-800/95 backdrop-blur-md shadow-sm px-6 py-3 border-b border-slate-700/30">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl hover:bg-indigo-500/20 text-indigo-400 transition-all duration-300"
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
                                className="text-xl font-bold text-white"
                            >
                                {getPageTitle()}
                            </motion.h1>
                            <p className="text-sm text-slate-400 hidden md:block">
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
                                className="relative p-2 rounded-xl hover:bg-amber-500/20 text-amber-400 transition-all duration-300"
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
                                        className="absolute right-0 top-12 w-80 bg-gray-800 rounded-xl shadow-lg border border-slate-700 max-h-96 overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-slate-700">
                                            <h3 className="font-semibold text-white">Notifications</h3>
                                        </div>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 border-b border-slate-700 last:border-b-0 ${
                                                        !notification.read ? 'bg-indigo-500/10' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <i className={`${getNotificationIcon(notification.type)} text-indigo-400 mt-1`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-white text-sm">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-slate-300 text-xs mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-slate-400 text-xs mt-1">
                                                                {notification.time.toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </p>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5"></div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-slate-400">
                                                <i className="ri-notification-off-line text-3xl mb-2 block"></i>
                                                <p className="text-sm">No notifications</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Admin Profile */}
                        <div className="flex items-center gap-2.5 p-2 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold">
                                {adminData?.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-white">
                                    {adminData?.name || 'Administrator'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    System Admin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopNav;