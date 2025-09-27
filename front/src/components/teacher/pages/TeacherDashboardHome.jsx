import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { themeClasses, iconClasses } from '../../../styles/theme';

const TeacherDashboardHome = () => {
  const [teacherData, setTeacherData] = useState({});
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeBranches: 0,
    pendingAssignments: 0,
    upcomingClasses: 0
  });

  // Teacher's branches and subjects data - consistent with other components
  const teacherBranches = [
    {
      id: 'cse-2021',
      name: 'CSE 2021 Batch',
      branchName: 'Computer Science Engineering',
      year: '2021',
      students: 45,
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
      students: 38,
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
      students: 42,
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
      students: 31,
      subjects: [
        { id: 'me301', name: 'Thermodynamics' },
        { id: 'me302', name: 'Fluid Mechanics' }
      ]
    }
  ];

  useEffect(() => {
    const teacher = JSON.parse(localStorage.getItem('teacherData') || '{}');
    setTeacherData(teacher);

    // Calculate stats based on branch data
    const totalStudents = teacherBranches.reduce((sum, branch) => sum + branch.students, 0);
    const totalSubjects = teacherBranches.reduce((sum, branch) => sum + branch.subjects.length, 0);
    
    setStats({
      totalStudents: totalStudents,
      activeBranches: teacherBranches.length,
      pendingAssignments: 12,
      upcomingClasses: totalSubjects
    });
  }, []);

  const quickActions = [
    {
      title: 'Mark Attendance',
      description: 'Take attendance for today\'s classes',
      icon: 'ri-calendar-check-line',
      color: 'green',
      link: '/teacher/dashboard/attendance'
    },
    {
      title: 'Create Assignment',
      description: 'Add new assignment for students',
      icon: 'ri-file-add-line',
      color: 'blue',
      link: '/teacher/dashboard/assignments'
    },
    {
      title: 'Grade Submissions',
      description: 'Review and grade student work',
      icon: 'ri-bar-chart-line',
      color: 'purple',
      link: '/teacher/dashboard/grades'
    },
    {
      title: 'Upload Resources',
      description: 'Share study materials with students',
      icon: 'ri-upload-line',
      color: 'orange',
      link: '/teacher/dashboard/resources'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      title: 'Assignment submitted',
      description: '15 students from CSE 2021 submitted Data Structures assignment',
      time: '2 hours ago',
      icon: 'ri-file-list-line',
      color: 'blue'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Attendance marked',
      description: 'Programming Fundamentals class - CSE 2021 Batch attendance completed',
      time: '4 hours ago',
      icon: 'ri-calendar-check-line',
      color: 'green'
    },
    {
      id: 3,
      type: 'grade',
      title: 'Grades published',
      description: 'Circuit Analysis quiz results released for ECE 2021 Batch',
      time: '1 day ago',
      icon: 'ri-bar-chart-line',
      color: 'purple'
    },
    {
      id: 4,
      type: 'resource',
      title: 'Resource uploaded',
      description: 'Thermodynamics lecture notes shared with ME 2022 Batch',
      time: '2 days ago',
      icon: 'ri-folder-line',
      color: 'orange'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      subject: 'Data Structures',
      branch: 'CSE 2021 Batch',
      time: '10:00 AM - 11:30 AM',
      room: 'Room 204',
      students: 45
    },
    {
      id: 2,
      subject: 'Database Management Systems',
      branch: 'CSE 2022 Batch',
      time: '2:00 PM - 3:30 PM',
      room: 'Room 105',
      students: 38
    },
    {
      id: 3,
      subject: 'Circuit Analysis',
      branch: 'ECE 2021 Batch',
      time: '4:00 PM - 5:30 PM',
      room: 'Lab 3',
      students: 42
    }
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={themeClasses.primaryCard}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`${themeClasses.mutedText} text-sm`}>{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center border border-indigo-500/30`}>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${themeClasses.welcomeCard} shadow-xl`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {teacherData?.name || 'Teacher'}!
            </h1>
            <p className="text-indigo-100">
              {teacherData?.designation} • {teacherData?.department}
            </p>
            <p className="text-indigo-100 text-sm mt-1">
              Ready to inspire minds today? You have {stats.upcomingClasses} classes scheduled.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-user-star-line text-3xl text-white"></i>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="ri-user-3-line"
          color="bg-indigo-500"
        />
        <StatCard
          title="Active Branches"
          value={stats.activeBranches}
          icon="ri-book-line"
          color="bg-indigo-600"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingAssignments}
          icon="ri-file-list-3-line"
          color="bg-cyan-500"
        />
        <StatCard
          title="Classes Today"
          value={stats.upcomingClasses}
          icon="ri-calendar-line"
          color="bg-cyan-600"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-center"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <i className={`${action.icon} text-[#3B82F6] text-xl`}></i>
                </div>
                <h3 className="font-medium text-[#3B82F6] mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
            <Link
              to="/teacher/dashboard/schedule"
              className="text-[#3B82F6] hover:text-[#06B6D4] text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((class_item) => (
              <div key={class_item.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-[#3B82F6]/5 to-[#06B6D4]/5 rounded-lg hover:from-[#3B82F6]/10 hover:to-[#06B6D4]/10 transition-colors">
                <div>
                  <h3 className="font-semibold text-gray-800">{class_item.subject}</h3>
                  <p className="text-sm text-gray-600">{class_item.branch} • {class_item.room}</p>
                  <p className="text-sm text-gray-500">{class_item.students} students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{class_item.time}</p>
                  <button className="text-[#3B82F6] hover:text-[#06B6D4] text-sm font-medium transition-colors">
                    Take Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 flex items-center justify-center">
                  <i className={`${activity.icon} text-[#3B82F6]`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{activity.title}</h4>
                  <p className="text-gray-600 text-xs mt-1">{activity.description}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">This Week Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-blue-600 font-medium">Classes Conducted</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg">
            <div className="text-2xl font-bold text-cyan-600">89%</div>
            <div className="text-sm text-cyan-600 font-medium">Average Attendance</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">18</div>
            <div className="text-sm text-blue-600 font-medium">Assignments Graded</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboardHome;