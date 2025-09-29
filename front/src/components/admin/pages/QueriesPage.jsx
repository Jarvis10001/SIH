import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';

const QueriesPage = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showQueryDetails, setShowQueryDetails] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    
    const [responseForm, setResponseForm] = useState({
        message: '',
        status: 'In Progress',
        assignTo: ''
    });

    // Mock data
    const mockQueries = [
        {
            id: 1,
            title: 'Grade Correction Request for CS301',
            category: 'Academic',
            priority: 'High',
            status: 'In Progress',
            description: 'There seems to be an error in my mid-term examination grade for Data Structures & Algorithms. I scored 85 marks but it shows 58 in the portal.',
            student: {
                name: 'John Smith',
                rollNo: 'CS2021001',
                branch: 'CSE-A',
                semester: 5,
                email: 'john.smith@student.edu',
                phone: '+91-9876543210'
            },
            submittedDate: '2025-09-25',
            lastUpdated: '2025-09-26',
            assignedTo: 'Academic Office',
            responses: [
                {
                    id: 1,
                    sender: 'Academic Office',
                    senderRole: 'Administrator',
                    message: 'Your request has been received. We are verifying the marks with the concerned faculty.',
                    timestamp: '2025-09-26 10:30 AM',
                    isAdmin: true
                },
                {
                    id: 2,
                    sender: 'Dr. Sarah Wilson',
                    senderRole: 'Professor',
                    message: 'I have reviewed your answer sheet. The correct marks are indeed 85. This will be updated in the system within 24 hours.',
                    timestamp: '2025-09-26 02:15 PM',
                    isAdmin: true
                }
            ],
            attachments: ['answer_sheet_photo.jpg']
        },
        {
            id: 2,
            title: 'Library Book Return Issue',
            category: 'Library',
            priority: 'Medium',
            status: 'Resolved',
            description: 'I returned "Introduction to Algorithms" book on 20th Sept but it still shows as issued in my account. Please update the status.',
            student: {
                name: 'Emily Chen',
                rollNo: 'CS2021002',
                branch: 'CSE-B',
                semester: 3,
                email: 'emily.chen@student.edu',
                phone: '+91-9876543211'
            },
            submittedDate: '2025-09-22',
            lastUpdated: '2025-09-24',
            assignedTo: 'Library Department',
            responses: [
                {
                    id: 1,
                    sender: 'Library Staff',
                    senderRole: 'Librarian',
                    message: 'Thank you for bringing this to our attention. We have located the book and updated your account. The issue has been resolved.',
                    timestamp: '2025-09-24 11:00 AM',
                    isAdmin: true
                }
            ],
            attachments: []
        },
        {
            id: 3,
            title: 'Hostel Room AC Not Working',
            category: 'Hostel',
            priority: 'High',
            status: 'Pending',
            description: 'The air conditioning unit in Room 304, Block A is not working for the past 3 days. Need urgent repair as it affects study environment.',
            student: {
                name: 'Michael Johnson',
                rollNo: 'ME2021015',
                branch: 'ME-A',
                semester: 4,
                email: 'michael.johnson@student.edu',
                phone: '+91-9876543212'
            },
            submittedDate: '2025-09-27',
            lastUpdated: '2025-09-27',
            assignedTo: 'Hostel Maintenance',
            responses: [],
            attachments: ['ac_unit_photo.jpg']
        },
        {
            id: 4,
            title: 'Fee Payment Receipt Not Generated',
            category: 'Fees & Finance',
            priority: 'Medium',
            status: 'In Progress',
            description: 'I paid my semester fees online on 15th Sept but the receipt was not generated. Transaction ID: TXN123456789',
            student: {
                name: 'Sarah Williams',
                rollNo: 'ECE2021008',
                branch: 'ECE-A',
                semester: 6,
                email: 'sarah.williams@student.edu',
                phone: '+91-9876543213'
            },
            submittedDate: '2025-09-18',
            lastUpdated: '2025-09-20',
            assignedTo: 'Finance Office',
            responses: [
                {
                    id: 1,
                    sender: 'Finance Office',
                    senderRole: 'Accounts Manager',
                    message: 'We are checking with the bank regarding your transaction. Please allow 2-3 working days for resolution.',
                    timestamp: '2025-09-20 09:45 AM',
                    isAdmin: true
                }
            ],
            attachments: ['payment_screenshot.png']
        },
        {
            id: 5,
            title: 'Placement Portal Access Issue',
            category: 'Placement',
            priority: 'Low',
            status: 'Closed',
            description: 'Unable to access the placement portal. Getting "Invalid credentials" error despite correct username and password.',
            student: {
                name: 'David Brown',
                rollNo: 'CS2021025',
                branch: 'CSE-C',
                semester: 8,
                email: 'david.brown@student.edu',
                phone: '+91-9876543214'
            },
            submittedDate: '2025-09-10',
            lastUpdated: '2025-09-12',
            assignedTo: 'IT Support',
            responses: [
                {
                    id: 1,
                    sender: 'IT Support',
                    senderRole: 'Technical Officer',
                    message: 'Your account has been reset. Please use the new temporary password sent to your email and change it upon first login.',
                    timestamp: '2025-09-12 03:30 PM',
                    isAdmin: true
                }
            ],
            attachments: []
        },
        {
            id: 6,
            title: 'Transcript Request for Job Application',
            category: 'Administrative',
            priority: 'Medium',
            status: 'Pending',
            description: 'I need my official transcript for a job application. The deadline is next week. Please expedite the process.',
            student: {
                name: 'Lisa Anderson',
                rollNo: 'CS2020010',
                branch: 'CSE-A',
                semester: 8,
                email: 'lisa.anderson@student.edu',
                phone: '+91-9876543215'
            },
            submittedDate: '2025-09-28',
            lastUpdated: '2025-09-28',
            assignedTo: 'Registrar Office',
            responses: [],
            attachments: ['job_application_letter.pdf']
        }
    ];

    const queryCategories = [
        'Academic',
        'Administrative',
        'Technical Support',
        'Library',
        'Hostel',
        'Fees & Finance',
        'Placement',
        'Other'
    ];

    const priorityLevels = ['High', 'Medium', 'Low'];
    const statusTypes = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    const departments = [
        'Academic Office',
        'Library Department', 
        'Hostel Maintenance',
        'Finance Office',
        'IT Support',
        'Registrar Office',
        'Student Affairs',
        'Placement Cell'
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setQueries(mockQueries);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredQueries = queries.filter(query => {
        const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             query.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             query.student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || query.status === filterStatus;
        const matchesCategory = !filterCategory || query.category === filterCategory;
        const matchesPriority = !filterPriority || query.priority === filterPriority;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-400';
            case 'Medium': return 'text-yellow-400';
            case 'Low': return 'text-green-400';
            default: return 'text-gray-400';
        }
    };

    const getPriorityBgColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500/20';
            case 'Medium': return 'bg-yellow-500/20';
            case 'Low': return 'bg-green-500/20';
            default: return 'bg-gray-500/20';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-yellow-400';
            case 'In Progress': return 'text-blue-400';
            case 'Resolved': return 'text-green-400';
            case 'Closed': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20';
            case 'In Progress': return 'bg-blue-500/20';
            case 'Resolved': return 'bg-green-500/20';
            case 'Closed': return 'bg-gray-500/20';
            default: return 'bg-gray-500/20';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Academic': return 'ri-graduation-cap-line';
            case 'Administrative': return 'ri-file-text-line';
            case 'Technical Support': return 'ri-computer-line';
            case 'Library': return 'ri-book-open-line';
            case 'Hostel': return 'ri-home-line';
            case 'Fees & Finance': return 'ri-money-dollar-circle-line';
            case 'Placement': return 'ri-briefcase-line';
            default: return 'ri-question-line';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleQueryClick = (query) => {
        setSelectedQuery(query);
        setShowQueryDetails(true);
    };

    const handleResponse = () => {
        if (selectedQuery && responseForm.message.trim()) {
            const newResponse = {
                id: Date.now(),
                sender: 'Administrator',
                senderRole: 'Administrator',
                message: responseForm.message,
                timestamp: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                isAdmin: true
            };

            const updatedQuery = {
                ...selectedQuery,
                responses: [...selectedQuery.responses, newResponse],
                status: responseForm.status,
                assignedTo: responseForm.assignTo || selectedQuery.assignedTo,
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            setQueries(queries.map(q => q.id === selectedQuery.id ? updatedQuery : q));
            setSelectedQuery(updatedQuery);
            
            setResponseForm({ message: '', status: 'In Progress', assignTo: '' });
            setShowResponseModal(false);
        }
    };

    const handleStatusUpdate = (queryId, newStatus) => {
        setQueries(queries.map(query => 
            query.id === queryId 
                ? { ...query, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
                : query
        ));
        if (selectedQuery && selectedQuery.id === queryId) {
            setSelectedQuery({ ...selectedQuery, status: newStatus });
        }
    };

    const StatCard = ({ title, value, icon, color = 'indigo' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.primaryCard} p-6 rounded-xl`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.text.secondary} text-sm font-medium`}>{title}</p>
                    <p className={`${themeClasses.text.primary} text-2xl font-bold mt-1`}>{value}</p>
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
                    <p className={themeClasses.text.secondary}>Loading queries...</p>
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
                        Student Queries Management
                    </h1>
                    <p className={`${themeClasses.text.secondary} mt-1`}>
                        View and manage all student queries and support requests
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Queries"
                    value={queries.length}
                    icon="ri-question-answer-line"
                    color="indigo"
                />
                <StatCard
                    title="Pending"
                    value={queries.filter(q => q.status === 'Pending').length}
                    icon="ri-time-line"
                    color="yellow"
                />
                <StatCard
                    title="In Progress"
                    value={queries.filter(q => q.status === 'In Progress').length}
                    icon="ri-loader-line"
                    color="blue"
                />
                <StatCard
                    title="Resolved"
                    value={queries.filter(q => q.status === 'Resolved').length}
                    icon="ri-check-line"
                    color="green"
                />
            </div>

            {/* Filters */}
            <div className={`${themeClasses.primaryCard} p-6 rounded-xl`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>
                            Search Queries
                        </label>
                        <div className="relative">
                            <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses.primary}`}></i>
                            <input
                                type="text"
                                placeholder="Search by title, student name, or roll number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                        >
                            <option value="">All Status</option>
                            {statusTypes.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                        >
                            <option value="">All Categories</option>
                            {queryCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
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
                            {priorityLevels.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Queries Table */}
            <div className={`${themeClasses.primaryCard} rounded-xl overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${themeClasses.surface}`}>
                            <tr>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Query</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Student</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Category</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Priority</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Status</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Assigned To</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Date</th>
                                <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQueries.map((query) => (
                                <tr
                                    key={query.id}
                                    className={`border-t ${themeClasses.border} hover:bg-gray-700/30 transition-colors cursor-pointer`}
                                    onClick={() => handleQueryClick(query)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`h-10 w-10 rounded-lg ${getPriorityBgColor(query.priority)} flex items-center justify-center`}>
                                                <i className={`${getCategoryIcon(query.category)} ${getPriorityColor(query.priority)}`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium ${themeClasses.text.primary} truncate`}>
                                                    {query.title}
                                                </p>
                                                <p className={`text-sm ${themeClasses.text.secondary} mt-1 line-clamp-2`}>
                                                    {query.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className={`font-medium ${themeClasses.text.primary}`}>
                                                {query.student.name}
                                            </p>
                                            <p className={`text-sm ${themeClasses.text.secondary}`}>
                                                {query.student.rollNo}
                                            </p>
                                            <p className={`text-sm ${iconClasses.primary}`}>
                                                {query.student.branch}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 ${iconClasses.primary}`}>
                                            {query.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityBgColor(query.priority)} ${getPriorityColor(query.priority)}`}>
                                            {query.priority}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={query.status}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleStatusUpdate(query.id, e.target.value);
                                            }}
                                            className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBgColor(query.status)} ${getStatusColor(query.status)} bg-transparent border-none outline-none cursor-pointer`}
                                        >
                                            {statusTypes.map(status => (
                                                <option key={status} value={status} className="bg-gray-800 text-gray-200">
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className={`p-4 ${themeClasses.text.secondary} text-sm`}>
                                        {query.assignedTo}
                                    </td>
                                    <td className={`p-4 ${themeClasses.text.secondary} text-sm`}>
                                        {formatDate(query.submittedDate)}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedQuery(query);
                                                setShowResponseModal(true);
                                            }}
                                            className={`p-2 rounded-lg ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}
                                            title="Respond to query"
                                        >
                                            <i className="ri-reply-line"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredQueries.length === 0 && (
                <div className={`${themeClasses.primaryCard} rounded-xl p-12 text-center`}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/20 mb-4">
                        <i className={`ri-question-answer-line text-2xl ${themeClasses.text.muted}`}></i>
                    </div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                        No queries found
                    </h3>
                    <p className={`${themeClasses.text.secondary}`}>
                        {searchTerm || filterStatus || filterCategory || filterPriority 
                            ? 'Try adjusting your search filters.' 
                            : 'No student queries have been submitted yet.'}
                    </p>
                </div>
            )}

            {/* Query Details Modal */}
            <AnimatePresence>
                {showQueryDetails && selectedQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
                        onClick={() => setShowQueryDetails(false)}
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
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`h-12 w-12 rounded-xl ${getPriorityBgColor(selectedQuery.priority)} flex items-center justify-center`}>
                                                <i className={`${getCategoryIcon(selectedQuery.category)} text-xl ${getPriorityColor(selectedQuery.priority)}`}></i>
                                            </div>
                                            <div>
                                                <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                                    {selectedQuery.title}
                                                </h2>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityBgColor(selectedQuery.priority)} ${getPriorityColor(selectedQuery.priority)}`}>
                                                        {selectedQuery.priority} Priority
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBgColor(selectedQuery.status)} ${getStatusColor(selectedQuery.status)}`}>
                                                        {selectedQuery.status}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 ${iconClasses.primary}`}>
                                                        {selectedQuery.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowQueryDetails(false)}
                                        className={`p-2 rounded-xl ${themeClasses.text.secondary} hover:bg-gray-700/50 transition-colors`}
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Query Description */}
                                        <div className={`${themeClasses.surface} p-4 rounded-xl`}>
                                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                                                Query Description
                                            </h3>
                                            <p className={`${themeClasses.text.secondary} leading-relaxed`}>
                                                {selectedQuery.description}
                                            </p>
                                        </div>

                                        {/* Attachments */}
                                        {selectedQuery.attachments.length > 0 && (
                                            <div className={`${themeClasses.surface} p-4 rounded-xl`}>
                                                <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                                                    Attachments
                                                </h3>
                                                <div className="space-y-2">
                                                    {selectedQuery.attachments.map((attachment, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center gap-3 p-3 rounded-lg ${themeClasses.primaryCard} border ${themeClasses.border}`}
                                                        >
                                                            <i className={`ri-file-line ${iconClasses.primary}`}></i>
                                                            <span className={`${themeClasses.text.primary}`}>{attachment}</span>
                                                            <button className={`ml-auto p-1 rounded ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}>
                                                                <i className="ri-download-line"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Responses */}
                                        <div className={`${themeClasses.surface} p-4 rounded-xl`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                                                    Responses ({selectedQuery.responses.length})
                                                </h3>
                                                <button
                                                    onClick={() => setShowResponseModal(true)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                                >
                                                    <i className="ri-reply-line"></i>
                                                    Add Response
                                                </button>
                                            </div>
                                            
                                            {selectedQuery.responses.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedQuery.responses.map((response) => (
                                                        <div
                                                            key={response.id}
                                                            className={`p-4 rounded-xl ${
                                                                response.isAdmin ? 'bg-indigo-500/10 border-l-4 border-indigo-500' : 'bg-gray-500/10 border-l-4 border-gray-500'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`font-medium ${themeClasses.text.primary}`}>
                                                                        {response.sender}
                                                                    </span>
                                                                    <span className={`text-xs px-2 py-1 rounded-lg ${response.isAdmin ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                                        {response.senderRole}
                                                                    </span>
                                                                </div>
                                                                <span className={`text-sm ${themeClasses.text.muted}`}>
                                                                    {response.timestamp}
                                                                </span>
                                                            </div>
                                                            <p className={`${themeClasses.text.secondary}`}>
                                                                {response.message}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={`text-center p-8 ${themeClasses.primaryCard} rounded-lg`}>
                                                    <i className={`ri-message-line text-3xl ${themeClasses.text.muted} mb-2`}></i>
                                                    <p className={`${themeClasses.text.muted}`}>No responses yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-6">
                                        {/* Student Info */}
                                        <div className={`${themeClasses.surface} p-4 rounded-xl`}>
                                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                                                Student Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Name</p>
                                                    <p className={`font-medium ${themeClasses.text.primary}`}>
                                                        {selectedQuery.student.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Roll Number</p>
                                                    <p className={`font-medium ${iconClasses.primary}`}>
                                                        {selectedQuery.student.rollNo}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Branch</p>
                                                    <p className={`font-medium ${themeClasses.text.primary}`}>
                                                        {selectedQuery.student.branch}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Semester</p>
                                                    <p className={`font-medium ${themeClasses.text.primary}`}>
                                                        {selectedQuery.student.semester}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Email</p>
                                                    <p className={`font-medium ${themeClasses.text.secondary} text-sm break-all`}>
                                                        {selectedQuery.student.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Phone</p>
                                                    <p className={`font-medium ${themeClasses.text.secondary}`}>
                                                        {selectedQuery.student.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Query Details */}
                                        <div className={`${themeClasses.surface} p-4 rounded-xl`}>
                                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                                                Query Details
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Submitted Date</p>
                                                    <p className={`font-medium ${themeClasses.text.primary}`}>
                                                        {formatDate(selectedQuery.submittedDate)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Last Updated</p>
                                                    <p className={`font-medium ${themeClasses.text.primary}`}>
                                                        {formatDate(selectedQuery.lastUpdated)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Assigned To</p>
                                                    <p className={`font-medium ${iconClasses.primary}`}>
                                                        {selectedQuery.assignedTo}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${themeClasses.text.muted}`}>Query ID</p>
                                                    <p className={`font-medium ${themeClasses.text.secondary}`}>
                                                        #{selectedQuery.id.toString().padStart(6, '0')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Response Modal */}
            <AnimatePresence>
                {showResponseModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
                        onClick={() => setShowResponseModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${themeClasses.primaryCard} rounded-2xl w-full max-w-2xl p-6`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                    Respond to Query
                                </h2>
                                <button
                                    onClick={() => setShowResponseModal(false)}
                                    className={`p-2 rounded-xl ${themeClasses.text.secondary} hover:bg-gray-700/50 transition-colors`}
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Response Message *
                                    </label>
                                    <textarea
                                        placeholder="Enter your response to the student..."
                                        value={responseForm.message}
                                        onChange={(e) => setResponseForm({...responseForm, message: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors h-32 resize-none`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Update Status
                                        </label>
                                        <select
                                            value={responseForm.status}
                                            onChange={(e) => setResponseForm({...responseForm, status: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                        >
                                            {statusTypes.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Reassign To
                                        </label>
                                        <select
                                            value={responseForm.assignTo}
                                            onChange={(e) => setResponseForm({...responseForm, assignTo: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                        >
                                            <option value="">Keep current assignment</option>
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowResponseModal(false)}
                                    className={`px-6 py-3 border ${themeClasses.border} rounded-xl ${themeClasses.text.secondary} font-medium hover:bg-gray-700 transition-colors`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResponse}
                                    disabled={!responseForm.message.trim()}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send Response
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QueriesPage;