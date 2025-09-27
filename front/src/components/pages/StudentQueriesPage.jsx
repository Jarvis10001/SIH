import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StudentQueriesPage = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [showNewQueryModal, setShowNewQueryModal] = useState(false);
  const [newQuery, setNewQuery] = useState({
    title: '',
    category: 'Academic',
    priority: 'Medium',
    description: '',
    attachments: []
  });
  const [myQueries, setMyQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);

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

  // Query categories
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

  // Priority levels
  const priorityLevels = [
    { value: 'High', color: 'text-red-400', bgColor: 'bg-red-900' },
    { value: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-900' },
    { value: 'Low', color: 'text-green-400', bgColor: 'bg-green-900' }
  ];

  // Status types
  const statusTypes = [
    { value: 'Pending', color: 'text-yellow-400', bgColor: 'bg-yellow-900' },
    { value: 'In Progress', color: 'text-blue-400', bgColor: 'bg-blue-900' },
    { value: 'Resolved', color: 'text-green-400', bgColor: 'bg-green-900' },
    { value: 'Closed', color: 'text-gray-400', bgColor: 'bg-gray-700' }
  ];

  // Mock queries data
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
      attachments: ['answer_sheet_photo.jpg']
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
      responses: [
        {
          id: 1,
          sender: 'Library Staff',
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
      submittedDate: '2025-09-18',
      lastUpdated: '2025-09-20',
      assignedTo: 'Finance Office',
      responses: [
        {
          id: 1,
          sender: 'Finance Office',
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
      submittedDate: '2025-09-10',
      lastUpdated: '2025-09-12',
      assignedTo: 'IT Support',
      responses: [
        {
          id: 1,
          sender: 'IT Support',
          message: 'Your account has been reset. Please use the new temporary password sent to your email and change it upon first login.',
          timestamp: '2025-09-12 03:30 PM',
          isAdmin: true
        }
      ],
      attachments: []
    }
  ];

  useEffect(() => {
    setMyQueries(mockQueries);
  }, []);

  const getPriorityColor = (priority) => {
    const priorityObj = priorityLevels.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'text-gray-400';
  };

  const getPriorityBgColor = (priority) => {
    const priorityObj = priorityLevels.find(p => p.value === priority);
    return priorityObj ? priorityObj.bgColor : 'bg-gray-700';
  };

  const getStatusColor = (status) => {
    const statusObj = statusTypes.find(s => s.value === status);
    return statusObj ? statusObj.color : 'text-gray-400';
  };

  const getStatusBgColor = (status) => {
    const statusObj = statusTypes.find(s => s.value === status);
    return statusObj ? statusObj.bgColor : 'bg-gray-700';
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

  const handleSubmitQuery = () => {
    const query = {
      id: Date.now(),
      ...newQuery,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      assignedTo: getAssignedDepartment(newQuery.category),
      responses: [],
      attachments: newQuery.attachments || []
    };

    setMyQueries(prev => [query, ...prev]);
    setNewQuery({
      title: '',
      category: 'Academic',
      priority: 'Medium',
      description: '',
      attachments: []
    });
    setShowNewQueryModal(false);

    // Show success message (you can implement a toast notification here)
    alert('Query submitted successfully!');
  };

  const getAssignedDepartment = (category) => {
    const departments = {
      Academic: 'Academic Office',
      Administrative: 'Administration',
      'Technical Support': 'IT Support',
      Library: 'Library Department',
      Hostel: 'Hostel Management',
      'Fees & Finance': 'Finance Office',
      Placement: 'Placement Cell',
      Other: 'General Administration'
    };
    return departments[category] || 'General Administration';
  };

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
    setShowQueryDetails(true);
  };

  const filterQueriesByStatus = (status) => {
    if (status === 'all') return myQueries;
    return myQueries.filter(query => query.status === status);
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Student Queries
            </h1>
            <p className={themeClasses.text.secondary}>
              Submit and track your queries to college administration
            </p>
          </div>

          <button
            onClick={() => setShowNewQueryModal(true)}
            className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors flex items-center space-x-2`}
          >
            <i className="ri-add-line"></i>
            <span>New Query</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`${themeClasses.card} p-1 rounded-lg mb-6 flex`}>
          {[
            { id: 'submit', name: 'Submit Query', icon: 'ri-add-circle-line' },
            { id: 'track', name: 'My Queries', icon: 'ri-list-check-line' }
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

        {/* Submit Query Tab */}
        {activeTab === 'submit' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Query Form */}
            <div className="lg:col-span-2">
              <div className={`${themeClasses.card} p-6 rounded-lg`}>
                <h2 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
                  Submit New Query
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Query Title
                    </label>
                    <input
                      type="text"
                      value={newQuery.title}
                      onChange={(e) => setNewQuery(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter a brief title for your query..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Category
                      </label>
                      <select
                        value={newQuery.category}
                        onChange={(e) => setNewQuery(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        {queryCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                        Priority
                      </label>
                      <select
                        value={newQuery.priority}
                        onChange={(e) => setNewQuery(prev => ({ ...prev, priority: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        {priorityLevels.map(priority => (
                          <option key={priority.value} value={priority.value}>{priority.value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Description
                    </label>
                    <textarea
                      value={newQuery.description}
                      onChange={(e) => setNewQuery(prev => ({ ...prev, description: e.target.value }))}
                      rows={6}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                      placeholder="Please provide detailed description of your query..."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Attachments (Optional)
                    </label>
                    <div className={`border-2 border-dashed ${themeClasses.border} rounded-lg p-6 text-center`}>
                      <i className="ri-upload-cloud-2-line text-3xl text-gray-400 mb-2 block"></i>
                      <p className={themeClasses.text.secondary}>
                        Drag and drop files here or click to browse
                      </p>
                      <p className={`text-sm ${themeClasses.text.muted} mt-1`}>
                        Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className={`px-6 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                      onClick={() => setNewQuery({
                        title: '',
                        category: 'Academic',
                        priority: 'Medium',
                        description: '',
                        attachments: []
                      })}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSubmitQuery}
                      disabled={!newQuery.title || !newQuery.description}
                      className={`px-6 py-2 rounded-lg ${themeClasses.button.primary} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <i className="ri-send-plane-line mr-2"></i>
                      Submit Query
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <div className={`${themeClasses.card} p-6 rounded-lg`}>
                <h3 className={`font-semibold ${themeClasses.text.primary} mb-4`}>
                  Query Guidelines
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary} mb-2`}>Priority Levels</h4>
                    <div className="space-y-2">
                      {priorityLevels.map(priority => (
                        <div key={priority.value} className="flex items-center space-x-2 text-sm">
                          <div className={`w-3 h-3 rounded-full ${priority.bgColor}`}></div>
                          <span className={themeClasses.text.secondary}>{priority.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary} mb-2`}>Response Time</h4>
                    <div className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                      <p>• High Priority: 24 hours</p>
                      <p>• Medium Priority: 2-3 days</p>
                      <p>• Low Priority: 5-7 days</p>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary} mb-2`}>Tips</h4>
                    <div className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                      <p>• Be specific and clear</p>
                      <p>• Include relevant details</p>
                      <p>• Attach supporting documents</p>
                      <p>• Check existing FAQs first</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Track Queries Tab */}
        {activeTab === 'track' && (
          <>
            {/* Status Filter */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {['all', 'Pending', 'In Progress', 'Resolved', 'Closed'].map(status => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${themeClasses.button.secondary}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} 
                  {status !== 'all' && (
                    <span className="ml-2 bg-gray-600 px-2 py-1 rounded-full text-xs">
                      {filterQueriesByStatus(status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Queries List */}
            <div className="space-y-4">
              {myQueries.map(query => (
                <motion.div
                  key={query.id}
                  className={`${themeClasses.card} p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200`}
                  onClick={() => handleQueryClick(query)}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <i className={`${getCategoryIcon(query.category)} text-xl ${themeClasses.accent} mt-1`}></i>
                      <div>
                        <h3 className={`font-semibold ${themeClasses.text.primary} mb-1`}>
                          {query.title}
                        </h3>
                        <p className={`text-sm ${themeClasses.text.secondary} line-clamp-2`}>
                          {query.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBgColor(query.priority)} ${getPriorityColor(query.priority)}`}>
                        {query.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBgColor(query.status)} ${getStatusColor(query.status)}`}>
                        {query.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className={themeClasses.text.muted}>
                        <i className="ri-bookmark-line mr-1"></i>
                        {query.category}
                      </span>
                      <span className={themeClasses.text.muted}>
                        <i className="ri-user-line mr-1"></i>
                        {query.assignedTo}
                      </span>
                      {query.responses.length > 0 && (
                        <span className={themeClasses.text.muted}>
                          <i className="ri-chat-3-line mr-1"></i>
                          {query.responses.length} response{query.responses.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <span className={themeClasses.text.muted}>
                      {formatDate(query.lastUpdated)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* New Query Modal */}
        {showNewQueryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  Quick Submit Query
                </h3>
                <button
                  onClick={() => setShowNewQueryModal(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              {/* Same form as in the submit tab but in modal */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Query Title
                  </label>
                  <input
                    type="text"
                    value={newQuery.title}
                    onChange={(e) => setNewQuery(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter a brief title for your query..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Category
                    </label>
                    <select
                      value={newQuery.category}
                      onChange={(e) => setNewQuery(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      {queryCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Priority
                    </label>
                    <select
                      value={newQuery.priority}
                      onChange={(e) => setNewQuery(prev => ({ ...prev, priority: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.value}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Description
                  </label>
                  <textarea
                    value={newQuery.description}
                    onChange={(e) => setNewQuery(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                    placeholder="Please provide detailed description of your query..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewQueryModal(false)}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitQuery}
                  disabled={!newQuery.title || !newQuery.description}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Submit Query
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Query Details Modal */}
        {showQueryDetails && selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto`}
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
                  <div className="flex items-start justify-between mb-3">
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                      {selectedQuery.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${getPriorityBgColor(selectedQuery.priority)} ${getPriorityColor(selectedQuery.priority)}`}>
                        {selectedQuery.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusBgColor(selectedQuery.status)} ${getStatusColor(selectedQuery.status)}`}>
                        {selectedQuery.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={themeClasses.text.muted}>Category:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        <i className={`${getCategoryIcon(selectedQuery.category)} mr-2`}></i>
                        {selectedQuery.category}
                      </div>
                    </div>
                    <div>
                      <span className={themeClasses.text.muted}>Submitted:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        {formatDate(selectedQuery.submittedDate)}
                      </div>
                    </div>
                    <div>
                      <span className={themeClasses.text.muted}>Assigned to:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        {selectedQuery.assignedTo}
                      </div>
                    </div>
                    <div>
                      <span className={themeClasses.text.muted}>Last Updated:</span>
                      <div className={`${themeClasses.text.secondary} mt-1`}>
                        {formatDate(selectedQuery.lastUpdated)}
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

                {/* Attachments */}
                {selectedQuery.attachments.length > 0 && (
                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Attachments</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuery.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 px-3 py-2 ${themeClasses.surface} rounded-lg`}
                        >
                          <i className="ri-attachment-2 text-indigo-400"></i>
                          <span className={`text-sm ${themeClasses.text.secondary}`}>{attachment}</span>
                          <button className={`text-indigo-400 hover:text-indigo-300`}>
                            <i className="ri-download-line text-sm"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responses */}
                <div>
                  <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>
                    Responses ({selectedQuery.responses.length})
                  </h5>
                  {selectedQuery.responses.length === 0 ? (
                    <div className={`text-center py-8 ${themeClasses.surface} rounded-lg`}>
                      <i className="ri-chat-3-line text-3xl text-gray-500 mb-2 block"></i>
                      <p className={themeClasses.text.muted}>No responses yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedQuery.responses.map(response => (
                        <div
                          key={response.id}
                          className={`${themeClasses.surface} p-4 rounded-lg ${
                            response.isAdmin ? 'border-l-4 border-indigo-500' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium ${themeClasses.text.primary}`}>
                                {response.sender}
                              </span>
                              {response.isAdmin && (
                                <span className="px-2 py-1 text-xs bg-indigo-900 text-indigo-300 rounded">
                                  Admin
                                </span>
                              )}
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
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { title: 'Total Queries', count: myQueries.length, icon: 'ri-question-line', color: 'text-blue-400' },
            { title: 'Pending', count: filterQueriesByStatus('Pending').length, icon: 'ri-time-line', color: 'text-yellow-400' },
            { title: 'In Progress', count: filterQueriesByStatus('In Progress').length, icon: 'ri-loader-line', color: 'text-blue-400' },
            { title: 'Resolved', count: filterQueriesByStatus('Resolved').length, icon: 'ri-check-line', color: 'text-green-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`${themeClasses.card} p-4 rounded-lg`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.title}</p>
                  <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.count}</p>
                </div>
                <div className={`text-2xl ${stat.color}`}>
                  <i className={stat.icon}></i>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentQueriesPage;