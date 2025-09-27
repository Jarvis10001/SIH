import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherTimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState('week'); // 'week', 'day'
  const [selectedDay, setSelectedDay] = useState('monday');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [timetableData, setTimetableData] = useState({});

  // Theme classes
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

  const timeSlots = [
    '09:00 - 09:50',
    '10:00 - 10:50',
    '11:00 - 11:50',
    '12:00 - 12:50',
    '01:00 - 01:50',
    '02:00 - 02:50',
    '03:00 - 03:50',
    '04:00 - 04:50'
  ];

  const daysOfWeek = [
    { id: 'monday', name: 'Monday', short: 'Mon' },
    { id: 'tuesday', name: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', name: 'Wednesday', short: 'Wed' },
    { id: 'thursday', name: 'Thursday', short: 'Thu' },
    { id: 'friday', name: 'Friday', short: 'Fri' },
    { id: 'saturday', name: 'Saturday', short: 'Sat' }
  ];

  // Mock timetable data
  const mockTimetable = {
    monday: [
      {
        id: 1,
        time: '09:00 - 09:50',
        course: 'CS301 - Data Structures',
        room: 'Room A-101',
        students: 45,
        type: 'lecture',
        color: 'bg-blue-600'
      },
      {
        id: 2,
        time: '11:00 - 11:50',
        course: 'CS401 - Database Systems',
        room: 'Lab B-205',
        students: 38,
        type: 'lab',
        color: 'bg-green-600'
      },
      {
        id: 3,
        time: '02:00 - 02:50',
        course: 'CS501 - Machine Learning',
        room: 'Room A-203',
        students: 32,
        type: 'lecture',
        color: 'bg-purple-600'
      }
    ],
    tuesday: [
      {
        id: 4,
        time: '10:00 - 10:50',
        course: 'CS301 - Data Structures',
        room: 'Lab C-101',
        students: 45,
        type: 'lab',
        color: 'bg-blue-600'
      },
      {
        id: 5,
        time: '01:00 - 01:50',
        course: 'CS401 - Database Systems',
        room: 'Room A-102',
        students: 38,
        type: 'lecture',
        color: 'bg-green-600'
      },
      {
        id: 6,
        time: '03:00 - 03:50',
        course: 'CS501 - Machine Learning',
        room: 'Lab B-301',
        students: 32,
        type: 'lab',
        color: 'bg-purple-600'
      }
    ],
    wednesday: [
      {
        id: 7,
        time: '09:00 - 09:50',
        course: 'CS401 - Database Systems',
        room: 'Room A-201',
        students: 38,
        type: 'lecture',
        color: 'bg-green-600'
      },
      {
        id: 8,
        time: '12:00 - 12:50',
        course: 'Office Hours',
        room: 'Office 304',
        students: 0,
        type: 'office',
        color: 'bg-yellow-600'
      },
      {
        id: 9,
        time: '02:00 - 02:50',
        course: 'CS501 - Machine Learning',
        room: 'Room A-203',
        students: 32,
        type: 'lecture',
        color: 'bg-purple-600'
      }
    ],
    thursday: [
      {
        id: 10,
        time: '10:00 - 10:50',
        course: 'CS301 - Data Structures',
        room: 'Room A-101',
        students: 45,
        type: 'lecture',
        color: 'bg-blue-600'
      },
      {
        id: 11,
        time: '01:00 - 01:50',
        course: 'Faculty Meeting',
        room: 'Conference Room',
        students: 0,
        type: 'meeting',
        color: 'bg-red-600'
      },
      {
        id: 12,
        time: '03:00 - 03:50',
        course: 'CS401 - Database Systems',
        room: 'Lab B-205',
        students: 38,
        type: 'lab',
        color: 'bg-green-600'
      }
    ],
    friday: [
      {
        id: 13,
        time: '09:00 - 09:50',
        course: 'CS501 - Machine Learning',
        room: 'Room A-203',
        students: 32,
        type: 'lecture',
        color: 'bg-purple-600'
      },
      {
        id: 14,
        time: '11:00 - 11:50',
        course: 'CS301 - Data Structures',
        room: 'Lab C-101',
        students: 45,
        type: 'lab',
        color: 'bg-blue-600'
      },
      {
        id: 15,
        time: '02:00 - 02:50',
        course: 'CS401 - Database Systems',
        room: 'Room A-102',
        students: 38,
        type: 'lecture',
        color: 'bg-green-600'
      }
    ],
    saturday: [
      {
        id: 16,
        time: '10:00 - 10:50',
        course: 'Research Work',
        room: 'Research Lab',
        students: 0,
        type: 'research',
        color: 'bg-indigo-600'
      },
      {
        id: 17,
        time: '12:00 - 12:50',
        course: 'Office Hours',
        room: 'Office 304',
        students: 0,
        type: 'office',
        color: 'bg-yellow-600'
      }
    ]
  };

  const weekStats = {
    totalClasses: 15,
    totalHours: 15,
    lectureHours: 8,
    labHours: 5,
    officeHours: 2,
    meetingHours: 1
  };

  useEffect(() => {
    setTimetableData(mockTimetable);
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      lecture: 'ri-presentation-line',
      lab: 'ri-flask-line',
      office: 'ri-customer-service-line',
      meeting: 'ri-team-line',
      research: 'ri-search-line'
    };
    return icons[type] || 'ri-book-line';
  };

  const handleAddClass = () => {
    setEditingClass({
      id: Date.now(),
      time: '',
      course: '',
      room: '',
      students: 0,
      type: 'lecture',
      color: 'bg-blue-600',
      day: selectedDay
    });
    setShowScheduleModal(true);
  };

  const handleEditClass = (classItem, day) => {
    setEditingClass({ ...classItem, day });
    setShowScheduleModal(true);
  };

  const saveClass = () => {
    if (editingClass) {
      const updatedTimetable = { ...timetableData };
      const daySchedule = updatedTimetable[editingClass.day] || [];
      
      const existingIndex = daySchedule.findIndex(c => c.id === editingClass.id);
      if (existingIndex >= 0) {
        daySchedule[existingIndex] = editingClass;
      } else {
        daySchedule.push(editingClass);
      }
      
      updatedTimetable[editingClass.day] = daySchedule.sort((a, b) => 
        a.time.localeCompare(b.time)
      );
      
      setTimetableData(updatedTimetable);
    }
    
    setShowScheduleModal(false);
    setEditingClass(null);
  };

  const deleteClass = (classId, day) => {
    const updatedTimetable = { ...timetableData };
    updatedTimetable[day] = updatedTimetable[day].filter(c => c.id !== classId);
    setTimetableData(updatedTimetable);
  };

  const renderWeekView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Time Column */}
      <div className={`${themeClasses.surface} p-3 rounded-lg`}>
        <h3 className={`font-semibold ${themeClasses.text.primary} mb-4 text-center`}>
          Time
        </h3>
        <div className="space-y-2">
          {timeSlots.map((slot, index) => (
            <div key={index} className={`p-2 text-center text-sm ${themeClasses.text.muted} border-b border-gray-600`}>
              {slot}
            </div>
          ))}
        </div>
      </div>

      {/* Days Columns */}
      {daysOfWeek.map(day => (
        <div key={day.id} className={`${themeClasses.surface} p-3 rounded-lg`}>
          <h3 className={`font-semibold ${themeClasses.text.primary} mb-4 text-center`}>
            {day.name}
          </h3>
          <div className="space-y-2">
            {timeSlots.map((slot, slotIndex) => {
              const classItem = timetableData[day.id]?.find(c => c.time === slot);
              return (
                <div key={slotIndex} className="h-12 relative">
                  {classItem ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`${classItem.color} text-white p-2 rounded text-xs cursor-pointer hover:shadow-lg transition-all group`}
                      onClick={() => handleEditClass(classItem, day.id)}
                    >
                      <div className="font-medium truncate">
                        {classItem.course.split(' - ')[0]}
                      </div>
                      <div className="text-xs opacity-90 truncate">
                        {classItem.room}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClass(classItem.id, day.id);
                        }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded p-1"
                      >
                        <i className="ri-close-line text-xs"></i>
                      </button>
                    </motion.div>
                  ) : (
                    <div
                      className={`${themeClasses.card} border-dashed border-2 rounded p-2 text-center cursor-pointer hover:border-indigo-500 transition-colors group`}
                      onClick={() => {
                        setSelectedDay(day.id);
                        handleAddClass();
                      }}
                    >
                      <i className="ri-add-line text-gray-400 group-hover:text-indigo-400 transition-colors"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDayView = () => {
    const dayClasses = timetableData[selectedDay] || [];
    const selectedDayInfo = daysOfWeek.find(d => d.id === selectedDay);

    return (
      <div className={`${themeClasses.card} p-6 rounded-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-semibold ${themeClasses.text.primary}`}>
            {selectedDayInfo?.name} Schedule
          </h3>
          <button
            onClick={handleAddClass}
            className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg transition-colors`}
          >
            <i className="ri-add-line mr-2"></i>
            Add Class
          </button>
        </div>

        <div className="space-y-4">
          {dayClasses.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-calendar-line text-6xl text-gray-400 mb-4"></i>
              <h3 className={`text-xl ${themeClasses.text.secondary} mb-2`}>
                No classes scheduled
              </h3>
              <p className={themeClasses.text.muted}>
                Click "Add Class" to schedule your first class for {selectedDayInfo?.name}
              </p>
            </div>
          ) : (
            dayClasses.map(classItem => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center p-4 rounded-lg ${themeClasses.surface} hover:shadow-lg transition-all cursor-pointer group`}
                onClick={() => handleEditClass(classItem, selectedDay)}
              >
                <div className={`w-4 h-full ${classItem.color} rounded-l`}></div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary}`}>
                        {classItem.course}
                      </h4>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>
                        {classItem.time} • {classItem.room}
                      </p>
                      {classItem.students > 0 && (
                        <p className={`text-xs ${themeClasses.text.muted}`}>
                          {classItem.students} students
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded ${classItem.color} text-white`}>
                        <i className={`${getTypeIcon(classItem.type)} text-lg`}></i>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClass(classItem.id, selectedDay);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded bg-red-600 hover:bg-red-700 text-white transition-all"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              My Timetable
            </h1>
            <p className={themeClasses.text.secondary}>
              Manage your teaching schedule and class timings
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'day' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Day View
              </button>
            </div>

            <button
              className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}
            >
              <i className="ri-download-line mr-2"></i>
              Export Schedule
            </button>
          </div>
        </div>

        {/* Weekly Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className={`${themeClasses.card} p-4 rounded-lg text-center`}>
            <i className="ri-calendar-line text-2xl text-blue-400 mb-2"></i>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
              {weekStats.totalClasses}
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>Total Classes</p>
          </div>

          <div className={`${themeClasses.card} p-4 rounded-lg text-center`}>
            <i className="ri-time-line text-2xl text-green-400 mb-2"></i>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
              {weekStats.totalHours}h
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>Total Hours</p>
          </div>

          <div className={`${themeClasses.card} p-4 rounded-lg text-center`}>
            <i className="ri-presentation-line text-2xl text-purple-400 mb-2"></i>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
              {weekStats.lectureHours}h
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>Lectures</p>
          </div>

          <div className={`${themeClasses.card} p-4 rounded-lg text-center`}>
            <i className="ri-flask-line text-2xl text-yellow-400 mb-2"></i>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
              {weekStats.labHours}h
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>Labs</p>
          </div>

          <div className={`${themeClasses.card} p-4 rounded-lg text-center`}>
            <i className="ri-customer-service-line text-2xl text-indigo-400 mb-2"></i>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
              {weekStats.officeHours}h
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>Office Hours</p>
          </div>

          <div className={`${themeClasses.card} p-4 rounded-lg text-center`}>
            <i className="ri-team-line text-2xl text-red-400 mb-2"></i>
            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
              {weekStats.meetingHours}h
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>Meetings</p>
          </div>
        </div>

        {/* Day Selector for Day View */}
        {viewMode === 'day' && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg">
              {daysOfWeek.map(day => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedDay === day.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timetable Content */}
        <div className="mb-8">
          {viewMode === 'week' ? renderWeekView() : renderDayView()}
        </div>

        {/* Schedule Modal */}
        <AnimatePresence>
          {showScheduleModal && editingClass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${themeClasses.card} rounded-lg p-6 w-full max-w-md`}
              >
                <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
                  {editingClass.course ? 'Edit Class' : 'Add New Class'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={editingClass.course}
                      onChange={(e) => setEditingClass({...editingClass, course: e.target.value})}
                      placeholder="e.g., CS301 - Data Structures"
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Time Slot
                      </label>
                      <select
                        value={editingClass.time}
                        onChange={(e) => setEditingClass({...editingClass, time: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary}`}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Room
                      </label>
                      <input
                        type="text"
                        value={editingClass.room}
                        onChange={(e) => setEditingClass({...editingClass, room: e.target.value})}
                        placeholder="e.g., Room A-101"
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Type
                      </label>
                      <select
                        value={editingClass.type}
                        onChange={(e) => setEditingClass({...editingClass, type: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary}`}
                      >
                        <option value="lecture">Lecture</option>
                        <option value="lab">Lab</option>
                        <option value="office">Office Hours</option>
                        <option value="meeting">Meeting</option>
                        <option value="research">Research</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Students
                      </label>
                      <input
                        type="number"
                        value={editingClass.students}
                        onChange={(e) => setEditingClass({...editingClass, students: parseInt(e.target.value) || 0})}
                        placeholder="0"
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Color
                    </label>
                    <div className="flex space-x-2">
                      {[
                        'bg-blue-600',
                        'bg-green-600',
                        'bg-purple-600',
                        'bg-yellow-600',
                        'bg-red-600',
                        'bg-indigo-600'
                      ].map(color => (
                        <button
                          key={color}
                          onClick={() => setEditingClass({...editingClass, color})}
                          className={`w-8 h-8 rounded ${color} ${
                            editingClass.color === color ? 'ring-2 ring-white' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-600">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className={`px-4 py-2 ${themeClasses.button.secondary} rounded-lg`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveClass}
                    className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg`}
                  >
                    <i className="ri-save-line mr-2"></i>
                    Save Class
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherTimetablePage;