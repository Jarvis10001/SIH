import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
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
        toast.error('Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Error fetching attendance records');
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
        toast.error('Please select a valid Excel (.xlsx, .xls) or CSV file');
        e.target.value = '';
      }
    }
  };

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!uploadData.branch || !uploadData.subject) {
      toast.error('Please select branch and subject');
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
        toast.success('Attendance uploaded successfully');
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
        toast.error(result.message || 'Failed to upload attendance');
        if (result.errors) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading attendance file');
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
        toast.success('Attendance record deleted successfully');
        fetchAttendanceRecords();
      } else {
        toast.error('Failed to delete attendance record');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting attendance record');
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
    toast.info('Template downloaded! Fill in the SID and Status columns, then upload back through this page.');
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Attendance Management</h1>
              <p className="text-gray-600">Upload and manage student attendance records</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download size={20} />
                Template
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={20} />
                Upload Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch & Year</label>
              <select
                value={filters.branch}
                onChange={(e) => setFilters({...filters, branch: e.target.value, subject: ''})} // Reset subject when branch changes
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Branches</option>
                {teacherBranches.slice(1).map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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

        {/* Attendance Records */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading attendance records...</p>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="p-8 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statistics
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(record.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(record.timeSlot.startTime)} - {formatTime(record.timeSlot.endTime)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.classInfo.subject}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.classInfo.className} - {record.classInfo.section} | Sem {record.classInfo.semester}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.statistics.attendancePercentage}% Present
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.statistics.presentCount}/{record.statistics.totalStudents} students
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewRecord(record)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Upload Attendance</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpload} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Class Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Class Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch & Year *
                    </label>
                    <select
                      required
                      value={uploadData.branch}
                      onChange={(e) => {
                        setUploadData({...uploadData, branch: e.target.value, subject: ''}); // Reset subject when branch changes
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={uploadData.subject}
                      onChange={(e) => setUploadData({...uploadData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadData.academicYear}
                      onChange={(e) => setUploadData({...uploadData, academicYear: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2024-25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={uploadData.date}
                      onChange={(e) => setUploadData({...uploadData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={uploadData.startTime}
                      onChange={(e) => setUploadData({...uploadData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={uploadData.endTime}
                      onChange={(e) => setUploadData({...uploadData, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Upload File</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-500 font-medium">
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
                          <p className="text-gray-500">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Excel (.xlsx, .xls) or CSV files up to 5MB
                        </p>
                        {selectedFile && (
                          <div className="mt-4 text-sm text-gray-900">
                            Selected: {selectedFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Format Instructions */}
                  <div className="md:col-span-2 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">File Format Requirements:</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Your Excel/CSV file should have this simple format:
                    </p>
                    <ul className="text-sm text-blue-800 list-disc list-inside space-y-1 mb-3">
                      <li><strong>First row:</strong> Date (optional) - e.g., "Date: 12/25/2024" or just "12/25/2024"</li>
                      <li><strong>Column A:</strong> Student IDs (SID) - e.g., STU001, STU002, etc.</li>
                      <li><strong>Column B:</strong> Attendance Status - Present/Absent/Late/Excused (or P/A/L/E, Y/N, 1/0)</li>
                    </ul>
                    <div className="bg-white rounded p-3 text-xs text-gray-700 border">
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
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Attendance Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Class Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Class Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Subject:</strong> {selectedRecord.classInfo.subject}</p>
                      <p><strong>Class:</strong> {selectedRecord.classInfo.className}</p>
                      <p><strong>Section:</strong> {selectedRecord.classInfo.section}</p>
                      <p><strong>Semester:</strong> {selectedRecord.classInfo.semester}</p>
                      <p><strong>Academic Year:</strong> {selectedRecord.classInfo.academicYear}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Session Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Date:</strong> {formatDate(selectedRecord.date)}</p>
                      <p><strong>Time:</strong> {formatTime(selectedRecord.timeSlot.startTime)} - {formatTime(selectedRecord.timeSlot.endTime)}</p>
                      <p><strong>Teacher:</strong> {selectedRecord.teacherInfo.teacherName}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Attendance Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedRecord.statistics.totalStudents}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{selectedRecord.statistics.presentCount}</div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{selectedRecord.statistics.absentCount}</div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedRecord.statistics.attendancePercentage}%</div>
                      <div className="text-sm text-gray-600">Attendance</div>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Student Attendance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll Number</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedRecord.studentAttendance.map((student, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{student.studentId}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{student.studentName}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{student.rollNumber}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.status === 'Present' ? 'bg-green-100 text-green-800' :
                                student.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                student.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">{student.remarks || '-'}</td>
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