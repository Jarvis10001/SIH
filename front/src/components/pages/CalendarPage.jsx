import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

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

  // Mock events data (would come from admin API)
  const mockEvents = [
    {
      id: 1,
      title: 'Mid-term Examinations Begin',
      description: 'All mid-term examinations for semester 5 will commence. Students are advised to arrive 30 minutes early.',
      date: '2025-10-05',
      time: '09:00',
      endTime: '12:00',
      type: 'exam',
      priority: 'high',
      location: 'Main Examination Hall',
      organizer: 'Academic Department',
      attendees: 450,
      category: 'Academic'
    },
    {
      id: 2,
      title: 'Tech Fest 2025 - Registration Opens',
      description: 'Annual technical festival registration is now open. Various competitions including coding, robotics, and innovation challenges.',
      date: '2025-10-01',
      time: '10:00',
      endTime: '18:00',
      type: 'event',
      priority: 'medium',
      location: 'Student Activity Center',
      organizer: 'Tech Club',
      attendees: 200,
      category: 'Cultural'
    },
    {
      id: 3,
      title: 'Faculty Meeting - Student Representatives',
      description: 'Monthly faculty-student council meeting to discuss academic policies and student welfare.',
      date: '2025-10-08',
      time: '14:00',
      endTime: '16:00',
      type: 'meeting',
      priority: 'medium',
      location: 'Conference Room A',
      organizer: 'Student Council',
      attendees: 25,
      category: 'Administrative'
    },
    {
      id: 4,
      title: 'Sports Day - Annual Athletics Meet',
      description: 'Inter-college sports competition featuring track and field events, team sports, and cultural performances.',
      date: '2025-10-15',
      time: '08:00',
      endTime: '17:00',
      type: 'event',
      priority: 'high',
      location: 'Sports Complex',
      organizer: 'Sports Department',
      attendees: 800,
      category: 'Sports'
    },
    {
      id: 5,
      title: 'Guest Lecture: AI in Healthcare',
      description: 'Industry expert Dr. Sarah Johnson will discuss the applications of Artificial Intelligence in modern healthcare.',
      date: '2025-10-12',
      time: '15:30',
      endTime: '17:00',
      type: 'lecture',
      priority: 'medium',
      location: 'Auditorium',
      organizer: 'Computer Science Department',
      attendees: 150,
      category: 'Academic'
    },
    {
      id: 6,
      title: 'Library Extended Hours',
      description: 'Library will remain open 24/7 during examination period to support student preparation.',
      date: '2025-10-03',
      time: '00:00',
      endTime: '23:59',
      type: 'notice',
      priority: 'low',
      location: 'Central Library',
      organizer: 'Library Administration',
      attendees: 0,
      category: 'Administrative'
    },
    {
      id: 7,
      title: 'Workshop: Web Development Bootcamp',
      description: '3-day intensive workshop on modern web development technologies including React, Node.js, and database management.',
      date: '2025-10-20',
      time: '09:00',
      endTime: '17:00',
      type: 'workshop',
      priority: 'medium',
      location: 'Computer Lab 1',
      organizer: 'IT Department',
      attendees: 30,
      category: 'Academic'
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  // Calendar utility functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      exam: 'bg-red-500',
      event: 'bg-indigo-500',
      meeting: 'bg-yellow-500',
      lecture: 'bg-green-500',
      workshop: 'bg-purple-500',
      notice: 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-400',
      medium: 'text-yellow-400',
      low: 'text-green-400'
    };
    return colors[priority] || 'text-gray-400';
  };

  // Render month view
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <motion.div
          key={day}
          className={`h-24 border border-gray-700 p-1 cursor-pointer hover:bg-gray-700 transition-colors ${
            isToday ? 'bg-indigo-900 border-indigo-500' : ''
          } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setSelectedDate(date)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`text-sm font-medium ${themeClasses.text.primary} mb-1`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)} text-white`}
                title={event.title}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-400">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`py-2 px-4 text-center font-medium ${themeClasses.text.secondary} bg-gray-800 border border-gray-700`}>
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="grid grid-cols-8 gap-0 h-96">
        {/* Time column */}
        <div className="bg-gray-800 border border-gray-700">
          <div className="h-12 border-b border-gray-700 flex items-center justify-center text-sm font-medium text-gray-300">
            Time
          </div>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="h-8 border-b border-gray-700 flex items-center justify-center text-xs text-gray-400">
              {i + 8}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={index} className={`border border-gray-700 ${isToday ? 'bg-indigo-900' : ''}`}>
              <div className="h-12 border-b border-gray-700 flex flex-col items-center justify-center">
                <div className="text-xs text-gray-400">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-sm font-medium ${themeClasses.text.primary}`}>
                  {date.getDate()}
                </div>
              </div>
              <div className="relative h-80">
                {dayEvents.map(event => {
                  const startHour = parseInt(event.time.split(':')[0]);
                  const top = (startHour - 8) * 32; // 8am start, 32px per hour
                  return (
                    <div
                      key={event.id}
                      className={`absolute left-0 right-0 mx-1 px-1 py-0.5 text-xs rounded cursor-pointer ${getEventTypeColor(event.type)} text-white`}
                      style={{ top: `${top}px` }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      title={event.title}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90">{formatTime(event.time)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    const isToday = selectedDate.toDateString() === new Date().toDateString();

    return (
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <div className={`${themeClasses.card} p-6 rounded-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                {formatDate(selectedDate)}
                {isToday && <span className="ml-2 text-indigo-400">(Today)</span>}
              </h3>
              <div className={`text-sm ${themeClasses.text.secondary}`}>
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="space-y-4">
              {dayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ri-calendar-line text-4xl text-gray-500 mb-4 block"></i>
                  <p className={themeClasses.text.secondary}>No events scheduled for this day</p>
                </div>
              ) : (
                dayEvents
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(event => (
                    <motion.div
                      key={event.id}
                      className={`${themeClasses.card} p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors`}
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getEventTypeColor(event.type)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold ${themeClasses.text.primary}`}>{event.title}</h4>
                            <div className={`text-sm ${getPriorityColor(event.priority)}`}>
                              <i className="ri-flag-line mr-1"></i>
                              {event.priority}
                            </div>
                          </div>
                          <p className={`text-sm ${themeClasses.text.secondary} mb-2`}>{event.description}</p>
                          <div className={`text-sm ${themeClasses.text.muted} flex items-center space-x-4`}>
                            <span>
                              <i className="ri-time-line mr-1"></i>
                              {formatTime(event.time)} - {formatTime(event.endTime)}
                            </span>
                            <span>
                              <i className="ri-map-pin-line mr-1"></i>
                              {event.location}
                            </span>
                            <span>
                              <i className="ri-user-line mr-1"></i>
                              {event.attendees} attendees
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className={`${themeClasses.card} p-4 rounded-lg`}>
            <h4 className={`font-semibold ${themeClasses.text.primary} mb-4`}>Event Summary</h4>
            <div className="space-y-3">
              {['exam', 'event', 'meeting', 'lecture', 'workshop', 'notice'].map(type => {
                const count = dayEvents.filter(e => e.type === type).length;
                return count > 0 && (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(type)}`}></div>
                      <span className={`text-sm ${themeClasses.text.secondary} capitalize`}>{type}s</span>
                    </div>
                    <span className={`text-sm font-medium ${themeClasses.text.primary}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
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
              Academic Calendar
            </h1>
            <p className={themeClasses.text.secondary}>
              View all upcoming events, exams, and important dates
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className={`${themeClasses.card} p-1 rounded-lg flex`}>
              {['month', 'week', 'day'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                    viewMode === mode 
                      ? themeClasses.button.primary 
                      : `${themeClasses.text.secondary} hover:bg-gray-700`
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={goToToday}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${themeClasses.button.secondary} transition-colors`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (viewMode === 'month') navigateMonth(-1);
                else if (viewMode === 'week') navigateWeek(-1);
                else navigateDay(-1);
              }}
              className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
            >
              <i className="ri-arrow-left-line"></i>
            </button>

            <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
              {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              {viewMode === 'week' && `Week of ${formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()))}`}
              {viewMode === 'day' && formatDate(selectedDate)}
            </h2>

            <button
              onClick={() => {
                if (viewMode === 'month') navigateMonth(1);
                else if (viewMode === 'week') navigateWeek(1);
                else navigateDay(1);
              }}
              className={`p-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
            >
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>

          <div className={`text-sm ${themeClasses.text.muted}`}>
            Total Events: {events.length}
          </div>
        </div>

        {/* Calendar Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${themeClasses.card} rounded-lg overflow-hidden`}
        >
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </motion.div>

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  Event Details
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${getEventTypeColor(selectedEvent.type)}`}></div>
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                      {selectedEvent.title}
                    </h4>
                    <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(selectedEvent.priority)} bg-gray-700`}>
                      {selectedEvent.priority} priority
                    </span>
                  </div>
                  <p className={`${themeClasses.text.secondary} leading-relaxed`}>
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-2`}>Date & Time</h5>
                    <div className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                      <div className="flex items-center space-x-2">
                        <i className="ri-calendar-line text-indigo-400"></i>
                        <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-time-line text-indigo-400"></i>
                        <span>{formatTime(selectedEvent.time)} - {formatTime(selectedEvent.endTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-2`}>Details</h5>
                    <div className={`text-sm ${themeClasses.text.secondary} space-y-1`}>
                      <div className="flex items-center space-x-2">
                        <i className="ri-map-pin-line text-indigo-400"></i>
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-user-line text-indigo-400"></i>
                        <span>{selectedEvent.organizer}</span>
                      </div>
                      {selectedEvent.attendees > 0 && (
                        <div className="flex items-center space-x-2">
                          <i className="ri-group-line text-indigo-400"></i>
                          <span>{selectedEvent.attendees} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`bg-gray-700 p-4 rounded-lg border-l-4 ${
                  selectedEvent.priority === 'high' ? 'border-red-500' :
                  selectedEvent.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-information-line text-indigo-400"></i>
                    <span className={`font-medium ${themeClasses.text.primary}`}>Category</span>
                  </div>
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    {selectedEvent.category} • {selectedEvent.type.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                >
                  Close
                </button>
                <button className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}>
                  <i className="ri-calendar-check-line mr-2"></i>
                  Add to My Calendar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { title: 'This Month', count: events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length, icon: 'ri-calendar-line', color: 'text-blue-400' },
            { title: 'High Priority', count: events.filter(e => e.priority === 'high').length, icon: 'ri-flag-line', color: 'text-red-400' },
            { title: 'Exams', count: events.filter(e => e.type === 'exam').length, icon: 'ri-file-text-line', color: 'text-yellow-400' },
            { title: 'Events', count: events.filter(e => e.type === 'event').length, icon: 'ri-trophy-line', color: 'text-green-400' }
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

export default CalendarPage;