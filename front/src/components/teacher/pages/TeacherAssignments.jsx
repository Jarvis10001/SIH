import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherAssignments = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Data Structures - Linear Arrays',
      subject: 'Computer Science',
      branch: 'CSE',
      dueDate: '2024-01-15',
      description: 'Implement basic array operations and demonstrate time complexity analysis.',
      attachments: ['assignment1.pdf'],
      submittedCount: 25,
      totalStudents: 45,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      title: 'Mathematical Analysis',
      subject: 'Mathematics',
      branch: 'CSE',
      dueDate: '2024-01-20',
      description: 'Solve differential equations using various methods.',
      attachments: ['math_problems.pdf'],
      submittedCount: 30,
      totalStudents: 45,
      createdAt: '2024-01-05'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    branch: '',
    description: '',
    dueDate: '',
    attachments: []
  });

  const subjects = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Electronics',
    'Mechanical Engineering'
  ];

  const branches = [
    'CSE - Computer Science Engineering',
    'ECE - Electronics & Communication',
    'EEE - Electrical & Electronics',
    'ME - Mechanical Engineering',
    'CE - Civil Engineering',
    'IT - Information Technology'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: assignments.length + 1,
      ...formData,
      branch: formData.branch.split(' - ')[0],
      submittedCount: 0,
      totalStudents: 45,
      createdAt: new Date().toISOString().split('T')[0],
      attachments: formData.attachments.map(file => file.name)
    };
    
    setAssignments(prev => [newAssignment, ...prev]);
    setFormData({
      title: '',
      subject: '',
      branch: '',
      description: '',
      dueDate: '',
      attachments: []
    });
    
    // Show success message or notification here
    alert('Assignment created successfully!');
  };

  const getStatusColor = (assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    const submissionRate = (assignment.submittedCount / assignment.totalStudents) * 100;
    
    if (dueDate < today) return 'text-red-600 bg-red-50';
    if (submissionRate >= 80) return 'text-emerald-600 bg-emerald-50';
    if (submissionRate >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-indigo-600 bg-indigo-50';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Assignment Management</h1>
          <p className="text-gray-400">Create and manage assignments for your courses</p>
        </div>
        <div className="flex bg-gray-700 rounded-lg p-1 mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <i className="ri-add-line mr-2"></i>
            Create Assignment
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <i className="ri-file-list-3-line mr-2"></i>
            Manage ({assignments.length})
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Create Assignment Form */}
            <div className="bg-gray-700/50 rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assignment Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Assignment Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Enter assignment title"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Branch *
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Assignment Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Provide detailed instructions for the assignment..."
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-400 mb-2">Click to upload files or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, DOC, TXT, PPT (max. 10MB each)</p>
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-600 rounded-lg p-3">
                          <div className="flex items-center">
                            <i className="ri-file-line text-indigo-400 mr-3"></i>
                            <span className="text-white text-sm">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 shadow-lg"
                  >
                    <i className="ri-send-plane-line mr-2"></i>
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'manage' && (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Assignment List */}
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-file-list-3-line text-6xl text-gray-500 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No assignments yet</h3>
                  <p className="text-gray-500">Create your first assignment to get started</p>
                </div>
              ) : (
                assignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{assignment.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center">
                                <i className="ri-book-line mr-1"></i>
                                {assignment.subject}
                              </span>
                              <span className="flex items-center">
                                <i className="ri-user-3-line mr-1"></i>
                                {assignment.branch}
                              </span>
                              <span className="flex items-center">
                                <i className="ri-calendar-line mr-1"></i>
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                            {assignment.submittedCount}/{assignment.totalStudents} submitted
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4 line-clamp-2">{assignment.description}</p>
                        
                        {assignment.attachments.length > 0 && (
                          <div className="flex items-center space-x-2 mb-4">
                            <i className="ri-attachment-line text-gray-400"></i>
                            <div className="flex flex-wrap gap-2">
                              {assignment.attachments.map((file, index) => (
                                <span key={index} className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                                  {file}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4 md:mt-0 md:ml-6">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm">
                          <i className="ri-eye-line mr-1"></i>
                          View Submissions
                        </button>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 text-sm">
                          <i className="ri-edit-line mr-1"></i>
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
                          <i className="ri-delete-bin-line mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherAssignments;