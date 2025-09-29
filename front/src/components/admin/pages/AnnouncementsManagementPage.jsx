import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';

const AnnouncementsManagementPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        content: '',
        category: 'academic',
        priority: 'medium',
        targetAudience: ['all'],
        publishDate: '',
        expiryDate: '',
        attachments: [],
        tags: [],
        isActive: true
    });

    // Mock data
    const mockAnnouncements = [
        {
            id: 1,
            title: 'Mid-Term Examinations Schedule Released',
            content: 'The mid-term examination schedule for the current semester has been released. Students are advised to check their individual timetables and prepare accordingly.',
            category: 'academic',
            priority: 'high',
            targetAudience: ['students'],
            publishDate: '2025-09-25',
            expiryDate: '2025-10-15',
            author: 'Academic Office',
            publishedDate: '2025-09-25',
            views: 1250,
            isActive: true,
            attachments: ['midterm_schedule.pdf'],
            tags: ['exams', 'schedule', 'midterm'],
            branches: ['All Branches']
        },
        {
            id: 2,
            title: 'Annual Cultural Fest - Technova 2025',
            content: 'We are excited to announce our annual cultural festival Technova 2025. Registration is now open for various events including technical competitions, cultural performances, and sports activities.',
            category: 'events',
            priority: 'medium',
            targetAudience: ['students', 'faculty'],
            publishDate: '2025-09-20',
            expiryDate: '2025-11-30',
            author: 'Student Affairs',
            publishedDate: '2025-09-20',
            views: 890,
            isActive: true,
            attachments: ['technova_brochure.pdf', 'registration_form.pdf'],
            tags: ['fest', 'cultural', 'technical', 'sports'],
            branches: ['All Branches']
        },
        {
            id: 3,
            title: 'Library Timing Changes - Weekend Hours',
            content: 'Due to maintenance work, the library will have modified timings on weekends for the next two weeks. Saturday: 9 AM - 5 PM, Sunday: Closed.',
            category: 'library',
            priority: 'medium',
            targetAudience: ['students', 'faculty'],
            publishDate: '2025-09-28',
            expiryDate: '2025-10-12',
            author: 'Library Department',
            publishedDate: '2025-09-28',
            views: 456,
            isActive: true,
            attachments: [],
            tags: ['library', 'timings', 'weekend'],
            branches: ['All Branches']
        },
        {
            id: 4,
            title: 'Faculty Meeting - Curriculum Review',
            content: 'Monthly faculty meeting scheduled for curriculum review and updates. All department heads are requested to attend with their feedback reports.',
            category: 'administration',
            priority: 'high',
            targetAudience: ['faculty'],
            publishDate: '2025-09-29',
            expiryDate: '2025-10-05',
            author: 'Administration',
            publishedDate: '2025-09-29',
            views: 85,
            isActive: true,
            attachments: ['agenda.pdf'],
            tags: ['faculty', 'meeting', 'curriculum'],
            branches: ['All Departments']
        },
        {
            id: 5,
            title: 'Campus Placement Drive - IT Companies',
            content: 'Major IT companies including TCS, Infosys, and Wipro will be conducting placement drives next month. Eligible students should register through the placement portal.',
            category: 'placements',
            priority: 'high',
            targetAudience: ['students'],
            publishDate: '2025-09-27',
            expiryDate: '2025-10-30',
            author: 'Placement Cell',
            publishedDate: '2025-09-27',
            views: 1850,
            isActive: true,
            attachments: ['company_profiles.pdf', 'eligibility_criteria.pdf'],
            tags: ['placements', 'IT', 'TCS', 'Infosys', 'Wipro'],
            branches: ['CSE', 'IT', 'ECE']
        },
        {
            id: 6,
            title: 'Hostel Maintenance Notice',
            content: 'Scheduled maintenance work in Block A hostels from 10 AM to 4 PM this Saturday. Water supply will be temporarily affected.',
            category: 'hostel',
            priority: 'medium',
            targetAudience: ['students'],
            publishDate: '2025-09-26',
            expiryDate: '2025-10-01',
            author: 'Hostel Management',
            publishedDate: '2025-09-26',
            views: 320,
            isActive: true,
            attachments: [],
            tags: ['hostel', 'maintenance', 'water'],
            branches: ['All Branches']
        }
    ];

    const categories = [
        { value: 'academic', label: 'Academic', icon: 'ri-graduation-cap-line' },
        { value: 'events', label: 'Events & Activities', icon: 'ri-calendar-event-line' },
        { value: 'administration', label: 'Administration', icon: 'ri-building-line' },
        { value: 'placements', label: 'Placements', icon: 'ri-briefcase-line' },
        { value: 'library', label: 'Library', icon: 'ri-book-2-line' },
        { value: 'hostel', label: 'Hostel', icon: 'ri-building-2-line' },
        { value: 'health', label: 'Health & Wellness', icon: 'ri-heart-pulse-line' },
        { value: 'sports', label: 'Sports', icon: 'ri-football-line' },
        { value: 'transport', label: 'Transport', icon: 'ri-bus-line' },
        { value: 'general', label: 'General', icon: 'ri-megaphone-line' }
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-green-400', bgColor: 'bg-green-500/20' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
        { value: 'high', label: 'High', color: 'text-red-400', bgColor: 'bg-red-500/20' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-500', bgColor: 'bg-red-600/20' }
    ];

    const targetAudiences = [
        { value: 'all', label: 'Everyone' },
        { value: 'students', label: 'Students' },
        { value: 'faculty', label: 'Faculty' },
        { value: 'staff', label: 'Staff' },
        { value: 'parents', label: 'Parents' }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setAnnouncements(mockAnnouncements);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || announcement.category === filterCategory;
        const matchesPriority = !filterPriority || announcement.priority === filterPriority;
        const matchesStatus = !filterStatus || (filterStatus === 'active' ? announcement.isActive : !announcement.isActive);
        
        return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });

    const handleAnnouncementSubmit = () => {
        if (selectedAnnouncement) {
            setAnnouncements(announcements.map(announcement =>
                announcement.id === selectedAnnouncement.id
                    ? { 
                        ...announcement, 
                        ...announcementForm, 
                        id: selectedAnnouncement.id,
                        publishedDate: selectedAnnouncement.publishedDate,
                        views: selectedAnnouncement.views
                      }
                    : announcement
            ));
        } else {
            const newAnnouncement = {
                ...announcementForm,
                id: Date.now(),
                author: 'Administrator',
                publishedDate: new Date().toISOString().split('T')[0],
                views: 0,
                branches: ['All Branches']
            };
            setAnnouncements([newAnnouncement, ...announcements]);
        }
        setShowAnnouncementModal(false);
        resetForm();
    };

    const resetForm = () => {
        setAnnouncementForm({
            title: '',
            content: '',
            category: 'academic',
            priority: 'medium',
            targetAudience: ['all'],
            publishDate: '',
            expiryDate: '',
            attachments: [],
            tags: [],
            isActive: true
        });
        setSelectedAnnouncement(null);
    };

    const handleEditAnnouncement = (announcement) => {
        setAnnouncementForm(announcement);
        setSelectedAnnouncement(announcement);
        setShowAnnouncementModal(true);
    };

    const handleDeleteAnnouncement = (announcementId) => {
        setAnnouncements(announcements.filter(announcement => announcement.id !== announcementId));
    };

    const handleToggleStatus = (announcementId) => {
        setAnnouncements(announcements.map(announcement =>
            announcement.id === announcementId
                ? { ...announcement, isActive: !announcement.isActive }
                : announcement
        ));
    };

    const getCategoryInfo = (category) => {
        return categories.find(cat => cat.value === category) || { label: category, icon: 'ri-megaphone-line' };
    };

    const getPriorityInfo = (priority) => {
        return priorities.find(p => p.value === priority) || { label: priority, color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const StatCard = ({ title, value, icon, color = 'indigo', description }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.primaryCard} p-6 rounded-xl`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.text.secondary} text-sm font-medium`}>{title}</p>
                    <p className={`${themeClasses.text.primary} text-2xl font-bold mt-1`}>{value}</p>
                    {description && (
                        <p className={`${themeClasses.text.muted} text-xs mt-1`}>{description}</p>
                    )}
                </div>
                <div className={`h-12 w-12 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
                    <i className={`${icon} text-xl text-${color}-400`}></i>
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                    <p className={themeClasses.text.secondary}>Loading announcements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                        Announcements Management
                    </h1>
                    <p className={`${themeClasses.text.secondary} mt-1`}>
                        Create and manage announcements for students, faculty and staff
                    </p>
                </div>
                <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                    <i className="ri-megaphone-line"></i>
                    Create Announcement
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Announcements"
                    value={announcements.length}
                    icon="ri-megaphone-line"
                    color="indigo"
                    description="All announcements"
                />
                <StatCard
                    title="Active"
                    value={announcements.filter(a => a.isActive).length}
                    icon="ri-checkbox-circle-line"
                    color="green"
                    description="Currently visible"
                />
                <StatCard
                    title="High Priority"
                    value={announcements.filter(a => a.priority === 'high' || a.priority === 'urgent').length}
                    icon="ri-error-warning-line"
                    color="red"
                    description="Important notices"
                />
                <StatCard
                    title="Total Views"
                    value={announcements.reduce((acc, a) => acc + a.views, 0)}
                    icon="ri-eye-line"
                    color="blue"
                    description="Total engagement"
                />
            </div>

            {/* Filters */}
            <div className={`${themeClasses.primaryCard} p-6 rounded-xl`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>
                            Search Announcements
                        </label>
                        <div className="relative">
                            <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses.primary}`}></i>
                            <input
                                type="text"
                                placeholder="Search by title or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Priority</label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                        >
                            <option value="">All Priorities</option>
                            {priorities.map(priority => (
                                <option key={priority.value} value={priority.value}>{priority.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredAnnouncements.map((announcement) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`${themeClasses.primaryCard} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`h-12 w-12 rounded-xl ${getPriorityInfo(announcement.priority).bgColor} flex items-center justify-center`}>
                                            <i className={`${getCategoryInfo(announcement.category).icon} text-xl ${getPriorityInfo(announcement.priority).color}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                                    {announcement.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityInfo(announcement.priority).bgColor} ${getPriorityInfo(announcement.priority).color}`}>
                                                    {getPriorityInfo(announcement.priority).label}
                                                </span>
                                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${announcement.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                    {announcement.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <i className={getCategoryInfo(announcement.category).icon}></i>
                                                    {getCategoryInfo(announcement.category).label}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="ri-calendar-line"></i>
                                                    {formatDate(announcement.publishDate)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="ri-eye-line"></i>
                                                    {announcement.views} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="ri-user-line"></i>
                                                    {announcement.author}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className={`${themeClasses.text.secondary} mb-4 line-clamp-3`}>
                                        {announcement.content}
                                    </p>

                                    {/* Tags and Attachments */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {announcement.tags.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm ${themeClasses.text.muted}`}>Tags:</span>
                                                    <div className="flex gap-1">
                                                        {announcement.tags.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-gray-600/50 text-xs text-slate-300 rounded-lg"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {announcement.tags.length > 3 && (
                                                            <span className="text-xs text-slate-500">+{announcement.tags.length - 3}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {announcement.attachments.length > 0 && (
                                                <span className={`text-sm ${themeClasses.text.muted} flex items-center gap-1`}>
                                                    <i className="ri-attachment-line"></i>
                                                    {announcement.attachments.length} files
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${themeClasses.text.muted}`}>
                                                Target: {announcement.targetAudience.join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleToggleStatus(announcement.id)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            announcement.isActive 
                                                ? 'text-yellow-400 hover:bg-yellow-500/20' 
                                                : 'text-green-400 hover:bg-green-500/20'
                                        }`}
                                        title={announcement.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        <i className={announcement.isActive ? 'ri-pause-circle-line' : 'ri-play-circle-line'}></i>
                                    </button>
                                    <button
                                        onClick={() => handleEditAnnouncement(announcement)}
                                        className={`p-2 rounded-lg ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}
                                        title="Edit announcement"
                                    >
                                        <i className="ri-edit-line"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                        title="Delete announcement"
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredAnnouncements.length === 0 && (
                <div className={`${themeClasses.primaryCard} rounded-xl p-12 text-center`}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/20 mb-4">
                        <i className={`ri-megaphone-line text-2xl ${themeClasses.text.muted}`}></i>
                    </div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                        No announcements found
                    </h3>
                    <p className={`${themeClasses.text.secondary} mb-6`}>
                        {searchTerm || filterCategory || filterPriority || filterStatus
                            ? 'Try adjusting your search filters.'
                            : 'Get started by creating your first announcement.'}
                    </p>
                    {!searchTerm && !filterCategory && !filterPriority && !filterStatus && (
                        <button
                            onClick={() => setShowAnnouncementModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors mx-auto"
                        >
                            <i className="ri-megaphone-line"></i>
                            Create First Announcement
                        </button>
                    )}
                </div>
            )}

            {/* Announcement Modal */}
            <AnimatePresence>
                {showAnnouncementModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
                        onClick={() => setShowAnnouncementModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${themeClasses.primaryCard} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
                        >
                            {/* Header */}
                            <div className={`p-6 border-b ${themeClasses.border}`}>
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                        {selectedAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                                    </h2>
                                    <button
                                        onClick={() => setShowAnnouncementModal(false)}
                                        className={`p-2 rounded-xl ${themeClasses.text.secondary} hover:bg-gray-700/50 transition-colors`}
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Announcement Title *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter announcement title"
                                                value={announcementForm.title}
                                                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Content *
                                            </label>
                                            <textarea
                                                placeholder="Enter announcement content"
                                                value={announcementForm.content}
                                                onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors h-32 resize-none`}
                                            />
                                        </div>
                                    </div>

                                    {/* Category and Priority */}
                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Category *
                                        </label>
                                        <select
                                            value={announcementForm.category}
                                            onChange={(e) => setAnnouncementForm({...announcementForm, category: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                        >
                                            {categories.map(category => (
                                                <option key={category.value} value={category.value}>{category.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Priority *
                                        </label>
                                        <select
                                            value={announcementForm.priority}
                                            onChange={(e) => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                        >
                                            {priorities.map(priority => (
                                                <option key={priority.value} value={priority.value}>{priority.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Publish Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={announcementForm.publishDate}
                                            onChange={(e) => setAnnouncementForm({...announcementForm, publishDate: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            value={announcementForm.expiryDate}
                                            onChange={(e) => setAnnouncementForm({...announcementForm, expiryDate: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                        />
                                    </div>

                                    {/* Target Audience */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Target Audience *
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                            {targetAudiences.map(audience => (
                                                <label key={audience.value} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={announcementForm.targetAudience.includes(audience.value)}
                                                        onChange={(e) => {
                                                            const audiences = e.target.checked
                                                                ? [...announcementForm.targetAudience, audience.value]
                                                                : announcementForm.targetAudience.filter(a => a !== audience.value);
                                                            setAnnouncementForm({...announcementForm, targetAudience: audiences});
                                                        }}
                                                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className={`text-sm ${themeClasses.text.primary}`}>{audience.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={announcementForm.isActive}
                                                onChange={(e) => setAnnouncementForm({...announcementForm, isActive: e.target.checked})}
                                                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className={`text-sm ${themeClasses.text.primary} font-medium`}>
                                                Publish immediately (make active)
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={`p-6 border-t ${themeClasses.border}`}>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setShowAnnouncementModal(false)}
                                        className={`px-6 py-3 border ${themeClasses.border} rounded-xl ${themeClasses.text.secondary} font-medium hover:bg-gray-700 transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAnnouncementSubmit}
                                        disabled={!announcementForm.title || !announcementForm.content}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {selectedAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnnouncementsManagementPage;