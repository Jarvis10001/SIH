import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentAssignments = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Mock student data - in real app, this would come from user context/localStorage
  const studentData = {
    branch: 'CSE',
    subjects: ['Computer Science', 'Mathematics', 'Physics']
  };

  // Mock assignments data - in real app, this would be fetched from API
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Data Structures - Linear Arrays',
      subject: 'Computer Science',
      branch: 'CSE',
      dueDate: '2024-01-15',
      description: 'Implement basic array operations and demonstrate time complexity analysis. Create functions for insertion, deletion, searching, and traversal. Include proper documentation and test cases.',
      attachments: ['assignment1.pdf', 'starter_code.zip'],
      teacherName: 'Dr. Sarah Johnson',
      createdAt: '2024-01-01',
      status: 'pending', // pending, submitted, late
      submittedAt: null,
      submissionFiles: [],
      maxMarks: 100,
      obtainedMarks: null,
      feedback: null
    },
    {
      id: 2,
      title: 'Mathematical Analysis',
      subject: 'Mathematics',
      branch: 'CSE',
      dueDate: '2024-01-20',
      description: 'Solve differential equations using various methods. Cover first-order linear equations, separable equations, and Bernoulli equations. Show all working steps clearly.',
      attachments: ['math_problems.pdf'],
      teacherName: 'Prof. Michael Chen',
      createdAt: '2024-01-05',
      status: 'submitted',
      submittedAt: '2024-01-18',
      submissionFiles: ['solution.pdf'],
      maxMarks: 80,
      obtainedMarks: 72,
      feedback: 'Good work! Minor errors in equation 3. Please review the integration method.'
    },
    {
      id: 3,
      title: 'Physics Lab Report',
      subject: 'Physics',
      branch: 'CSE',
      dueDate: '2024-01-10',
      description: 'Prepare a detailed lab report on the pendulum experiment. Include observations, calculations, and error analysis.',
      attachments: ['lab_guidelines.pdf'],
      teacherName: 'Dr. Emily Rodriguez',
      createdAt: '2023-12-28',
      status: 'late',
      submittedAt: '2024-01-12',
      submissionFiles: ['lab_report.pdf'],
      maxMarks: 50,
      obtainedMarks: 35,
      feedback: 'Late submission. Good analysis but incomplete error calculations.'
    }
  ]);

  const [filteredAssignments, setFilteredAssignments] = useState(assignments);

  useEffect(() => {
    let filtered = assignments;
    
    // Filter by tab (status)
    if (activeTab !== 'all') {
      filtered = filtered.filter(assignment => {
        if (activeTab === 'pending') return assignment.status === 'pending';
        if (activeTab === 'submitted') return assignment.status === 'submitted';
        if (activeTab === 'late') return assignment.status === 'late';
        return true;
      });
    }
    
    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }
    
    setFilteredAssignments(filtered);
  }, [activeTab, selectedSubject, assignments]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-amber-400 bg-amber-900/20 border-amber-700';
      case 'submitted':
        return 'text-emerald-400 bg-emerald-900/20 border-emerald-700';
      case 'late':
        return 'text-red-400 bg-red-900/20 border-red-700';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'ri-time-line';
      case 'submitted':
        return 'ri-checkbox-circle-line';
      case 'late':
        return 'ri-error-warning-line';
      default:
        return 'ri-file-line';
    }
  };

  const getPriorityLevel = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { level: 'overdue', color: 'text-red-400', text: 'Overdue' };
    if (diffDays <= 1) return { level: 'urgent', color: 'text-red-400', text: `Due ${diffDays === 0 ? 'today' : 'tomorrow'}` };
    if (diffDays <= 3) return { level: 'soon', color: 'text-amber-400', text: `Due in ${diffDays} days` };
    return { level: 'normal', color: 'text-gray-400', text: `Due in ${diffDays} days` };
  };

  const assignmentCounts = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    late: assignments.filter(a => a.status === 'late').length
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">My Assignments</h1>
          <p className="text-gray-400">Track and submit your assignments</p>
        </div>
        
        {/* Subject Filter */}
        <div className="mt-4 md:mt-0">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Subjects</option>
            {studentData.subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap bg-gray-700 rounded-lg p-1 mb-6">
        {[
          { key: 'pending', label: 'Pending', icon: 'ri-time-line' },
          { key: 'submitted', label: 'Submitted', icon: 'ri-checkbox-circle-line' },
          { key: 'late', label: 'Late', icon: 'ri-error-warning-line' },
          { key: 'all', label: 'All', icon: 'ri-file-list-3-line' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label} ({assignmentCounts[tab.key]})
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${selectedSubject}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-file-list-3-line text-6xl text-gray-500 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No assignments found</h3>
              <p className="text-gray-500">
                {selectedSubject !== 'all' 
                  ? `No assignments found for ${selectedSubject}`
                  : `No ${activeTab === 'all' ? '' : activeTab} assignments`
                }
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const priority = getPriorityLevel(assignment.dueDate);
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{assignment.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <i className="ri-book-line mr-1"></i>
                              {assignment.subject}
                            </span>
                            <span className="flex items-center">
                              <i className="ri-user-star-line mr-1"></i>
                              {assignment.teacherName}
                            </span>
                            <span className={`flex items-center ${priority.color}`}>
                              <i className="ri-calendar-line mr-1"></i>
                              {priority.text}
                            </span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                            <i className={`${getStatusIcon(assignment.status)} mr-1`}></i>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-300 mb-4 line-clamp-2">{assignment.description}</p>
                      
                      {/* Attachments */}
                      {assignment.attachments.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                          <i className="ri-attachment-line text-gray-400"></i>
                          <div className="flex flex-wrap gap-2">
                            {assignment.attachments.map((file, index) => (
                              <button
                                key={index}
                                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
                              >
                                <i className="ri-download-line mr-1"></i>
                                {file}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submission Info */}
                      {assignment.status === 'submitted' && (
                        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-emerald-400 font-medium">
                              <i className="ri-checkbox-circle-line mr-2"></i>
                              Submitted on {new Date(assignment.submittedAt).toLocaleDateString()}
                            </span>
                            {assignment.obtainedMarks !== null && (
                              <span className="text-white font-semibold">
                                {assignment.obtainedMarks}/{assignment.maxMarks} marks
                              </span>
                            )}
                          </div>
                          {assignment.submissionFiles.length > 0 && (
                            <div className="flex items-center space-x-2 mb-2">
                              <i className="ri-file-line text-emerald-400"></i>
                              <div className="flex flex-wrap gap-2">
                                {assignment.submissionFiles.map((file, index) => (
                                  <span key={index} className="text-xs bg-emerald-800 text-emerald-200 px-2 py-1 rounded">
                                    {file}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {assignment.feedback && (
                            <div className="mt-2">
                              <p className="text-sm text-emerald-200">
                                <i className="ri-chat-quote-line mr-1"></i>
                                <strong>Feedback:</strong> {assignment.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {assignment.status === 'late' && (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-red-400 font-medium">
                              <i className="ri-error-warning-line mr-2"></i>
                              Late submission on {new Date(assignment.submittedAt).toLocaleDateString()}
                            </span>
                            {assignment.obtainedMarks !== null && (
                              <span className="text-white font-semibold">
                                {assignment.obtainedMarks}/{assignment.maxMarks} marks
                              </span>
                            )}
                          </div>
                          {assignment.feedback && (
                            <p className="text-sm text-red-200 mt-2">
                              <i className="ri-chat-quote-line mr-1"></i>
                              <strong>Feedback:</strong> {assignment.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                      {assignment.status === 'pending' ? (
                        <>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm">
                            <i className="ri-upload-line mr-1"></i>
                            Submit Assignment
                          </button>
                          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 text-sm">
                            <i className="ri-eye-line mr-1"></i>
                            View Details
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 text-sm">
                          <i className="ri-eye-line mr-1"></i>
                          View Submission
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudentAssignments;