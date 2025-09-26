import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
  TrendingUp, 
  Filter,
  Eye,
  Download,
  PieChart,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Search,
  RefreshCw
} from 'lucide-react';

const StudentAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    academicYear: '2024-2025',
    semester: '',
    subject: '',
    startDate: '',
    endDate: ''
  });
  const [statistics, setStatistics] = useState({
    totalClasses: 0,
    attendedClasses: 0,
    overallPercentage: 0,
    subjectWiseStats: []
  });

  // Get student ID from localStorage
  const studentData = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = studentData.studentId || studentData.id || 'STU001';

  // Fetch attendance records
  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.academicYear) queryParams.append('academicYear', filters.academicYear);
      if (filters.semester) queryParams.append('semester', filters.semester);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/attendance/student/${studentId}?${queryParams}`;
      console.log('Fetching attendance from:', apiUrl);
      console.log('Student ID:', studentId);
      console.log('Filters:', filters);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Attendance API response:', result);
        
        // If no records found with academic year filter, try without it
        if (result.data && result.data.length === 0 && filters.academicYear) {
          console.log('No records found with academic year filter, trying without filter...');
          
          const fallbackResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/student/${studentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (fallbackResponse.ok) {
            const fallbackResult = await fallbackResponse.json();
            console.log('Fallback API response:', fallbackResult);
            
            if (fallbackResult.data && fallbackResult.data.length > 0) {
              setAttendanceRecords(fallbackResult.data);
              calculateStatistics(fallbackResult.data);
              toast.info(`Found ${fallbackResult.data.length} records. Academic year filter may not match your data.`);
              return;
            }
          }
        }
        
        setAttendanceRecords(result.data || []);
        calculateStatistics(result.data || []);
        
        if (result.data && result.data.length === 0) {
          console.warn('No attendance records found. Check filters:', filters);
        }
      } else {
        const errorData = await response.json();
        console.error('Attendance API error:', errorData);
        toast.error(errorData.message || 'Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Error fetching attendance records');
    } finally {
      setLoading(false);
    }
  }, [studentId, filters]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  // Calculate attendance statistics
  const calculateStatistics = (records) => {
    if (!records || records.length === 0) {
      setStatistics({
        totalClasses: 0,
        attendedClasses: 0,
        overallPercentage: 0,
        subjectWiseStats: []
      });
      return;
    }

    const totalClasses = records.length;
    const attendedClasses = records.filter(record => 
      record.attendance && ['Present', 'Late'].includes(record.attendance.status)
    ).length;
    const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // Calculate subject-wise statistics
    const subjectMap = {};
    records.forEach(record => {
      const subject = record.classInfo.subject;
      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          totalClasses: 0,
          attendedClasses: 0,
          percentage: 0
        };
      }
      subjectMap[subject].totalClasses++;
      if (record.attendance && ['Present', 'Late'].includes(record.attendance.status)) {
        subjectMap[subject].attendedClasses++;
      }
    });

    const subjectWiseStats = Object.values(subjectMap).map(stat => ({
      ...stat,
      percentage: stat.totalClasses > 0 ? Math.round((stat.attendedClasses / stat.totalClasses) * 100) : 0
    }));

    setStatistics({
      totalClasses,
      attendedClasses,
      overallPercentage,
      subjectWiseStats
    });
  };

  // View record details
  const viewRecord = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'Absent':
        return <XCircle size={16} className="text-red-600" />;
      case 'Late':
        return <ClockIcon size={16} className="text-yellow-600" />;
      case 'Excused':
        return <AlertCircle size={16} className="text-blue-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  // Get percentage color
  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Attendance</h1>
              <p className="text-gray-600">Track your class attendance and performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchAttendanceRecords}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                <p className={`text-3xl font-bold ${getPercentageColor(statistics.overallPercentage)}`}>
                  {statistics.overallPercentage}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {statistics.attendedClasses} of {statistics.totalClasses} classes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalClasses}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">This semester</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Classes Attended</p>
                <p className="text-3xl font-bold text-green-600">{statistics.attendedClasses}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Present + Late</p>
          </div>
        </div>

        {/* Subject-wise Statistics */}
        {statistics.subjectWiseStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.subjectWiseStats.map((stat, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">{stat.subject}</h3>
                    <span className={`text-lg font-bold ${getPercentageColor(stat.percentage)}`}>
                      {stat.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.percentage >= 85 ? 'bg-green-500' :
                        stat.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {stat.attendedClasses}/{stat.totalClasses} classes
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <select
                value={filters.academicYear}
                onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2022-2023">2022-2023</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({...filters, semester: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                placeholder="Filter by subject"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No attendance records found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or check back later</p>
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
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {record.teacherInfo.teacherName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.attendance ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.attendance.status)}`}>
                            {getStatusIcon(record.attendance.status)}
                            {record.attendance.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
                            <AlertCircle size={16} className="text-gray-600" />
                            No Record
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewRecord(record)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedRecord && (
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
                  <h2 className="text-xl font-semibold text-gray-900">Class Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
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

                {/* Attendance Status */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">My Attendance</h3>
                  {selectedRecord.attendance ? (
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRecord.attendance.status)}`}>
                        {getStatusIcon(selectedRecord.attendance.status)}
                        {selectedRecord.attendance.status}
                      </span>
                      {selectedRecord.attendance.remarks && (
                        <p className="text-sm text-gray-600">
                          <strong>Remarks:</strong> {selectedRecord.attendance.remarks}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No attendance record found</p>
                  )}
                </div>

                {/* Class Statistics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Class Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedRecord.classStatistics.totalStudents}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{selectedRecord.classStatistics.presentCount}</div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{selectedRecord.classStatistics.absentCount}</div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{selectedRecord.classStatistics.attendancePercentage}%</div>
                      <div className="text-sm text-gray-600">Class Attendance</div>
                    </div>
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

export default StudentAttendance;