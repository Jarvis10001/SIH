import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import { motion } from 'framer-motion';

const TeacherTopNav = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const teacherData = JSON.parse(localStorage.getItem('teacherData') || '{}');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'assignment',
      title: 'New Assignment Submission',
      message: '5 students submitted Assignment 3',
      time: '10 minutes ago',
      icon: 'ri-file-list-line',
      color: 'blue'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Attendance Reminder',
      message: 'Please mark attendance for CS-101',
      time: '30 minutes ago',
      icon: 'ri-calendar-check-line',
      color: 'green'
    },
    {
      id: 3,
      type: 'grade',
      title: 'Grade Deadline',
      message: 'Grade submission due in 2 days',
      time: '1 hour ago',
      icon: 'ri-bar-chart-line',
      color: 'orange'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            className="hidden md:flex p-2 rounded-xl hover:bg-[#3B82F6]/10 text-[#3B82F6] transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`ri-${isOpen ? 'menu-fold' : 'menu-unfold'}-line text-xl`} />
          </button>

          {/* Greeting */}
          <div className="hidden sm:block">
            <h2 className="text-xl font-bold text-[#3B82F6]">
              {getGreeting()}, {teacherData?.name?.split(' ')[0] || 'Teacher'}!
            </h2>
            <p className="text-sm text-[#06B6D4]">
              {teacherData?.department || 'Department'} • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="p-2 rounded-xl bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] transition-colors duration-300" title="Mark Attendance">
              <i className="ri-calendar-check-line text-lg" />
            </button>
            <button className="p-2 rounded-xl bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 text-[#06B6D4] transition-colors duration-300" title="Create Assignment">
              <i className="ri-file-add-line text-lg" />
            </button>
            <button className="p-2 rounded-xl bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] transition-colors duration-300" title="Grade Submissions">
              <i className="ri-bar-chart-line text-lg" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 rounded-xl hover:bg-[#3B82F6]/10 text-[#3B82F6] transition-all duration-300"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="ri-notification-3-line text-xl" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#333333]">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-${notification.color}-50`}>
                          <i className={`${notification.icon} text-${notification.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#333333] text-sm">{notification.title}</h4>
                          <p className="text-[#6C757D] text-xs mt-1">{notification.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <button className="text-[#3B82F6] text-sm font-medium hover:text-[#2563EB] transition-colors">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Teacher Profile */}
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#3B82F6]/10 transition-colors duration-300">
            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-semibold">
              <span className="text-sm">
                {teacherData?.name?.charAt(0)?.toUpperCase() || 'T'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#3B82F6]">
                {teacherData?.name || 'Teacher'}
              </p>
              <p className="text-xs text-[#06B6D4]">
                {teacherData?.teacherId || 'ID: N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default TeacherTopNav;