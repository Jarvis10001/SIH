import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';

const EventManagementPage = () => {
    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '09:00',
        endTime: '10:00',
        type: 'event',
        priority: 'medium',
        location: '',
        organizer: '',
        attendees: 0,
        category: 'Academic',
        isPublic: true,
        requiresRegistration: false,
        maxAttendees: '',
        tags: '',
        contactEmail: '',
        contactPhone: '',
        additionalInfo: ''
    });

    // Mock events data (would come from API)
    const mockEvents = [
        {
            id: 1,
            title: 'Mid-term Examinations Begin',
            description: 'All mid-term examinations for semester 5 will commence. Students are advised to arrive 30 minutes early.',
            date: '2025-10-05',
            time: '09:00',
            endTime: '12:00',
            type: 'exam',
            priority: 'high',
            location: 'Main Examination Hall',
            organizer: 'Academic Department',
            attendees: 450,
            category: 'Academic',
            isPublic: true,
            requiresRegistration: false,
            maxAttendees: 500,
            tags: 'exam, midterm, semester5',
            contactEmail: 'academics@college.edu',
            contactPhone: '555-0101',
            additionalInfo: 'Students must bring ID cards and stationery.',
            createdAt: '2025-09-15T10:00:00Z',
            updatedAt: '2025-09-20T14:30:00Z',
            status: 'active'
        },
        {
            id: 2,
            title: 'Tech Fest 2025 - Registration Opens',
            description: 'Annual technical festival registration is now open. Various competitions including coding, robotics, and innovation challenges.',
            date: '2025-10-01',
            time: '10:00',
            endTime: '18:00',
            type: 'event',
            priority: 'high',
            location: 'Student Activity Center',
            organizer: 'Tech Club',
            attendees: 200,
            category: 'Cultural',
            isPublic: true,
            requiresRegistration: true,
            maxAttendees: 300,
            tags: 'techfest, competition, coding, robotics',
            contactEmail: 'techclub@college.edu',
            contactPhone: '555-0102',
            additionalInfo: 'Registration fee: ₹100 per participant.',
            createdAt: '2025-09-10T09:00:00Z',
            updatedAt: '2025-09-18T11:15:00Z',
            status: 'active'
        },
        {
            id: 3,
            title: 'Faculty Meeting - Student Representatives',
            description: 'Monthly faculty-student council meeting to discuss academic policies and student welfare.',
            date: '2025-10-08',
            time: '14:00',
            endTime: '16:00',
            type: 'meeting',
            priority: 'medium',
            location: 'Conference Room A',
            organizer: 'Student Council',
            attendees: 25,
            category: 'Administrative',
            isPublic: false,
            requiresRegistration: false,
            maxAttendees: 30,
            tags: 'faculty, meeting, student council',
            contactEmail: 'council@college.edu',
            contactPhone: '555-0103',
            additionalInfo: 'Only invited members can attend.',
            createdAt: '2025-09-12T13:00:00Z',
            updatedAt: '2025-09-22T16:45:00Z',
            status: 'active'
        },
        {
            id: 4,
            title: 'Sports Day - Annual Athletics Meet',
            description: 'Inter-college sports competition featuring track and field events, team sports, and cultural performances.',
            date: '2025-10-15',
            time: '08:00',
            endTime: '17:00',
            type: 'event',
            priority: 'high',
            location: 'Sports Complex',
            organizer: 'Sports Department',
            attendees: 800,
            category: 'Sports',
            isPublic: true,
            requiresRegistration: true,
            maxAttendees: 1000,
            tags: 'sports, athletics, competition, inter-college',
            contactEmail: 'sports@college.edu',
            contactPhone: '555-0104',
            additionalInfo: 'Lunch will be provided for all participants.',
            createdAt: '2025-09-05T08:00:00Z',
            updatedAt: '2025-09-25T12:00:00Z',
            status: 'active'
        },
        {
            id: 5,
            title: 'Guest Lecture: AI in Healthcare',
            description: 'Industry expert Dr. Sarah Johnson will discuss the applications of Artificial Intelligence in modern healthcare.',
            date: '2025-10-12',
            time: '15:30',
            endTime: '17:00',
            type: 'lecture',
            priority: 'medium',
            location: 'Auditorium',
            organizer: 'Computer Science Department',
            attendees: 150,
            category: 'Academic',
            isPublic: true,
            requiresRegistration: false,
            maxAttendees: 200,
            tags: 'lecture, AI, healthcare, guest speaker',
            contactEmail: 'cs@college.edu',
            contactPhone: '555-0105',
            additionalInfo: 'Q&A session will follow the lecture.',
            createdAt: '2025-09-08T11:30:00Z',
            updatedAt: '2025-09-19T14:20:00Z',
            status: 'active'
        },
        {
            id: 6,
            title: 'Workshop: Web Development Bootcamp',
            description: '3-day intensive workshop on modern web development technologies including React, Node.js, and database management.',
            date: '2025-10-20',
            time: '09:00',
            endTime: '17:00',
            type: 'workshop',
            priority: 'medium',
            location: 'Computer Lab 1',
            organizer: 'IT Department',
            attendees: 30,
            category: 'Academic',
            isPublic: true,
            requiresRegistration: true,
            maxAttendees: 35,
            tags: 'workshop, web development, react, nodejs',
            contactEmail: 'it@college.edu',
            contactPhone: '555-0106',
            additionalInfo: 'Laptops will be provided. Bring your own notebooks.',
            createdAt: '2025-09-14T16:00:00Z',
            updatedAt: '2025-09-21T10:30:00Z',
            status: 'active'
        }
    ];

    useEffect(() => {
        setEvents(mockEvents);
    }, []);

    // Event type options
    const eventTypes = [
        { value: 'event', label: 'Event', icon: 'ri-calendar-event-line', color: 'bg-indigo-500' },
        { value: 'exam', label: 'Exam', icon: 'ri-file-text-line', color: 'bg-red-500' },
        { value: 'meeting', label: 'Meeting', icon: 'ri-team-line', color: 'bg-yellow-500' },
        { value: 'lecture', label: 'Lecture', icon: 'ri-presentation-line', color: 'bg-green-500' },
        { value: 'workshop', label: 'Workshop', icon: 'ri-tools-line', color: 'bg-purple-500' },
        { value: 'seminar', label: 'Seminar', icon: 'ri-mic-line', color: 'bg-blue-500' },
        { value: 'conference', label: 'Conference', icon: 'ri-group-line', color: 'bg-teal-500' },
        { value: 'notice', label: 'Notice', icon: 'ri-information-line', color: 'bg-gray-500' }
    ];

    const categories = ['Academic', 'Cultural', 'Sports', 'Administrative', 'Health', 'Library', 'Placements', 'Transport', 'Hostel', 'General'];
    const priorities = [
        { value: 'low', label: 'Low', color: 'text-green-400' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
        { value: 'high', label: 'High', color: 'text-red-400' },
        { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
    ];

    // Filter and search logic
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || event.type === filterType;
        const matchesPriority = filterPriority === 'all' || event.priority === filterPriority;
        const matchesCategory = filterCategory === 'all' || event.category === filterCategory;

        return matchesSearch && matchesType && matchesPriority && matchesCategory;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(a.date) - new Date(b.date);
            case 'title':
                return a.title.localeCompare(b.title);
            case 'priority':
                const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'attendees':
                return b.attendees - a.attendees;
            default:
                return 0;
        }
    });

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingEvent) {
            setEvents(prev => prev.map(event => 
                event.id === editingEvent.id 
                    ? { ...eventForm, id: editingEvent.id, updatedAt: new Date().toISOString() }
                    : event
            ));
        } else {
            const newEvent = {
                ...eventForm,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active'
            };
            setEvents(prev => [...prev, newEvent]);
        }

        resetForm();
        setShowEventModal(false);
    };

    const resetForm = () => {
        setEventForm({
            title: '',
            description: '',
            date: '',
            time: '09:00',
            endTime: '10:00',
            type: 'event',
            priority: 'medium',
            location: '',
            organizer: '',
            attendees: 0,
            category: 'Academic',
            isPublic: true,
            requiresRegistration: false,
            maxAttendees: '',
            tags: '',
            contactEmail: '',
            contactPhone: '',
            additionalInfo: ''
        });
        setEditingEvent(null);
    };

    const handleEdit = (event) => {
        setEventForm(event);
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleDelete = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(event => event.id !== eventId));
        }
    };

    const handleBulkDelete = () => {
        if (selectedEvents.length > 0 && window.confirm(`Delete ${selectedEvents.length} selected events?`)) {
            setEvents(prev => prev.filter(event => !selectedEvents.includes(event.id)));
            setSelectedEvents([]);
        }
    };

    const toggleEventSelection = (eventId) => {
        setSelectedEvents(prev => 
            prev.includes(eventId) 
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const getEventTypeIcon = (type) => {
        const eventType = eventTypes.find(t => t.value === type);
        return eventType ? eventType.icon : 'ri-calendar-line';
    };

    const getEventTypeColor = (type) => {
        const eventType = eventTypes.find(t => t.value === type);
        return eventType ? eventType.color : 'bg-gray-500';
    };

    const getPriorityColor = (priority) => {
        const priorityObj = priorities.find(p => p.value === priority);
        return priorityObj ? priorityObj.color : 'text-gray-400';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Statistics
    const stats = {
        total: events.length,
        upcoming: events.filter(e => new Date(e.date) >= new Date()).length,
        thisMonth: events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length,
        highPriority: events.filter(e => e.priority === 'high' || e.priority === 'urgent').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                        Event Management
                    </h1>
                    <p className={`${themeClasses.text.secondary} mt-1`}>
                        Create and manage events for the academic calendar
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowEventModal(true);
                    }}
                    className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg transition-colors flex items-center gap-2`}
                >
                    <i className="ri-add-line"></i>
                    Add Event
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'Total Events', value: stats.total, icon: 'ri-calendar-line', color: 'text-blue-400' },
                    { title: 'Upcoming', value: stats.upcoming, icon: 'ri-calendar-event-line', color: 'text-green-400' },
                    { title: 'This Month', value: stats.thisMonth, icon: 'ri-calendar-2-line', color: 'text-indigo-400' },
                    { title: 'High Priority', value: stats.highPriority, icon: 'ri-flag-line', color: 'text-red-400' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        className={`${themeClasses.primaryCard} p-4 rounded-lg`}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.title}</p>
                                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.value}</p>
                            </div>
                            <div className={`text-2xl ${stat.color}`}>
                                <i className={stat.icon}></i>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className={`${themeClasses.primaryCard} p-6 rounded-lg`}>
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted}`}></i>
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg`}
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={`px-3 py-2 ${themeClasses.input} rounded-lg`}
                        >
                            <option value="all">All Types</option>
                            {eventTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>

                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className={`px-3 py-2 ${themeClasses.input} rounded-lg`}
                        >
                            <option value="all">All Priorities</option>
                            {priorities.map(priority => (
                                <option key={priority.value} value={priority.value}>{priority.label}</option>
                            ))}
                        </select>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={`px-3 py-2 ${themeClasses.input} rounded-lg`}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`px-3 py-2 ${themeClasses.input} rounded-lg`}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="title">Sort by Title</option>
                            <option value="priority">Sort by Priority</option>
                            <option value="attendees">Sort by Attendees</option>
                        </select>

                        <div className={`flex rounded-lg overflow-hidden border ${themeClasses.border}`}>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 ${viewMode === 'grid' ? themeClasses.button.primary : themeClasses.button.secondary}`}
                            >
                                <i className="ri-grid-line"></i>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 ${viewMode === 'list' ? themeClasses.button.primary : themeClasses.button.secondary}`}
                            >
                                <i className="ri-list-unordered"></i>
                            </button>
                        </div>
                    </div>

                    {selectedEvents.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${themeClasses.text.secondary}`}>
                                {selectedEvents.length} selected
                            </span>
                            <button
                                onClick={handleBulkDelete}
                                className={`px-3 py-1 text-sm ${themeClasses.button.danger} rounded`}
                            >
                                Delete Selected
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Events Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                <AnimatePresence>
                    {filteredEvents.map(event => (
                        <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`${themeClasses.primaryCard} rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                                viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                            }`}
                        >
                            {viewMode === 'grid' ? (
                                // Grid View
                                <>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg ${getEventTypeColor(event.type)} flex items-center justify-center`}>
                                                <i className={`${getEventTypeIcon(event.type)} text-white text-lg`}></i>
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold ${themeClasses.text.primary} line-clamp-1`}>
                                                    {event.title}
                                                </h3>
                                                <div className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary}`}>
                                                    <span className={getPriorityColor(event.priority)}>
                                                        {event.priority}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{event.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedEvents.includes(event.id)}
                                                onChange={() => toggleEventSelection(event.id)}
                                                className="rounded border-gray-600 bg-gray-700"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="relative group">
                                                <button className={`p-1 rounded hover:bg-gray-700`}>
                                                    <i className="ri-more-2-line"></i>
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(event);
                                                        }}
                                                        className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
                                                    >
                                                        <i className="ri-edit-line mr-2"></i>Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(event.id);
                                                        }}
                                                        className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                                                    >
                                                        <i className="ri-delete-bin-line mr-2"></i>Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className={`text-sm ${themeClasses.text.secondary} mb-4 line-clamp-2`}>
                                        {event.description}
                                    </p>

                                    <div className={`text-sm ${themeClasses.text.muted} space-y-2`}>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-calendar-line text-indigo-400"></i>
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-time-line text-indigo-400"></i>
                                            <span>{formatTime(event.time)} - {formatTime(event.endTime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-map-pin-line text-indigo-400"></i>
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-group-line text-indigo-400"></i>
                                            <span>{event.attendees} attendees</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            event.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {event.isPublic ? 'Public' : 'Private'}
                                        </span>
                                        <span className={`text-xs ${themeClasses.text.muted}`}>
                                            {event.organizer}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                // List View
                                <>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.includes(event.id)}
                                            onChange={() => toggleEventSelection(event.id)}
                                            className="rounded border-gray-600 bg-gray-700"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className={`w-8 h-8 rounded ${getEventTypeColor(event.type)} flex items-center justify-center`}>
                                            <i className={`${getEventTypeIcon(event.type)} text-white text-sm`}></i>
                                        </div>
                                    </div>

                                    <div className="flex-1 ml-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-semibold ${themeClasses.text.primary}`}>
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className={getPriorityColor(event.priority)}>
                                                    {event.priority}
                                                </span>
                                                <span className={themeClasses.text.secondary}>
                                                    {formatDate(event.date)}
                                                </span>
                                                <span className={themeClasses.text.secondary}>
                                                    {formatTime(event.time)}
                                                </span>
                                                <span className={themeClasses.text.muted}>
                                                    {event.location}
                                                </span>
                                                <span className={themeClasses.text.muted}>
                                                    {event.attendees} attendees
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm ${themeClasses.text.secondary} mt-1 line-clamp-1`}>
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(event);
                                            }}
                                            className={`p-2 rounded hover:bg-gray-700 ${themeClasses.text.secondary}`}
                                        >
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(event.id);
                                            }}
                                            className="p-2 rounded hover:bg-gray-700 text-red-400"
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <i className="ri-calendar-line text-6xl text-gray-500 mb-4 block"></i>
                    <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-2`}>
                        No events found
                    </h3>
                    <p className={themeClasses.text.secondary}>
                        {searchTerm || filterType !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first event to get started'
                        }
                    </p>
                </div>
            )}

            {/* Event Modal */}
            <AnimatePresence>
                {showEventModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            className={`${themeClasses.primaryCard} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="p-6 border-b border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                        {editingEvent ? 'Edit Event' : 'Create New Event'}
                                    </h3>
                                    <button
                                        onClick={() => setShowEventModal(false)}
                                        className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600`}
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Event Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={eventForm.title}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="Enter event title"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Event Type *
                                        </label>
                                        <select
                                            name="type"
                                            value={eventForm.type}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        >
                                            {eventTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={eventForm.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={3}
                                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        placeholder="Enter event description"
                                    />
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={eventForm.date}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Start Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={eventForm.time}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            End Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={eventForm.endTime}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        />
                                    </div>
                                </div>

                                {/* Location and Organization */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={eventForm.location}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="Enter event location"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Organizer *
                                        </label>
                                        <input
                                            type="text"
                                            name="organizer"
                                            value={eventForm.organizer}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="Enter organizer name"
                                        />
                                    </div>
                                </div>

                                {/* Category and Priority */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={eventForm.category}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Priority *
                                        </label>
                                        <select
                                            name="priority"
                                            value={eventForm.priority}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        >
                                            {priorities.map(priority => (
                                                <option key={priority.value} value={priority.value}>{priority.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Expected Attendees
                                        </label>
                                        <input
                                            type="number"
                                            name="attendees"
                                            value={eventForm.attendees}
                                            onChange={handleInputChange}
                                            min="0"
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="Number of attendees"
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={eventForm.contactEmail}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="contact@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={eventForm.contactPhone}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>

                                {/* Registration Settings */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Max Attendees (if limited)
                                        </label>
                                        <input
                                            type="number"
                                            name="maxAttendees"
                                            value={eventForm.maxAttendees}
                                            onChange={handleInputChange}
                                            min="1"
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="Maximum number of attendees"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={eventForm.tags}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                            placeholder="tag1, tag2, tag3"
                                        />
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div className="flex flex-wrap gap-6">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isPublic"
                                            checked={eventForm.isPublic}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-600 bg-gray-700"
                                        />
                                        <span className={`text-sm ${themeClasses.text.primary}`}>Public Event</span>
                                    </label>

                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="requiresRegistration"
                                            checked={eventForm.requiresRegistration}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-600 bg-gray-700"
                                        />
                                        <span className={`text-sm ${themeClasses.text.primary}`}>Requires Registration</span>
                                    </label>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                                        Additional Information
                                    </label>
                                    <textarea
                                        name="additionalInfo"
                                        value={eventForm.additionalInfo}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg`}
                                        placeholder="Any additional information or instructions"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowEventModal(false)}
                                        className={`px-6 py-2 ${themeClasses.button.secondary} rounded-lg transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`px-6 py-2 ${themeClasses.button.primary} rounded-lg transition-colors`}
                                    >
                                        {editingEvent ? 'Update Event' : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventManagementPage;