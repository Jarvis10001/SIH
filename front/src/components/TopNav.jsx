import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

const TopNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, toggleSidebar } = useSidebar();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // Get current page title based on path
    const getPageTitle = () => {
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        if (lastSegment === 'dashboard' || lastSegment === '') {
            return 'Dashboard';
        }
        
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
    };

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Mock notifications for College ERP
                const mockNotifications = [
                    {
                        id: '1',
                        type: 'assignment',
                        title: 'New Assignment Posted',
                        message: 'Mathematics Assignment 3 has been posted by Prof. Johnson',
                        time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
                        read: false,
                        path: '/dashboard/assignments'
                    },
                    {
                        id: '2',
                        type: 'grade',
                        title: 'Grade Published',
                        message: 'Your grade for Physics Quiz 2 is now available',
                        time: new Date(Date.now() - 2 * 3600000), // 2 hours ago
                        read: false,
                        path: '/dashboard/grades'
                    },
                    {
                        id: '3',
                        type: 'event',
                        title: 'College Event',
                        message: 'Annual Tech Fest registration opens tomorrow',
                        time: new Date(Date.now() - 24 * 3600000), // 1 day ago
                        read: true,
                        path: '/dashboard/events'
                    }
                ];
                
                setNotifications(mockNotifications);
                setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
                
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        
        fetchNotifications();
    }, []);

    // Format relative time for notifications
    const getRelativeTime = (date) => {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.round(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        
        const diffHours = Math.round(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hr ago`;
        
        const diffDays = Math.round(diffHours / 24);
        if (diffDays < 7) return `${diffDays} day ago`;
        
        return new Date(date).toLocaleDateString();
    };

    const handleProfileClick = () => {
        setShowProfileMenu(false);
        navigate('/dashboard/profile');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleNotificationClick = (notification) => {
        // Mark notification as read
        setNotifications(prev => prev.map(n => 
            n.id === notification.id ? {...n, read: true} : n
        ));
        
        // Update unread count
        setUnreadNotifications(prev => Math.max(0, prev - 1));
        
        setShowNotifications(false);
        navigate(notification.path);
    };

    // Get icon for notification type
    const getNotificationIcon = (type) => {
        switch(type) {
            case 'assignment': return 'ri-file-list-3-line';
            case 'grade': return 'ri-bar-chart-line';
            case 'event': return 'ri-calendar-event-line';
            case 'message': return 'ri-message-2-line';
            default: return 'ri-notification-line';
        }
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
                                className="relative p-2 rounded-xl hover:bg-indigo-500/20 text-indigo-400 transition-all duration-300"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="ri-notification-3-line text-xl" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-lg border border-slate-700/50 py-2 z-50 max-h-96 overflow-y-auto"
                                    >
                                        <div className="px-4 py-2 border-b border-slate-700/50">
                                            <h3 className="font-semibold text-white">Notifications</h3>
                                        </div>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 border-b border-slate-700/30 last:border-b-0 ${
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
                                                            <p className="text-slate-500 text-xs mt-1">
                                                                {getRelativeTime(notification.time)}
                                                            </p>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center text-slate-400">
                                                <i className="ri-notification-off-line text-2xl mb-2" />
                                                <p>No notifications</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-600/20 transition-all duration-300"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">
                                    {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-white">
                                        {userData?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {userData?.role || 'Student'}
                                    </p>
                                </div>
                                <i className={`ri-arrow-down-s-line text-slate-400 transition-transform duration-300 ${
                                    showProfileMenu ? 'rotate-180' : ''
                                }`} />
                            </button>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-gray-800 border border-slate-700/50 rounded-xl shadow-lg py-2 z-50"
                                    >
                                        <button 
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                navigate('/dashboard/profile');
                                            }}
                                            className="w-full flex items-center px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"
                                        >
                                            <i className="ri-user-line w-4 h-4 mr-2" />
                                            View Profile
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                navigate('/dashboard/settings');
                                            }}
                                            className="w-full flex items-center px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"
                                        >
                                            <i className="ri-settings-line w-4 h-4 mr-2" />
                                            Settings
                                        </button>
                                        <div className="h-px bg-slate-700/50 my-2" />
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                        >
                                            <i className="ri-logout-box-line w-4 h-4 mr-2" />
                                            Sign out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;