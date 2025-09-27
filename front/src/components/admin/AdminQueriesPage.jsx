import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminQueriesPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Theme classes for consistency
  const themeClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    secondary: 'bg-gray-800 text-gray-200',
    accent: 'text-indigo-400',
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    border: 'border-gray-700',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-400'
    },
    button: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white'
    },
    input: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-500',
    card: 'bg-gray-800 border border-gray-700'
  };

  // Mock queries data (same as student queries but with admin perspective)
  const mockQueries = [
    {
      id: 1,
      title: 'Grade Correction Request for CS301',
      category: 'Academic',
      priority: 'High',
      status: 'In Progress',
      description: 'There seems to be an error in my mid-term examination grade for Data Structures & Algorithms. I scored 85 marks but it shows 58 in the portal.',
      submittedDate: '2025-09-25',
      lastUpdated: '2025-09-26',
      assignedTo: 'Academic Office',
      studentName: 'John Smith',
      studentId: 'CS2021001',
      email: 'john.smith@college.edu',
      responses: [
        {
          id: 1,
          sender: 'Academic Office',
          message: 'Your request has been received. We are verifying the marks with the concerned faculty.',
          timestamp: '2025-09-26 10:30 AM',
          isAdmin: true
        },
        {
          id: 2,
          sender: 'Dr. Sarah Wilson',
          message: 'I have reviewed your answer sheet. The correct marks are indeed 85. This will be updated in the system within 24 hours.',
          timestamp: '2025-09-26 02:15 PM',
          isAdmin: true
        }
      ],
      attachments: ['answer_sheet_photo.jpg'],
      urgency: 'medium'
    },
    {
      id: 2,
      title: 'Library Book Return Issue',
      category: 'Library',
      priority: 'Medium',
      status: 'Resolved',
      description: 'I returned "Introduction to Algorithms" book on 20th Sept but it still shows as issued in my account. Please update the status.',
      submittedDate: '2025-09-22',
      lastUpdated: '2025-09-24',
      assignedTo: 'Library Department',
      studentName: 'Emma Davis',
      studentId: 'CS2021002',
      email: 'emma.davis@college.edu',
      responses: [
        {
          id: 1,
          sender: 'Library Staff',
          message: 'Thank you for bringing this to our attention. We have located the book and updated your account. The issue has been resolved.',
          timestamp: '2025-09-24 11:00 AM',
          isAdmin: true
        }
      ],
      attachments: [],
      urgency: 'low'
    },
    {
      id: 3,
      title: 'Hostel Room AC Not Working',
      category: 'Hostel',
      priority: 'High',
      status: 'Pending',
      description: 'The air conditioning unit in Room 304, Block A is not working for the past 3 days. Need urgent repair as it affects study environment.',
      submittedDate: '2025-09-27',
      lastUpdated: '2025-09-27',
      assignedTo: 'Hostel Maintenance',
      studentName: 'Michael Johnson',
      studentId: 'CS2021003',
      email: 'michael.johnson@college.edu',
      responses: [],
      attachments: ['ac_unit_photo.jpg'],
      urgency: 'high'
    },
    {
      id: 4,
      title: 'Fee Payment Receipt Not Generated',
      category: 'Fees & Finance',
      priority: 'Medium',
      status: 'In Progress',
      description: 'I paid my semester fees online on 15th Sept but the receipt was not generated. Transaction ID: TXN123456789',
      submittedDate: '2025-09-18',
      lastUpdated: '2025-09-20',
      assignedTo: 'Finance Office',
      studentName: 'Sarah Wilson',
      studentId: 'CS2021004',
      email: 'sarah.wilson@college.edu',
      responses: [
        {
          id: 1,
          sender: 'Finance Office',
          message: 'We are checking with the bank regarding your transaction. Please allow 2-3 working days for resolution.',
          timestamp: '2025-09-20 09:45 AM',
          isAdmin: true
        }
      ],
      attachments: ['payment_screenshot.png'],
      urgency: 'medium'
    },
    {
      id: 5,
      title: 'Technical Issue with Course Registration',
      category: 'Technical Support',
      priority: 'High',
      status: 'Pending',
      description: 'Unable to register for elective courses. The system shows "Server Error 500" whenever I try to submit my preferences.',
      submittedDate: '2025-09-28',
      lastUpdated: '2025-09-28',
      assignedTo: 'IT Support',
      studentName: 'Alex Chen',
      studentId: 'CS2021005',
      email: 'alex.chen@college.edu',
      responses: [],
      attachments: ['error_screenshot.png'],
      urgency: 'high'
    },
    {
      id: 6,
      title: 'Transcript Request for Job Application',
      category: 'Administrative',
      priority: 'Low',
      status: 'Pending',
      description: 'I need an official transcript for a job application. Please process the request and send it to the provided address.',
      submittedDate: '2025-09-26',
      lastUpdated: '2025-09-26',
      assignedTo: 'Academic Office',
      studentName: 'Lisa Brown',
      studentId: 'CS2020001',
      email: 'lisa.brown@college.edu',
      responses: [],
      attachments: ['job_offer_letter.pdf'],
      urgency: 'low'
    }
  ];

  useEffect(() => {
    setQueries(mockQueries);
  }, []);

  const queryCategories = [
    'all',
    'Academic',
    'Administrative', 
    'Technical Support',
    'Library',
    'Hostel',
    'Fees & Finance',
    'Placement',
    'Other'
  ];

  const statusTypes = [
    'all',
    'Pending',
    'In Progress', 
    'Resolved',
    'Closed'
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'text-red-400',
      Medium: 'text-yellow-400',
      Low: 'text-green-400'
    };
    return colors[priority] || 'text-gray-400';
  };

  const getPriorityBgColor = (priority) => {
    const colors = {
      High: 'bg-red-900',
      Medium: 'bg-yellow-900',
      Low: 'bg-green-900'
    };
    return colors[priority] || 'bg-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'text-yellow-400',
      'In Progress': 'text-blue-400',
      Resolved: 'text-green-400',
      Closed: 'text-gray-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-900',
      'In Progress': 'bg-blue-900', 
      Resolved: 'bg-green-900',
      Closed: 'bg-gray-700'
    };
    return colors[status] || 'bg-gray-700';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };
    return colors[urgency] || 'text-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Academic: 'ri-book-open-line',
      Administrative: 'ri-settings-line',
      'Technical Support': 'ri-computer-line',
      Library: 'ri-book-2-line',
      Hostel: 'ri-building-2-line',
      'Fees & Finance': 'ri-money-dollar-circle-line',
      Placement: 'ri-briefcase-line',
      Other: 'ri-question-line'
    };
    return icons[category] || 'ri-question-line';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFilteredQueries = () => {
    return queries.filter(query => {
      const matchesStatus = selectedStatus === 'all' || query.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || query.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
                           query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           query.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           query.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesCategory && matchesSearch;
    });
  };

  const getStatistics = () => {
    const total = queries.length;
    const pending = queries.filter(q => q.status === 'Pending').length;
    const inProgress = queries.filter(q => q.status === 'In Progress').length;
    const resolved = queries.filter(q => q.status === 'Resolved').length;
    const highPriority = queries.filter(q => q.priority === 'High').length;
    const avgResponseTime = '2.5 hours'; // Mock calculation

    return {
      total,
      pending,
      inProgress,
      resolved,
      highPriority,
      avgResponseTime
    };
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setShowQueryDetails(true);
  };

  const handleStatusChange = (queryId, newStatus) => {
    setQueries(prev => prev.map(query =>
      query.id === queryId
        ? { ...query, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
        : query
    ));
  };

  const handleAssignQuery = (queryId, assignTo) => {
    setQueries(prev => prev.map(query =>
      query.id === queryId
        ? { ...query, assignedTo: assignTo, lastUpdated: new Date().toISOString().split('T')[0] }
        : query
    ));
  };

  const handleAddResponse = () => {
    if (!responseText.trim() || !selectedQuery) return;

    const newResponse = {
      id: Date.now(),
      sender: 'Admin Support',
      message: responseText,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      isAdmin: true
    };

    setQueries(prev => prev.map(query =>
      query.id === selectedQuery.id
        ? {
            ...query,
            responses: [...query.responses, newResponse],
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : query
    ));

    setSelectedQuery(prev => ({
      ...prev,
      responses: [...prev.responses, newResponse],
      lastUpdated: new Date().toISOString().split('T')[0]
    }));

    setResponseText('');
    setShowResponseModal(false);
  };

  const stats = getStatistics();

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Query Management
            </h1>
            <p className={themeClasses.text.secondary}>
              Manage and respond to student queries efficiently
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.text.secondary}`}>
              <i className="ri-time-line mr-2"></i>
              Avg Response: {stats.avgResponseTime}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`${themeClasses.card} p-1 rounded-lg mb-6 flex`}>
          {[
            { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
            { id: 'queries', name: 'All Queries', icon: 'ri-question-line' },
            { id: 'analytics', name: 'Analytics', icon: 'ri-bar-chart-line' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded transition-colors ${
                activeTab === tab.id 
                  ? themeClasses.button.primary 
                  : `${themeClasses.text.secondary} hover:bg-gray-700`
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { title: 'Total Queries', value: stats.total, icon: 'ri-question-line', color: 'text-blue-400', change: '+12%' },
                { title: 'Pending', value: stats.pending, icon: 'ri-time-line', color: 'text-yellow-400', change: '-5%' },
                { title: 'In Progress', value: stats.inProgress, icon: 'ri-loader-line', color: 'text-blue-400', change: '+8%' },
                { title: 'High Priority', value: stats.highPriority, icon: 'ri-alert-line', color: 'text-red-400', change: '+3%' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={`${themeClasses.card} p-6 rounded-lg`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl ${stat.color}`}>
                      <i className={stat.icon}></i>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      stat.change.startsWith('+') ? 'text-green-400 bg-green-900' : 'text-red-400 bg-red-900'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.value}</h3>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent High Priority Queries */}
            <div className={`${themeClasses.card} p-6 rounded-lg mb-6`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                High Priority Queries
              </h3>
              <div className="space-y-3">
                {queries.filter(q => q.priority === 'High').slice(0, 5).map(query => (
                  <div
                    key={query.id}
                    className={`flex items-center justify-between p-3 ${themeClasses.surface} rounded-lg cursor-pointer hover:bg-gray-700 transition-colors`}
                    onClick={() => handleQueryClick(query)}
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`${getCategoryIcon(query.category)} text-xl ${themeClasses.accent}`}></i>
                      <div>
                        <h4 className={`font-medium ${themeClasses.text.primary}`}>{query.title}</h4>
                        <p className={`text-sm ${themeClasses.text.muted}`}>
                          {query.studentName} • {formatDate(query.submittedDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(query.status)} ${getStatusColor(query.status)}`}>
                        {query.status}
                      </span>
                      <i className={`ri-arrow-right-line ${themeClasses.text.muted}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* All Queries Tab */}
        {activeTab === 'queries' && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search queries, student name, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {statusTypes.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)} Status
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {queryCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)} Category
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Queries Table */}
            <div className={`${themeClasses.card} rounded-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${themeClasses.surface} ${themeClasses.border}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Query Details
                      </th>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Student
                      </th>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Category
                      </th>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Priority
                      </th>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Date
                      </th>
                      <th className={`px-6 py-3 text-left text-sm font-medium ${themeClasses.text.primary}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {getFilteredQueries().map(query => (
                      <tr
                        key={query.id}
                        className="hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => handleQueryClick(query)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <h4 className={`font-medium ${themeClasses.text.primary} mb-1`}>
                              {query.title}
                            </h4>
                            <p className={`text-sm ${themeClasses.text.muted} line-clamp-1`}>
                              {query.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className={`font-medium ${themeClasses.text.primary}`}>
                              {query.studentName}
                            </p>
                            <p className={`text-sm ${themeClasses.text.muted}`}>
                              {query.studentId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <i className={`${getCategoryIcon(query.category)} ${themeClasses.accent}`}></i>
                            <span className={`text-sm ${themeClasses.text.secondary}`}>
                              {query.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBgColor(query.priority)} ${getPriorityColor(query.priority)}`}>
                            {query.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(query.status)} ${getStatusColor(query.status)}`}>
                            {query.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${themeClasses.text.secondary}`}>
                            {formatDate(query.submittedDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuery(query);
                                setShowResponseModal(true);
                              }}
                              className={`p-1 rounded ${themeClasses.button.primary} text-xs`}
                            >
                              <i className="ri-reply-line"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQueryClick(query);
                              }}
                              className={`p-1 rounded ${themeClasses.button.secondary} text-xs`}
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className={`${themeClasses.card} p-6 rounded-lg`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                Queries by Category
              </h3>
              <div className="space-y-4">
                {queryCategories.slice(1).map(category => {
                  const count = queries.filter(q => q.category === category).length;
                  const percentage = queries.length > 0 ? Math.round((count / queries.length) * 100) : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <i className={`${getCategoryIcon(category)} ${themeClasses.accent}`}></i>
                        <span className={themeClasses.text.secondary}>{category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${themeClasses.text.primary} w-8 text-right`}>
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${themeClasses.card} p-6 rounded-lg`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {queries.slice(0, 6).map(query => (
                  <div key={query.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      query.status === 'Resolved' ? 'bg-green-500' : 
                      query.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className={`text-sm ${themeClasses.text.primary} font-medium`}>
                        {query.title}
                      </p>
                      <p className={`text-xs ${themeClasses.text.muted}`}>
                        {query.studentName} • {formatDate(query.lastUpdated)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBgColor(query.status)} ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Query Details Modal */}
        {showQueryDetails && selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  Query Details
                </h3>
                <button
                  onClick={() => setShowQueryDetails(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Query Header */}
                <div className={`${themeClasses.surface} p-4 rounded-lg`}>
                  <div className="flex items-start justify-between mb-4">
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                      {selectedQuery.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getPriorityBgColor(selectedQuery.priority)} ${getPriorityColor(selectedQuery.priority)}`}>
                        {selectedQuery.priority} Priority
                      </span>
                      <select
                        value={selectedQuery.status}
                        onChange={(e) => handleStatusChange(selectedQuery.id, e.target.value)}
                        className={`px-3 py-1 rounded text-sm ${themeClasses.input}`}
                      >
                        {statusTypes.slice(1).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={themeClasses.text.muted}>Student:</span>
                      <div className={`${themeClasses.text.secondary} mt-1 font-medium`}>
                        {selectedQuery.studentName}
                      </div>
                      <div className={`${themeClasses.text.muted} text-xs`}>
                        {selectedQuery.studentId}
                      </div>
                    </div>
                    <div>
                      <span className={themeClasses.text.muted}>Category:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        <i className={`${getCategoryIcon(selectedQuery.category)} mr-2`}></i>
                        {selectedQuery.category}
                      </div>
                    </div>
                    <div>
                      <span className={themeClasses.text.muted}>Assigned to:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        {selectedQuery.assignedTo}
                      </div>
                    </div>
                    <div>
                      <span className={themeClasses.text.muted}>Submitted:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        {formatDate(selectedQuery.submittedDate)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Query Description */}
                <div>
                  <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Description</h5>
                  <p className={`${themeClasses.text.secondary} leading-relaxed p-4 ${themeClasses.surface} rounded-lg`}>
                    {selectedQuery.description}
                  </p>
                </div>

                {/* Responses */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className={`font-medium ${themeClasses.text.primary}`}>
                      Responses ({selectedQuery.responses.length})
                    </h5>
                    <button
                      onClick={() => setShowResponseModal(true)}
                      className={`px-3 py-1 rounded text-sm ${themeClasses.button.primary}`}
                    >
                      <i className="ri-reply-line mr-1"></i>
                      Add Response
                    </button>
                  </div>

                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {selectedQuery.responses.map(response => (
                      <div
                        key={response.id}
                        className={`${themeClasses.surface} p-4 rounded-lg border-l-4 border-indigo-500`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${themeClasses.text.primary}`}>
                              {response.sender}
                            </span>
                            <span className="px-2 py-1 text-xs bg-indigo-900 text-indigo-300 rounded">
                              Admin
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
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-2xl w-full`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  Add Response
                </h3>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Response to: {selectedQuery.title}
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                    placeholder="Type your response to the student..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={selectedQuery.status}
                    onChange={(e) => handleStatusChange(selectedQuery.id, e.target.value)}
                    className={`px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none`}
                  >
                    {statusTypes.slice(1).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <span className={`text-sm ${themeClasses.text.muted}`}>
                    Update query status
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddResponse}
                  disabled={!responseText.trim()}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors disabled:opacity-50`}
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Send Response
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQueriesPage;