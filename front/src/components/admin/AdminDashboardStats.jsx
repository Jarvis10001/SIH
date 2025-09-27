import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminDashboardStats = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);

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
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    },
    card: 'bg-gray-800 border border-gray-700'
  };

  // Mock comprehensive statistics
  const mockStats = {
    overview: {
      totalStudents: 2845,
      totalFaculty: 127,
      totalCourses: 245,
      activeQueries: 34,
      pendingAdmissions: 156,
      libraryBooks: 12540,
      hostelOccupancy: 89.5,
      attendanceRate: 94.2
    },
    trends: {
      studentGrowth: 12.5,
      facultyGrowth: 8.3,
      courseCompletion: 91.7,
      queryResolution: 87.2,
      libraryUsage: 76.8,
      hostelSatisfaction: 92.1
    },
    academic: {
      currentSemester: 'Fall 2025',
      examsPending: 23,
      resultsPublished: 187,
      averageGPA: 3.42,
      topPerformers: 156,
      improvementNeeded: 89,
      scholarshipEligible: 234
    },
    financial: {
      totalRevenue: 15420000,
      pendingFees: 2340000,
      scholarshipAmount: 890000,
      infrastructureSpent: 5670000,
      collectionRate: 85.2,
      budgetUtilization: 78.9
    },
    facilities: {
      totalClassrooms: 56,
      labsAvailable: 23,
      libraryCapacity: 800,
      hostelRooms: 456,
      sportsComplexes: 3,
      cafeterias: 4,
      maintenanceIssues: 12,
      upgradesPending: 8
    }
  };

  const mockActivities = [
    {
      id: 1,
      type: 'admission',
      title: 'New Student Admission',
      description: '15 new students admitted for Fall 2025 semester',
      timestamp: '2025-09-28 10:30 AM',
      icon: 'ri-user-add-line',
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'grades',
      title: 'Grades Published',
      description: 'Mid-term results published for CS301 - Data Structures',
      timestamp: '2025-09-28 09:15 AM',
      icon: 'ri-bar-chart-line',
      color: 'text-blue-400'
    },
    {
      id: 3,
      type: 'query',
      title: 'Query Resolved',
      description: 'Student query about library access resolved',
      timestamp: '2025-09-28 08:45 AM',
      icon: 'ri-question-answer-line',
      color: 'text-indigo-400'
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Maintenance Completed',
      description: 'AC repair completed in Block A, Room 304',
      timestamp: '2025-09-27 06:30 PM',
      icon: 'ri-tools-line',
      color: 'text-yellow-400'
    },
    {
      id: 5,
      type: 'event',
      title: 'Event Scheduled',
      description: 'Tech Fest 2025 registration opens tomorrow',
      timestamp: '2025-09-27 04:20 PM',
      icon: 'ri-calendar-event-line',
      color: 'text-purple-400'
    },
    {
      id: 6,
      type: 'faculty',
      title: 'New Faculty Onboarding',
      description: 'Dr. Sarah Johnson joined Computer Science Department',
      timestamp: '2025-09-27 02:10 PM',
      icon: 'ri-group-line',
      color: 'text-cyan-400'
    }
  ];

  useEffect(() => {
    setStats(mockStats);
    setRecentActivities(mockActivities);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const quickStats = [
    {
      title: 'Total Students',
      value: stats.overview?.totalStudents || 0,
      change: '+12.5%',
      icon: 'ri-user-line',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900'
    },
    {
      title: 'Faculty Members',
      value: stats.overview?.totalFaculty || 0,
      change: '+8.3%', 
      icon: 'ri-group-line',
      color: 'text-green-400',
      bgColor: 'bg-green-900'
    },
    {
      title: 'Active Courses',
      value: stats.overview?.totalCourses || 0,
      change: '+5.7%',
      icon: 'ri-book-open-line',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900'
    },
    {
      title: 'Pending Queries',
      value: stats.overview?.activeQueries || 0,
      change: '-15.2%',
      icon: 'ri-question-line',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900'
    }
  ];

  const academicStats = [
    {
      title: 'Average GPA',
      value: stats.academic?.averageGPA || 0,
      subtitle: 'Current Semester',
      icon: 'ri-star-line',
      color: 'text-yellow-400'
    },
    {
      title: 'Attendance Rate',
      value: formatPercentage(stats.overview?.attendanceRate || 0),
      subtitle: 'Overall Average',
      icon: 'ri-calendar-check-line',
      color: 'text-green-400'
    },
    {
      title: 'Results Published',
      value: stats.academic?.resultsPublished || 0,
      subtitle: 'This Semester',
      icon: 'ri-file-text-line',
      color: 'text-blue-400'
    },
    {
      title: 'Scholarship Eligible',
      value: stats.academic?.scholarshipEligible || 0,
      subtitle: 'Students',
      icon: 'ri-award-line',
      color: 'text-indigo-400'
    }
  ];

  const facilityStats = [
    {
      title: 'Classrooms',
      value: stats.facilities?.totalClassrooms || 0,
      status: 'operational',
      icon: 'ri-building-line'
    },
    {
      title: 'Labs',
      value: stats.facilities?.labsAvailable || 0,
      status: 'active',
      icon: 'ri-flask-line'
    },
    {
      title: 'Library Capacity', 
      value: stats.facilities?.libraryCapacity || 0,
      status: 'available',
      icon: 'ri-book-2-line'
    },
    {
      title: 'Hostel Occupancy',
      value: formatPercentage(stats.overview?.hostelOccupancy || 0),
      status: 'occupied',
      icon: 'ri-home-4-line'
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Admin Dashboard
            </h1>
            <p className={themeClasses.text.secondary}>
              Comprehensive overview of college administration and statistics
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-4 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
              <option value="year">This Year</option>
            </select>

            <button className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}>
              <i className="ri-download-line mr-2"></i>
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              className={`${themeClasses.card} p-6 rounded-lg hover:shadow-lg transition-all duration-200`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.bgColor} bg-opacity-20`}>
                  <i className={`${stat.icon} text-2xl ${stat.color}`}></i>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  stat.change.startsWith('+') ? 'text-green-400 bg-green-900' : 'text-red-400 bg-red-900'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mb-1`}>
                {stat.value.toLocaleString()}
              </h3>
              <p className={`text-sm ${themeClasses.text.muted}`}>{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Academic Performance */}
          <div className="lg:col-span-2">
            <div className={`${themeClasses.card} p-6 rounded-lg`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
                Academic Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {academicStats.map((stat, index) => (
                  <div key={index} className={`${themeClasses.surface} p-4 rounded-lg text-center`}>
                    <i className={`${stat.icon} text-2xl ${stat.color} mb-2 block`}></i>
                    <h4 className={`text-lg font-bold ${themeClasses.text.primary}`}>
                      {stat.value}
                    </h4>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.title}</p>
                    <p className={`text-xs ${themeClasses.text.muted} mt-1`}>{stat.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <div className={`${themeClasses.card} p-6 rounded-lg`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
                Recent Activities
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${themeClasses.surface} ${activity.color}`}>
                      <i className={`${activity.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${themeClasses.text.primary} text-sm`}>
                        {activity.title}
                      </h4>
                      <p className={`text-xs ${themeClasses.text.secondary} mt-1`}>
                        {activity.description}
                      </p>
                      <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${themeClasses.card} p-6 rounded-lg`}>
            <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
              Financial Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="ri-money-dollar-circle-line text-green-400 text-xl"></i>
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>Total Revenue</p>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Academic Year 2025</p>
                  </div>
                </div>
                <span className={`text-lg font-bold text-green-400`}>
                  {formatCurrency(stats.financial?.totalRevenue || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="ri-time-line text-yellow-400 text-xl"></i>
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>Pending Fees</p>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Outstanding Amount</p>
                  </div>
                </div>
                <span className={`text-lg font-bold text-yellow-400`}>
                  {formatCurrency(stats.financial?.pendingFees || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="ri-award-line text-indigo-400 text-xl"></i>
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>Scholarships</p>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Total Allocated</p>
                  </div>
                </div>
                <span className={`text-lg font-bold text-indigo-400`}>
                  {formatCurrency(stats.financial?.scholarshipAmount || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="ri-building-line text-purple-400 text-xl"></i>
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>Infrastructure</p>
                    <p className={`text-sm ${themeClasses.text.muted}`}>Development Spent</p>
                  </div>
                </div>
                <span className={`text-lg font-bold text-purple-400`}>
                  {formatCurrency(stats.financial?.infrastructureSpent || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Facility Status */}
          <div className={`${themeClasses.card} p-6 rounded-lg`}>
            <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
              Facility Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {facilityStats.map((facility, index) => (
                <div key={index} className={`${themeClasses.surface} p-4 rounded-lg text-center`}>
                  <i className={`${facility.icon} text-2xl ${themeClasses.accent} mb-2 block`}></i>
                  <h4 className={`text-lg font-bold ${themeClasses.text.primary}`}>
                    {facility.value}
                  </h4>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>{facility.title}</p>
                  <span className={`text-xs px-2 py-1 mt-2 rounded-full bg-green-900 text-green-300 inline-block`}>
                    {facility.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className={`${themeClasses.card} p-6 rounded-lg mb-8`}>
          <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
            Key Performance Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 border-green-400 flex items-center justify-center`}>
                <span className={`text-2xl font-bold text-green-400`}>91%</span>
              </div>
              <h4 className={`font-medium ${themeClasses.text.primary}`}>Course Completion</h4>
              <p className={`text-sm ${themeClasses.text.muted}`}>Students completing courses</p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 border-blue-400 flex items-center justify-center`}>
                <span className={`text-2xl font-bold text-blue-400`}>87%</span>
              </div>
              <h4 className={`font-medium ${themeClasses.text.primary}`}>Query Resolution</h4>
              <p className={`text-sm ${themeClasses.text.muted}`}>Queries resolved on time</p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 border-purple-400 flex items-center justify-center`}>
                <span className={`text-2xl font-bold text-purple-400`}>77%</span>
              </div>
              <h4 className={`font-medium ${themeClasses.text.primary}`}>Library Usage</h4>
              <p className={`text-sm ${themeClasses.text.muted}`}>Students using library</p>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 border-yellow-400 flex items-center justify-center`}>
                <span className={`text-2xl font-bold text-yellow-400`}>92%</span>
              </div>
              <h4 className={`font-medium ${themeClasses.text.primary}`}>Satisfaction Rate</h4>
              <p className={`text-sm ${themeClasses.text.muted}`}>Overall student satisfaction</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${themeClasses.card} p-6 rounded-lg`}>
          <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Add Student', icon: 'ri-user-add-line', color: 'bg-blue-600' },
              { name: 'Schedule Event', icon: 'ri-calendar-event-line', color: 'bg-green-600' },
              { name: 'Send Notice', icon: 'ri-notification-line', color: 'bg-yellow-600' },
              { name: 'Generate Report', icon: 'ri-file-chart-line', color: 'bg-purple-600' },
              { name: 'Manage Fees', icon: 'ri-money-dollar-circle-line', color: 'bg-indigo-600' },
              { name: 'System Settings', icon: 'ri-settings-3-line', color: 'bg-gray-600' }
            ].map((action, index) => (
              <motion.button
                key={index}
                className={`p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-all duration-200 text-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`${action.icon} text-2xl mb-2 block`}></i>
                <span className="text-sm font-medium">{action.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardStats;