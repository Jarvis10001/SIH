import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';
import { 
  Upload, 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  BookOpen, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-react';

const TeacherAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    branch: '',
    subject: ''
  });

  // Teacher's branches and subjects data - same structure as other pages
  const teacherBranches = [
    {
      id: 'all',
      name: 'All Branches',
      subjects: []
    },
    {
      id: 'cse-2021',
      name: 'CSE 2021 Batch',
      branchName: 'Computer Science Engineering',
      year: '2021',
      subjects: [
        { id: 'cs101', name: 'Programming Fundamentals' },
        { id: 'cs102', name: 'Data Structures' }
      ]
    },
    {
      id: 'cse-2022', 
      name: 'CSE 2022 Batch',
      branchName: 'Computer Science Engineering',
      year: '2022',
      subjects: [
        { id: 'cs301', name: 'Database Management Systems' },
        { id: 'cs302', name: 'Computer Networks' }
      ]
    },
    {
      id: 'ece-2021',
      name: 'ECE 2021 Batch',
      branchName: 'Electronics & Communication',
      year: '2021',
      subjects: [
        { id: 'ec101', name: 'Circuit Analysis' },
        { id: 'ec102', name: 'Electronic Devices' }
      ]
    },
    {
      id: 'me-2022',
      name: 'ME 2022 Batch',
      branchName: 'Mechanical Engineering',
      year: '2022',
      subjects: [
        { id: 'me301', name: 'Thermodynamics' },
        { id: 'me302', name: 'Fluid Mechanics' }
      ]
    }
  ];

  // Upload form data
  const [uploadData, setUploadData] = useState({
    branch: '',
    subject: '',
    academicYear: '2024-25',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00'
  });

  // Fetch attendance records
  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('teacherToken');
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.subject) queryParams.append('subject', filters.subject);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/teacher?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAttendanceRecords(result.data || []);
      } else {
        console.error('Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      console.error('Error fetching attendance records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type) || file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid Excel (.xlsx, .xls) or CSV file');
        e.target.value = '';
      }
    }
  };

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!uploadData.branch || !uploadData.subject) {
      alert('Please select branch and subject');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('attendanceFile', selectedFile);
      
      // Append upload data
      Object.keys(uploadData).forEach(key => {
        formData.append(key, uploadData[key]);
      });

      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Attendance uploaded successfully');
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadData({
          branch: '',
          subject: '',
          academicYear: '2024-25',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '10:00'
        });
        fetchAttendanceRecords();
      } else {
        alert(result.message || 'Failed to upload attendance');
        if (result.errors) {
          result.errors.forEach(error => console.error(error));
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error uploading attendance file');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      const token = localStorage.getItem('teacherToken');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Attendance record deleted successfully');
        fetchAttendanceRecords();
      } else {
        alert('Failed to delete attendance record');
      }
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error deleting attendance record');
    }
  };

  // View record details
  const viewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  // Download sample template
  const downloadTemplate = () => {
    const today = new Date().toISOString().split('T')[0];
    const csvContent = `# Student Attendance Template
# Instructions:
# 1. Fill in your class information below (optional header info)
# 2. Update the SID and Status columns with your student data
# 3. Status options: Present, Absent, Late, Excused (or P/A/L/E)
# 4. Save as CSV and upload through the dashboard

Date: ${today}
Class: [Your Subject] - Section [A/B/C] - Semester [1-8]
Teacher: [Your Name] ([Your Teacher ID])

SID,Status
STU001,Present
STU002,Absent
STU003,Present
STU004,Late
STU005,Excused
STU006,Present
STU007,Absent
STU008,Late
STU009,Present
STU010,Excused`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_template_${today}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Show help message
    console.log('Template downloaded! Fill in the SID and Status columns, then upload back through this page.');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Clean Header with AcademiX Theme */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-xl mb-8 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Users size={28} className="text-white" />
                  </div>
                  Attendance Management
                </h1>
                <p className="text-indigo-100 text-lg">
                  Track and manage student attendance with ease
                </p>
                <div className="flex items-center gap-4 text-indigo-200 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    Academic Year 2024-25
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
                >
                  <Download size={20} />
                  Download Template
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                >
                  <Upload size={20} />
                  Upload Attendance
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/90 rounded-2xl shadow-xl mb-8 border border-slate-700/30"
        >
          <div className="p-6 border-b border-slate-700/30">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <AlertCircle size={20} className="text-indigo-400" />
              </div>
              Filter Records
            </h2>
            <p className="text-slate-400 mt-1">Narrow down your attendance records</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Start Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-slate-600/30 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">End Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-slate-600/30 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Branch & Year</label>
                <div className="relative">
                  <BookOpen size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select
                    value={filters.branch}
                    onChange={(e) => setFilters({...filters, branch: e.target.value, subject: ''})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-slate-600/30 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none"
                  >
                    <option value="">All Branches</option>
                    {teacherBranches.slice(1).map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Subject</label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-slate-600/30 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 appearance-none disabled:opacity-50"
                    disabled={!filters.branch}
                  >
                    <option value="">All Subjects</option>
                    {filters.branch && teacherBranches.find(b => b.id === filters.branch)?.subjects?.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Attendance Records */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/90 rounded-2xl shadow-xl border border-slate-700/30"
        >
          <div className="p-6 border-b border-slate-700/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  Attendance Records
                </h2>
                <p className="text-gray-400 mt-1">Manage your class attendance data</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-white">{attendanceRecords.length}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading attendance records...</p>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="p-4 bg-slate-700/50 rounded-2xl w-fit mx-auto mb-4">
                <FileText size={48} className="text-slate-500 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No Records Found</h3>
              <p className="text-slate-500">Upload attendance data to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Class Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Attendance Stats
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {attendanceRecords.map((record, index) => (
                    <motion.tr 
                      key={record._id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/30 transition-all duration-300"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {formatDate(record.date)}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center gap-1">
                              <Clock size={14} />
                              {formatTime(record.timeSlot.startTime)} - {formatTime(record.timeSlot.endTime)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {record.classInfo.subject}
                            </div>
                            <div className="text-sm text-gray-400">
                              {record.classInfo.className} - {record.classInfo.section} | Sem {record.classInfo.semester}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Users className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">
                                {record.statistics.attendancePercentage}%
                              </span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.statistics.attendancePercentage >= 75 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : record.statistics.attendancePercentage >= 50
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {record.statistics.attendancePercentage >= 75 ? 'Good' : 
                                 record.statistics.attendancePercentage >= 50 ? 'Average' : 'Low'}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">
                              {record.statistics.presentCount}/{record.statistics.totalStudents} students present
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => viewRecord(record)}
                            className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg transition-all duration-300"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(record._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${themeClasses.primaryCard} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div className={`p-6 border-b ${themeClasses.border}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>Upload Attendance</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className={`${themeClasses.text.muted} hover:${themeClasses.text.secondary}`}
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpload} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Class Information */}
                  <div className="md:col-span-2">
                    <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-4`}>Class Information</h3>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Branch & Year *
                    </label>
                    <select
                      required
                      value={uploadData.branch}
                      onChange={(e) => {
                        setUploadData({...uploadData, branch: e.target.value, subject: ''}); // Reset subject when branch changes
                      }}
                      className={`w-full px-3 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      <option value="">Select a branch</option>
                      {teacherBranches.slice(1).map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Subject *
                    </label>
                    <select
                      required
                      value={uploadData.subject}
                      onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                      className={`w-full px-3 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      disabled={!uploadData.branch}
                    >
                      <option value="">Select a subject</option>
                      {uploadData.branch && teacherBranches.find(b => b.id === uploadData.branch)?.subjects?.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadData.academicYear}
                      onChange={(e) => setUploadData({...uploadData, academicYear: e.target.value})}
                      className={`w-full px-3 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="e.g., 2024-25"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={uploadData.date}
                      onChange={(e) => setUploadData({...uploadData, date: e.target.value})}
                      className={`w-full px-3 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={uploadData.startTime}
                      onChange={(e) => setUploadData({...uploadData, startTime: e.target.value})}
                      className={`w-full px-3 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      End Time
                    </label>
                    <input
                      type="time"
                      value={uploadData.endTime}
                      onChange={(e) => setUploadData({...uploadData, endTime: e.target.value})}
                      className={`w-full px-3 py-2 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="md:col-span-2">
                    <h3 className={`text-lg font-medium ${themeClasses.text.primary} mb-4 mt-6`}>Upload File</h3>
                    <div className={`border-2 border-dashed ${themeClasses.border} rounded-lg p-6`}>
                      <div className="text-center">
                        <Upload className={`mx-auto h-12 w-12 ${themeClasses.text.muted}`} />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className={`${themeClasses.text.accent} hover:opacity-80 font-medium`}>
                              Upload a file
                            </span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".xlsx,.xls,.csv"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className={themeClasses.text.secondary}>or drag and drop</p>
                        </div>
                        <p className={`text-xs ${themeClasses.text.muted} mt-2`}>
                          Excel (.xlsx, .xls) or CSV files up to 5MB
                        </p>
                        {selectedFile && (
                          <div className={`mt-4 text-sm ${themeClasses.text.primary}`}>
                            Selected: {selectedFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Format Instructions */}
                  <div className={`md:col-span-2 ${themeClasses.surface} rounded-lg p-4`}>
                    <h4 className={`font-medium ${themeClasses.text.accent} mb-2`}>File Format Requirements:</h4>
                    <p className={`text-sm ${themeClasses.text.secondary} mb-2`}>
                      Your Excel/CSV file should have this simple format:
                    </p>
                    <ul className={`text-sm ${themeClasses.text.secondary} list-disc list-inside space-y-1 mb-3`}>
                      <li><strong>First row:</strong> Date (optional) - e.g., "Date: 12/25/2024" or just "12/25/2024"</li>
                      <li><strong>Column A:</strong> Student IDs (SID) - e.g., STU001, STU002, etc.</li>
                      <li><strong>Column B:</strong> Attendance Status - Present/Absent/Late/Excused (or P/A/L/E, Y/N, 1/0)</li>
                    </ul>
                    <div className={`${themeClasses.primaryCard} rounded p-3 text-xs ${themeClasses.text.secondary} border ${themeClasses.border}`}>
                      <div className="font-medium mb-1">Example format:</div>
                      <div>Date: 12/25/2024</div>
                      <div>STU001 | Present</div>
                      <div>STU002 | Absent</div>
                      <div>STU003 | P</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className={`px-4 py-2 ${themeClasses.button.secondary} rounded-lg transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Attendance
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800/90 rounded-2xl shadow-xl border border-slate-700/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-700/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Attendance Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Class Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3">Class Information</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <p><strong className="text-indigo-400">Subject:</strong> {selectedRecord.classInfo.subject}</p>
                      <p><strong className="text-indigo-400">Class:</strong> {selectedRecord.classInfo.className}</p>
                      <p><strong className="text-indigo-400">Section:</strong> {selectedRecord.classInfo.section}</p>
                      <p><strong className="text-indigo-400">Semester:</strong> {selectedRecord.classInfo.semester}</p>
                      <p><strong className="text-indigo-400">Academic Year:</strong> {selectedRecord.classInfo.academicYear}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-3">Session Details</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <p><strong className="text-indigo-400">Date:</strong> {formatDate(selectedRecord.date)}</p>
                      <p><strong className="text-indigo-400">Time:</strong> {formatTime(selectedRecord.timeSlot.startTime)} - {formatTime(selectedRecord.timeSlot.endTime)}</p>
                      <p><strong className="text-indigo-400">Teacher:</strong> {selectedRecord.teacherInfo.teacherName}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-indigo-500/10 rounded-lg p-4 mb-6 border border-indigo-500/20">
                  <h3 className="text-lg font-medium text-white mb-3">Attendance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-indigo-400">{selectedRecord.statistics.totalStudents}</div>
                      <div className="text-sm text-slate-400">Total Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">{selectedRecord.statistics.presentCount}</div>
                      <div className="text-sm text-slate-400">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{selectedRecord.statistics.absentCount}</div>
                      <div className="text-sm text-slate-400">Absent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{selectedRecord.statistics.attendancePercentage}%</div>
                      <div className="text-sm text-slate-400">Attendance</div>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Student Attendance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-slate-600/30 rounded-lg">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Student ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Roll Number</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-700/30 divide-y divide-slate-600/30">
                        {selectedRecord.studentAttendance.map((student, index) => (
                          <tr key={index} className="hover:bg-slate-700/50">
                            <td className="px-4 py-2 text-sm text-white">{student.studentId}</td>
                            <td className="px-4 py-2 text-sm text-white">{student.studentName}</td>
                            <td className="px-4 py-2 text-sm text-white">{student.rollNumber}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' :
                                student.status === 'Absent' ? 'bg-red-500/20 text-red-400' :
                                student.status === 'Late' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-slate-400">{student.remarks || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherAttendance;