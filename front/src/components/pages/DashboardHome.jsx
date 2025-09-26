import React from 'react';
import { motion } from 'framer-motion';

const DashboardHome = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    { title: 'Total Students', value: '1,234', icon: 'ri-user-3-line', color: 'bg-blue-500' },
    { title: 'Active Courses', value: '56', icon: 'ri-book-line', color: 'bg-blue-600' },
    { title: 'Faculty Members', value: '89', icon: 'ri-group-line', color: 'bg-cyan-500' },
    { title: 'Pending Assignments', value: '23', icon: 'ri-file-list-3-line', color: 'bg-cyan-600' }
  ];

  const recentActivities = [
    { action: 'New student enrolled', user: 'John Doe', time: '2 hours ago', icon: 'ri-user-add-line' },
    { action: 'Assignment submitted', user: 'Jane Smith', time: '4 hours ago', icon: 'ri-file-upload-line' },
    { action: 'Grade published', user: 'Prof. Johnson', time: '6 hours ago', icon: 'ri-award-line' },
    { action: 'Course updated', user: 'Dr. Wilson', time: '1 day ago', icon: 'ri-book-mark-line' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userData?.name || 'User'}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening at the college today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 flex items-center justify-center">
                  <i className={`${activity.icon} text-[#3B82F6]`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-center">
              <i className="ri-user-add-line text-[#3B82F6] text-2xl mb-2 block" />
              <span className="text-sm font-medium text-[#3B82F6]">Add Student</span>
            </button>
            <button className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300 text-center">
              <i className="ri-book-line text-[#06B6D4] text-2xl mb-2 block" />
              <span className="text-sm font-medium text-[#06B6D4]">New Course</span>
            </button>
            <button className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 text-center">
              <i className="ri-file-list-3-line text-blue-600 text-2xl mb-2 block" />
              <span className="text-sm font-medium text-blue-600">Assignment</span>
            </button>
            <button className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 text-center">
              <i className="ri-calendar-event-line text-cyan-600 text-2xl mb-2 block" />
              <span className="text-sm font-medium text-cyan-600">Schedule Event</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;