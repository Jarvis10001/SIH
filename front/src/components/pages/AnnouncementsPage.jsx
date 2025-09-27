import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../styles/theme';

const AnnouncementsPage = () => {
    const [activeView, setActiveView] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock data for demonstration
    useEffect(() => {
        setAnnouncements([
            {
                id: 1,
                title: 'Mid-Term Examinations Schedule Released',
                content: 'The mid-term examination schedule for all courses has been published. Please check your respective course portals for detailed timing and venue information. All students are required to carry their ID cards and admit cards.',
                category: 'academic',
                priority: 'high',
                author: 'Academic Office',
                publishedDate: '2024-09-25',
                tags: ['examinations', 'mid-term', 'schedule'],
                isRead: false,
                attachments: ['midterm_schedule.pdf'],
                views: 1247
            },
            {
                id: 2,
                title: 'Library New Book Collection Available',
                content: 'The library has received a new collection of books on Machine Learning, Artificial Intelligence, and Data Science. Students can now issue these books through the library management system. Special collection includes latest publications from MIT Press and O\'Reilly.',
                category: 'library',
                priority: 'medium',
                author: 'Library Department',
                publishedDate: '2024-09-24',
                tags: ['library', 'books', 'collection'],
                isRead: true,
                attachments: ['new_books_list.pdf'],
                views: 856
            },
            {
                id: 3,
                title: 'Campus Fest 2024 - Registration Open',
                content: 'Annual campus festival "TechnoVision 2024" registration is now open! Join us for 3 days of cultural events, technical competitions, workshops, and performances. Early bird registration discount available until September 30th.',
                category: 'events',
                priority: 'medium',
                author: 'Student Activities Committee',
                publishedDate: '2024-09-23',
                tags: ['fest', 'registration', 'cultural', 'technical'],
                isRead: false,
                attachments: ['fest_brochure.pdf', 'registration_form.pdf'],
                views: 2105
            },
            {
                id: 4,
                title: 'Fee Payment Deadline Extension',
                content: 'Due to technical issues with the payment gateway, the fee payment deadline has been extended by 7 days. New deadline: October 5th, 2024. No late fees will be charged for payments made before the extended deadline.',
                category: 'administration',
                priority: 'high',
                author: 'Finance Office',
                publishedDate: '2024-09-22',
                tags: ['fee', 'payment', 'deadline'],
                isRead: true,
                attachments: [],
                views: 1893
            },
            {
                id: 5,
                title: 'Placement Drive - Tech Giants Coming to Campus',
                content: 'Major tech companies including Google, Microsoft, Amazon, and IBM will be conducting placement drives on campus from October 15-25. Final year students should register through the placement portal by October 1st.',
                category: 'placements',
                priority: 'high',
                author: 'Placement Cell',
                publishedDate: '2024-09-21',
                tags: ['placements', 'companies', 'registration'],
                isRead: false,
                attachments: ['company_details.pdf', 'eligibility_criteria.pdf'],
                views: 3247
            },
            {
                id: 6,
                title: 'Hostel Room Allocation - Second Round',
                content: 'Second round of hostel room allocation will begin on September 28th. Students who missed the first round can apply now. Limited rooms available on first-come-first-served basis.',
                category: 'hostel',
                priority: 'medium',
                author: 'Hostel Management',
                publishedDate: '2024-09-20',
                tags: ['hostel', 'allocation', 'rooms'],
                isRead: true,
                attachments: ['hostel_rules.pdf'],
                views: 967
            },
            {
                id: 7,
                title: 'Guest Lecture Series on Quantum Computing',
                content: 'Distinguished professor Dr. Sarah Chen from MIT will deliver a series of lectures on Quantum Computing fundamentals and applications. Sessions will be held in the main auditorium from October 2-4.',
                category: 'academic',
                priority: 'low',
                author: 'Computer Science Department',
                publishedDate: '2024-09-19',
                tags: ['guest lecture', 'quantum computing', 'MIT'],
                isRead: false,
                attachments: ['lecture_schedule.pdf'],
                views: 678
            },
            {
                id: 8,
                title: 'Health and Wellness Week',
                content: 'College health center is organizing a Health and Wellness Week from September 30 to October 6. Free health check-ups, mental health counseling, and wellness workshops will be available for all students.',
                category: 'health',
                priority: 'low',
                author: 'Health Center',
                publishedDate: '2024-09-18',
                tags: ['health', 'wellness', 'check-up'],
                isRead: true,
                attachments: ['wellness_schedule.pdf'],
                views: 543
            }
        ]);
    }, []);

    const inputClasses = `
        w-full p-3 rounded-xl 
        bg-gray-700 border-2 border-slate-600
        focus:border-indigo-500
        focus:ring-4 focus:ring-indigo-500/10 
        focus:bg-gray-600
        hover:border-indigo-500/30
        transition-all duration-300 ease-in-out
        text-white placeholder-slate-400
        focus:placeholder-indigo-400/70
        focus:shadow-lg focus:shadow-indigo-500/5
        outline-none
    `;

    const categories = [
        { id: 'all', name: 'All Announcements', icon: 'ri-megaphone-line', count: announcements.length },
        { id: 'academic', name: 'Academic', icon: 'ri-book-open-line', count: announcements.filter(a => a.category === 'academic').length },
        { id: 'events', name: 'Events', icon: 'ri-calendar-event-line', count: announcements.filter(a => a.category === 'events').length },
        { id: 'administration', name: 'Administration', icon: 'ri-building-line', count: announcements.filter(a => a.category === 'administration').length },
        { id: 'placements', name: 'Placements', icon: 'ri-briefcase-line', count: announcements.filter(a => a.category === 'placements').length },
        { id: 'library', name: 'Library', icon: 'ri-book-2-line', count: announcements.filter(a => a.category === 'library').length },
        { id: 'hostel', name: 'Hostel', icon: 'ri-building-2-line', count: announcements.filter(a => a.category === 'hostel').length },
        { id: 'health', name: 'Health & Wellness', icon: 'ri-heart-pulse-line', count: announcements.filter(a => a.category === 'health').length }
    ];

    const getPriorityColor = (priority) => {
        const priorityColors = {
            'high': 'text-red-300 bg-red-500/20 border-red-500/30',
            'medium': 'text-amber-300 bg-amber-500/20 border-amber-500/30',
            'low': 'text-green-300 bg-green-500/20 border-green-500/30'
        };
        return priorityColors[priority] || 'text-slate-300 bg-slate-500/20 border-slate-500/30';
    };

    const getCategoryIcon = (category) => {
        const categoryIcons = {
            'academic': 'ri-book-open-line',
            'events': 'ri-calendar-event-line',
            'administration': 'ri-building-line',
            'placements': 'ri-briefcase-line',
            'library': 'ri-book-2-line',
            'hostel': 'ri-building-2-line',
            'health': 'ri-heart-pulse-line'
        };
        return categoryIcons[category] || 'ri-megaphone-line';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
        const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             announcement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const unreadCount = announcements.filter(a => !a.isRead).length;
    const highPriorityCount = announcements.filter(a => a.priority === 'high' && !a.isRead).length;

    const markAsRead = (announcementId) => {
        setAnnouncements(prev => prev.map(announcement => 
            announcement.id === announcementId 
                ? { ...announcement, isRead: true }
                : announcement
        ));
    };

    const renderAnnouncementCard = (announcement) => (
        <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.primaryCard} cursor-pointer transition-all duration-300 hover:shadow-lg ${
                !announcement.isRead ? 'border-indigo-500/30' : ''
            }`}
            onClick={() => markAsRead(announcement.id)}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        announcement.priority === 'high' ? 'bg-red-500/20 border border-red-500/30' :
                        announcement.priority === 'medium' ? 'bg-amber-500/20 border border-amber-500/30' :
                        'bg-emerald-500/20 border border-emerald-500/30'
                    }`}>
                        <i className={`${getCategoryIcon(announcement.category)} text-lg ${
                            announcement.priority === 'high' ? iconClasses.danger :
                            announcement.priority === 'medium' ? iconClasses.warning :
                            iconClasses.success
                        }`}></i>
                    </div>
                    <div className="flex items-center gap-2">
                        {!announcement.isRead && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        )}
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">{formatDate(announcement.publishedDate)}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <i className="ri-eye-line"></i>
                        {announcement.views}
                    </p>
                </div>
            </div>

            <h3 className={`text-lg font-semibold mb-2 ${!announcement.isRead ? 'text-white' : 'text-slate-200'}`}>
                {announcement.title}
            </h3>

            <p className="text-slate-400 mb-3 line-clamp-2">
                {announcement.content}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">By {announcement.author}</span>
                    {announcement.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                            <i className="ri-attachment-line"></i>
                            {announcement.attachments.length}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {announcement.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700/50 text-xs text-slate-400 rounded-lg">
                            #{tag}
                        </span>
                    ))}
                    {announcement.tags.length > 2 && (
                        <span className="text-xs text-slate-500">+{announcement.tags.length - 2}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Total Announcements</p>
                            <p className="text-3xl font-bold text-white">{announcements.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-megaphone-line ${iconClasses.primary} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Unread</p>
                            <p className="text-3xl font-bold text-white">{unreadCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-notification-line ${iconClasses.warning} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>High Priority</p>
                            <p className="text-3xl font-bold text-white">{highPriorityCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-error-warning-line ${iconClasses.danger} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>This Week</p>
                            <p className="text-3xl font-bold text-white">
                                {announcements.filter(a => {
                                    const date = new Date(a.publishedDate);
                                    const weekAgo = new Date();
                                    weekAgo.setDate(weekAgo.getDate() - 7);
                                    return date >= weekAgo;
                                }).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-calendar-check-line ${iconClasses.success} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Categories */}
            <div className={themeClasses.primaryCard}>
                <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {categories.filter(cat => cat.count > 0).map((category) => (
                        <button
                            key={category.id}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setActiveView('filtered');
                            }}
                            className="p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-xl border border-slate-600/30 text-left transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <i className={`${category.icon} text-lg ${iconClasses.primary} group-hover:text-indigo-300`}></i>
                                    <span className="text-white group-hover:text-slate-200">{category.name}</span>
                                </div>
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-lg">
                                    {category.count}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Announcements */}
            <div className={themeClasses.primaryCard}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={themeClasses.secondaryHeading}>Recent Announcements</h3>
                    <button
                        onClick={() => setActiveView('all')}
                        className={`${themeClasses.secondaryButton} px-4 py-2 text-sm`}
                    >
                        View All
                    </button>
                </div>
                <div className="space-y-4">
                    {announcements.slice(0, 3).map(announcement => renderAnnouncementCard(announcement))}
                </div>
            </div>
        </div>
    );

    const renderAllAnnouncements = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>
                    {selectedCategory === 'all' ? 'All Announcements' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            {/* Search and Filters */}
            <div className={themeClasses.primaryCard}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`${inputClasses} min-w-40`}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.count})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map(announcement => renderAnnouncementCard(announcement))
                ) : (
                    <div className={`${themeClasses.primaryCard} text-center py-12`}>
                        <i className={`ri-inbox-line text-6xl ${iconClasses.muted} mb-4`}></i>
                        <h3 className="text-xl font-semibold text-white mb-2">No Announcements Found</h3>
                        <p className="text-slate-400">
                            {searchQuery ? 'No announcements match your search criteria.' : 'No announcements in this category.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={themeClasses.primaryHeading}>Announcements</h1>
                    <p className={themeClasses.bodyText}>Stay updated with the latest college announcements and notices</p>
                </div>
                {unreadCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                        <i className="ri-notification-line text-indigo-400"></i>
                        <span className="text-indigo-300 text-sm font-medium">{unreadCount} unread</span>
                    </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                    { id: 'all', label: 'All Announcements', icon: 'ri-list-check-line' },
                    { id: 'unread', label: 'Unread', icon: 'ri-notification-line' },
                    { id: 'important', label: 'Important', icon: 'ri-star-line' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                            activeView === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-700/30 text-slate-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                    >
                        <i className={tab.icon}></i>
                        {tab.label}
                        {tab.id === 'unread' && unreadCount > 0 && (
                            <span className="px-2 py-1 bg-amber-500 text-amber-900 text-xs rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeView === 'dashboard' && renderDashboard()}
                    {(activeView === 'all' || activeView === 'filtered') && renderAllAnnouncements()}
                    {activeView === 'unread' && (
                        <div className="space-y-4">
                            <h2 className={themeClasses.secondaryHeading}>Unread Announcements</h2>
                            {announcements.filter(a => !a.isRead).map(announcement => renderAnnouncementCard(announcement))}
                        </div>
                    )}
                    {activeView === 'important' && (
                        <div className="space-y-4">
                            <h2 className={themeClasses.secondaryHeading}>Important Announcements</h2>
                            {announcements.filter(a => a.priority === 'high').map(announcement => renderAnnouncementCard(announcement))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AnnouncementsPage;