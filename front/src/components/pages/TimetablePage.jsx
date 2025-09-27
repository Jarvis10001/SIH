import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TimetablePage = () => {
  const [currentWeek, setCurrentWeek] = useState(0); // 0 for current week
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [showPeriodDetails, setShowPeriodDetails] = useState(false);
  const [viewMode, setViewMode] = useState('week'); // week, day
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

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
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    },
    input: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-500',
    card: 'bg-gray-800 border border-gray-700'
  };

  // Time slots for the timetable
  const timeSlots = [
    { id: 1, start: '08:30', end: '09:20', period: 'Period 1' },
    { id: 2, start: '09:30', end: '10:20', period: 'Period 2' },
    { id: 3, start: '10:30', end: '11:20', period: 'Period 3' },
    { id: 4, start: '11:30', end: '12:20', period: 'Period 4' },
    { id: 5, start: '12:30', end: '13:20', period: 'Lunch Break', isBreak: true },
    { id: 6, start: '13:30', end: '14:20', period: 'Period 5' },
    { id: 7, start: '14:30', end: '15:20', period: 'Period 6' },
    { id: 8, start: '15:30', end: '16:20', period: 'Period 7' },
    { id: 9, start: '16:30', end: '17:20', period: 'Period 8' }
  ];

  // Days of the week (Monday to Friday for academic schedule)
  const weekDays = [
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ];

  // Mock timetable data (would come from API)
  const mockTimetable = {
    1: { // Monday
      1: { subject: 'Data Structures & Algorithms', code: 'CS301', instructor: 'Dr. Sarah Wilson', room: 'CSE-101', type: 'Theory', color: 'bg-blue-500' },
      2: { subject: 'Database Management Systems', code: 'CS302', instructor: 'Prof. Michael Chen', room: 'CSE-102', type: 'Theory', color: 'bg-green-500' },
      3: { subject: 'Software Engineering', code: 'CS303', instructor: 'Dr. Emily Davis', room: 'CSE-103', type: 'Theory', color: 'bg-purple-500' },
      4: { subject: 'Computer Networks', code: 'CS304', instructor: 'Prof. James Rodriguez', room: 'CSE-104', type: 'Theory', color: 'bg-yellow-500' },
      6: { subject: 'DSA Lab', code: 'CS301L', instructor: 'Dr. Sarah Wilson', room: 'Lab-A', type: 'Lab', color: 'bg-blue-600' },
      7: { subject: 'DSA Lab', code: 'CS301L', instructor: 'Dr. Sarah Wilson', room: 'Lab-A', type: 'Lab', color: 'bg-blue-600' }
    },
    2: { // Tuesday
      1: { subject: 'Machine Learning', code: 'CS305', instructor: 'Dr. Alex Thompson', room: 'CSE-105', type: 'Theory', color: 'bg-red-500' },
      2: { subject: 'Operating Systems', code: 'CS306', instructor: 'Prof. Lisa Kumar', room: 'CSE-106', type: 'Theory', color: 'bg-indigo-500' },
      3: { subject: 'Data Structures & Algorithms', code: 'CS301', instructor: 'Dr. Sarah Wilson', room: 'CSE-101', type: 'Theory', color: 'bg-blue-500' },
      4: { subject: 'Database Management Systems', code: 'CS302', instructor: 'Prof. Michael Chen', room: 'CSE-102', type: 'Theory', color: 'bg-green-500' },
      6: { subject: 'DBMS Lab', code: 'CS302L', instructor: 'Prof. Michael Chen', room: 'Lab-B', type: 'Lab', color: 'bg-green-600' },
      7: { subject: 'DBMS Lab', code: 'CS302L', instructor: 'Prof. Michael Chen', room: 'Lab-B', type: 'Lab', color: 'bg-green-600' },
      8: { subject: 'Seminar', code: 'CS399', instructor: 'Various Faculty', room: 'Auditorium', type: 'Seminar', color: 'bg-gray-500' }
    },
    3: { // Wednesday
      1: { subject: 'Computer Networks', code: 'CS304', instructor: 'Prof. James Rodriguez', room: 'CSE-104', type: 'Theory', color: 'bg-yellow-500' },
      2: { subject: 'Software Engineering', code: 'CS303', instructor: 'Dr. Emily Davis', room: 'CSE-103', type: 'Theory', color: 'bg-purple-500' },
      3: { subject: 'Machine Learning', code: 'CS305', instructor: 'Dr. Alex Thompson', room: 'CSE-105', type: 'Theory', color: 'bg-red-500' },
      4: { subject: 'Operating Systems', code: 'CS306', instructor: 'Prof. Lisa Kumar', room: 'CSE-106', type: 'Theory', color: 'bg-indigo-500' },
      6: { subject: 'Networks Lab', code: 'CS304L', instructor: 'Prof. James Rodriguez', room: 'Lab-C', type: 'Lab', color: 'bg-yellow-600' },
      7: { subject: 'Networks Lab', code: 'CS304L', instructor: 'Prof. James Rodriguez', room: 'Lab-C', type: 'Lab', color: 'bg-yellow-600' }
    },
    4: { // Thursday
      1: { subject: 'Software Engineering', code: 'CS303', instructor: 'Dr. Emily Davis', room: 'CSE-103', type: 'Theory', color: 'bg-purple-500' },
      2: { subject: 'Data Structures & Algorithms', code: 'CS301', instructor: 'Dr. Sarah Wilson', room: 'CSE-101', type: 'Theory', color: 'bg-blue-500' },
      3: { subject: 'Operating Systems', code: 'CS306', instructor: 'Prof. Lisa Kumar', room: 'CSE-106', type: 'Theory', color: 'bg-indigo-500' },
      4: { subject: 'Machine Learning', code: 'CS305', instructor: 'Dr. Alex Thompson', room: 'CSE-105', type: 'Theory', color: 'bg-red-500' },
      6: { subject: 'ML Lab', code: 'CS305L', instructor: 'Dr. Alex Thompson', room: 'Lab-D', type: 'Lab', color: 'bg-red-600' },
      7: { subject: 'ML Lab', code: 'CS305L', instructor: 'Dr. Alex Thompson', room: 'Lab-D', type: 'Lab', color: 'bg-red-600' },
      8: { subject: 'Project Work', code: 'CS398', instructor: 'Guide Faculty', room: 'Project Lab', type: 'Project', color: 'bg-pink-500' }
    },
    5: { // Friday
      1: { subject: 'Database Management Systems', code: 'CS302', instructor: 'Prof. Michael Chen', room: 'CSE-102', type: 'Theory', color: 'bg-green-500' },
      2: { subject: 'Computer Networks', code: 'CS304', instructor: 'Prof. James Rodriguez', room: 'CSE-104', type: 'Theory', color: 'bg-yellow-500' },
      3: { subject: 'Tutorial - DSA', code: 'CS301T', instructor: 'TA - Rahul Sharma', room: 'Tutorial Room', type: 'Tutorial', color: 'bg-blue-400' },
      4: { subject: 'Tutorial - DBMS', code: 'CS302T', instructor: 'TA - Priya Patel', room: 'Tutorial Room', type: 'Tutorial', color: 'bg-green-400' },
      6: { subject: 'Soft Skills', code: 'HS301', instructor: 'Prof. Jennifer Lee', room: 'HSS-201', type: 'Theory', color: 'bg-teal-500' },
      7: { subject: 'Technical Communication', code: 'HS302', instructor: 'Dr. Robert Brown', room: 'HSS-202', type: 'Theory', color: 'bg-cyan-500' }
    },
    6: { // Saturday
      1: { subject: 'Extra Classes (Optional)', code: 'EXTRA', instructor: 'Various Faculty', room: 'CSE-101', type: 'Extra', color: 'bg-gray-400' },
      2: { subject: 'Club Activities', code: 'CLUB', instructor: 'Club Coordinators', room: 'Activity Hall', type: 'Activity', color: 'bg-orange-500' },
      6: { subject: 'Sports & Recreation', code: 'SPORTS', instructor: 'Sports Faculty', room: 'Sports Complex', type: 'Sports', color: 'bg-lime-500' },
      7: { subject: 'Library Study Hours', code: 'STUDY', instructor: 'Self Study', room: 'Library', type: 'Study', color: 'bg-amber-500' }
    }
  };

  // Subject details for the info modal
  const subjectDetails = {
    'CS301': {
      name: 'Data Structures & Algorithms',
      description: 'Advanced data structures, algorithm design and analysis, time and space complexity.',
      credits: 4,
      prerequisites: ['Programming Fundamentals', 'Mathematics for CS'],
      assessment: 'Mid-term: 30%, End-term: 50%, Assignments: 20%',
      textbook: 'Introduction to Algorithms by Cormen et al.'
    },
    'CS302': {
      name: 'Database Management Systems',
      description: 'Database design, SQL, normalization, transaction management, and database administration.',
      credits: 4,
      prerequisites: ['Data Structures'],
      assessment: 'Mid-term: 30%, End-term: 40%, Labs: 20%, Project: 10%',
      textbook: 'Database System Concepts by Silberschatz'
    },
    'CS303': {
      name: 'Software Engineering',
      description: 'Software development lifecycle, project management, testing, and quality assurance.',
      credits: 3,
      prerequisites: ['Programming in Java'],
      assessment: 'Mid-term: 25%, End-term: 35%, Project: 40%',
      textbook: 'Software Engineering by Ian Sommerville'
    },
    'CS304': {
      name: 'Computer Networks',
      description: 'Network protocols, OSI model, TCP/IP, network security, and distributed systems.',
      credits: 3,
      prerequisites: ['Operating Systems'],
      assessment: 'Mid-term: 30%, End-term: 50%, Labs: 20%',
      textbook: 'Computer Networks by Tanenbaum'
    },
    'CS305': {
      name: 'Machine Learning',
      description: 'Supervised and unsupervised learning, neural networks, deep learning fundamentals.',
      credits: 4,
      prerequisites: ['Statistics', 'Linear Algebra', 'Python Programming'],
      assessment: 'Mid-term: 25%, End-term: 35%, Projects: 40%',
      textbook: 'Pattern Recognition and Machine Learning by Bishop'
    },
    'CS306': {
      name: 'Operating Systems',
      description: 'Process management, memory management, file systems, and system calls.',
      credits: 3,
      prerequisites: ['Computer Architecture'],
      assessment: 'Mid-term: 30%, End-term: 50%, Assignments: 20%',
      textbook: 'Operating System Concepts by Silberschatz'
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7)); // Monday
    
    return weekDays.map((day, index) => {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + index);
      return {
        ...day,
        date: date,
        isToday: date.toDateString() === today.toDateString()
      };
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSubjectTypeIcon = (type) => {
    const icons = {
      Theory: 'ri-book-open-line',
      Lab: 'ri-computer-line',
      Tutorial: 'ri-question-answer-line',
      Seminar: 'ri-presentation-line',
      Project: 'ri-tools-line',
      Extra: 'ri-add-circle-line',
      Activity: 'ri-team-line',
      Sports: 'ri-trophy-line',
      Study: 'ri-book-read-line'
    };
    return icons[type] || 'ri-calendar-line';
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => prev + direction);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(0);
  };

  const handlePeriodClick = (dayId, periodId, classInfo) => {
    if (classInfo && !timeSlots[periodId - 1]?.isBreak) {
      setSelectedPeriod({
        day: weekDays.find(d => d.id === dayId)?.name,
        period: timeSlots[periodId - 1],
        class: classInfo,
        subject: subjectDetails[classInfo.code] || null
      });
      setShowPeriodDetails(true);
    }
  };

  const renderWeekView = () => {
    const weekDates = getCurrentWeekDates();

    return (
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-8 gap-0">
            {/* Time column header */}
            <div className={`${themeClasses.surface} ${themeClasses.border} p-4 font-semibold ${themeClasses.text.primary} text-center`}>
              Time
            </div>

            {/* Day headers */}
            {weekDates.map((day) => (
              <div
                key={day.id}
                className={`${themeClasses.surface} ${themeClasses.border} p-4 text-center ${
                  day.isToday ? 'bg-indigo-900 border-indigo-500' : ''
                }`}
              >
                <div className={`font-semibold ${themeClasses.text.primary}`}>
                  {day.short}
                </div>
                <div className={`text-sm ${themeClasses.text.muted}`}>
                  {day.date.getDate()}/{day.date.getMonth() + 1}
                </div>
              </div>
            ))}

            {/* Time slots and classes */}
            {timeSlots.map((slot) => (
              <React.Fragment key={slot.id}>
                {/* Time slot */}
                <div className={`${themeClasses.surface} ${themeClasses.border} p-4 text-center`}>
                  <div className={`text-sm font-medium ${themeClasses.text.primary}`}>
                    {slot.period}
                  </div>
                  <div className={`text-xs ${themeClasses.text.muted}`}>
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </div>
                </div>

                {/* Class cells for each day */}
                {weekDates.map((day) => {
                  const classInfo = mockTimetable[day.id]?.[slot.id];
                  const isBreak = slot.isBreak;

                  return (
                    <div
                      key={`${day.id}-${slot.id}`}
                      className={`${themeClasses.border} p-2 h-20 cursor-pointer transition-all duration-200 ${
                        isBreak
                          ? 'bg-orange-900 bg-opacity-30'
                          : classInfo
                          ? `${classInfo.color} bg-opacity-20 hover:bg-opacity-30`
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => handlePeriodClick(day.id, slot.id, classInfo)}
                    >
                      {isBreak ? (
                        <div className="text-center">
                          <i className="ri-restaurant-line text-orange-400 text-lg"></i>
                          <div className="text-xs text-orange-300 mt-1">Lunch</div>
                        </div>
                      ) : classInfo ? (
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <div className={`text-xs font-semibold ${themeClasses.text.primary} truncate`}>
                              {classInfo.subject}
                            </div>
                            <div className={`text-xs ${themeClasses.text.muted} truncate`}>
                              {classInfo.code}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${themeClasses.text.muted} truncate`}>
                              {classInfo.room}
                            </span>
                            <i className={`${getSubjectTypeIcon(classInfo.type)} text-xs ${themeClasses.text.muted}`}></i>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <span className={`text-xs ${themeClasses.text.muted}`}>Free</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const selectedDayData = mockTimetable[selectedDay] || {};
    const dayName = weekDays.find(d => d.id === selectedDay)?.name || 'Monday';

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
            {dayName} Schedule
          </h3>
          <div className="flex space-x-2">
            {weekDays.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedDay === day.id 
                    ? themeClasses.button.primary 
                    : `${themeClasses.text.secondary} hover:bg-gray-700`
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {timeSlots.map((slot) => {
            const classInfo = selectedDayData[slot.id];
            const isBreak = slot.isBreak;

            return (
              <motion.div
                key={slot.id}
                className={`${themeClasses.card} p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  isBreak 
                    ? 'bg-orange-900 bg-opacity-20 border-orange-700' 
                    : classInfo
                    ? 'hover:bg-gray-700'
                    : 'opacity-50'
                }`}
                onClick={() => classInfo && handlePeriodClick(selectedDay, slot.id, classInfo)}
                whileHover={{ scale: classInfo ? 1.01 : 1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-sm font-medium ${themeClasses.text.primary}`}>
                        {formatTime(slot.start)}
                      </div>
                      <div className={`text-xs ${themeClasses.text.muted}`}>
                        {formatTime(slot.end)}
                      </div>
                    </div>

                    {isBreak ? (
                      <div className="flex items-center space-x-3">
                        <i className="ri-restaurant-line text-orange-400 text-xl"></i>
                        <div>
                          <h4 className={`font-semibold ${themeClasses.text.primary}`}>Lunch Break</h4>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>1 Hour Break</p>
                        </div>
                      </div>
                    ) : classInfo ? (
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${classInfo.color}`}></div>
                        <div>
                          <h4 className={`font-semibold ${themeClasses.text.primary}`}>
                            {classInfo.subject}
                          </h4>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>
                            {classInfo.code} • {classInfo.instructor}
                          </p>
                          <p className={`text-xs ${themeClasses.text.muted}`}>
                            {classInfo.room} • {classInfo.type}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <i className="ri-time-line text-gray-500 text-xl"></i>
                        <div>
                          <h4 className={`font-semibold ${themeClasses.text.muted}`}>Free Period</h4>
                          <p className={`text-sm ${themeClasses.text.muted}`}>No class scheduled</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {classInfo && (
                    <i className={`${getSubjectTypeIcon(classInfo.type)} text-xl ${themeClasses.accent}`}></i>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Class Timetable
            </h1>
            <p className={themeClasses.text.secondary}>
              Your complete weekly class schedule and subject details
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className={`${themeClasses.card} p-1 rounded-lg flex`}>
              {['week', 'day'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                    viewMode === mode 
                      ? themeClasses.button.primary 
                      : `${themeClasses.text.secondary} hover:bg-gray-700`
                  }`}
                >
                  {mode} view
                </button>
              ))}
            </div>

            {viewMode === 'week' && (
              <button
                onClick={goToCurrentWeek}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${themeClasses.button.secondary} transition-colors`}
              >
                Current Week
              </button>
            )}
          </div>
        </div>

        {/* Week Navigation */}
        {viewMode === 'week' && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek(-1)}
                className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
              >
                <i className="ri-arrow-left-line"></i>
              </button>

              <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                {currentWeek === 0 ? 'Current Week' : 
                 currentWeek > 0 ? `Week +${currentWeek}` : `Week ${currentWeek}`}
              </h2>

              <button
                onClick={() => navigateWeek(1)}
                className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
              >
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>

            <div className={`text-sm ${themeClasses.text.muted}`}>
              Semester 5 • Computer Science Engineering
            </div>
          </div>
        )}

        {/* Timetable Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${themeClasses.card} rounded-lg overflow-hidden`}
        >
          {viewMode === 'week' ? renderWeekView() : renderDayView()}
        </motion.div>

        {/* Period Details Modal */}
        {showPeriodDetails && selectedPeriod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  Class Details
                </h3>
                <button
                  onClick={() => setShowPeriodDetails(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Class Info */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${selectedPeriod.class.color}`}></div>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                      {selectedPeriod.class.subject}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs ${themeClasses.surface} ${themeClasses.text.secondary}`}>
                      {selectedPeriod.class.type}
                    </span>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Schedule</h5>
                    <div className={`space-y-2 text-sm ${themeClasses.text.secondary}`}>
                      <div className="flex items-center space-x-2">
                        <i className="ri-calendar-line text-indigo-400"></i>
                        <span>{selectedPeriod.day}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-time-line text-indigo-400"></i>
                        <span>
                          {formatTime(selectedPeriod.period.start)} - {formatTime(selectedPeriod.period.end)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-map-pin-line text-indigo-400"></i>
                        <span>{selectedPeriod.class.room}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-user-line text-indigo-400"></i>
                        <span>{selectedPeriod.class.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Course Info</h5>
                    <div className={`space-y-2 text-sm ${themeClasses.text.secondary}`}>
                      <div className="flex items-center space-x-2">
                        <i className="ri-bookmark-line text-indigo-400"></i>
                        <span>{selectedPeriod.class.code}</span>
                      </div>
                      {selectedPeriod.subject && (
                        <>
                          <div className="flex items-center space-x-2">
                            <i className="ri-star-line text-indigo-400"></i>
                            <span>{selectedPeriod.subject.credits} Credits</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <i className="ri-book-line text-indigo-400"></i>
                            <span>{selectedPeriod.subject.textbook}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subject Details */}
                {selectedPeriod.subject && (
                  <div className={`${themeClasses.surface} p-4 rounded-lg`}>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Course Description</h5>
                    <p className={`text-sm ${themeClasses.text.secondary} mb-4 leading-relaxed`}>
                      {selectedPeriod.subject.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className={`font-medium ${themeClasses.text.primary} mb-2`}>Prerequisites</h6>
                        <ul className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                          {selectedPeriod.subject.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <i className="ri-check-line text-green-400 text-xs"></i>
                              <span>{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h6 className={`font-medium ${themeClasses.text.primary} mb-2`}>Assessment</h6>
                        <p className={`text-sm ${themeClasses.text.secondary}`}>
                          {selectedPeriod.subject.assessment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPeriodDetails(false)}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                >
                  Close
                </button>
                <button className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}>
                  <i className="ri-calendar-check-line mr-2"></i>
                  Add Reminder
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { title: 'Total Classes', count: 28, icon: 'ri-calendar-line', color: 'text-blue-400', subtitle: 'Per Week' },
            { title: 'Theory Classes', count: 18, icon: 'ri-book-open-line', color: 'text-green-400', subtitle: 'Lectures' },
            { title: 'Lab Sessions', count: 8, icon: 'ri-computer-line', color: 'text-purple-400', subtitle: 'Practical' },
            { title: 'Free Periods', count: 12, icon: 'ri-time-line', color: 'text-yellow-400', subtitle: 'Available' }
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
                  <p className={`text-xs ${themeClasses.text.muted}`}>{stat.subtitle}</p>
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

export default TimetablePage;