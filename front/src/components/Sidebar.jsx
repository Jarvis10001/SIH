import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

const navItems = [
  { name: "Dashboard", icon: "ri-home-line", path: "/dashboard" },
  { name: "Admission", icon: "ri-file-add-line", path: "/dashboard/admission" },
  { name: "Payment", icon: "ri-bank-card-line", path: "/dashboard/payment" },
  { name: "Hostel", icon: "ri-building-2-line", path: "/dashboard/hostel" },
  
  // Student Section
  { name: "Students", icon: "ri-user-3-line", path: "/dashboard/students" },
  { name: "Attendance", icon: "ri-calendar-check-line", path: "/dashboard/attendance" },
  { name: "Grades", icon: "ri-bar-chart-line", path: "/dashboard/grades" },
  { name: "Library", icon: "ri-book-2-line", path: "/dashboard/library" },
  { name: "Timetable", icon: "ri-calendar-2-line", path: "/dashboard/timetable" },
  { name: "Calendar", icon: "ri-calendar-line", path: "/dashboard/calendar" },
  { name: "Resources", icon: "ri-folder-2-line", path: "/dashboard/resources" },
  { name: "Queries", icon: "ri-question-answer-line", path: "/dashboard/queries" },
  { name: "Announcements", icon: "ri-megaphone-line", path: "/dashboard/events" },
  
  // System Section
  { name: "Reports", icon: "ri-file-chart-line", path: "/dashboard/reports" },
  { name: "Settings", icon: "ri-settings-line", path: "/dashboard/settings" },
];

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg md:hidden hover:shadow-xl transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <i className="ri-menu-line text-xl" />
      </button>

      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar (off-canvas on small screens, collapsible on md+) */}
      <aside className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 md:duration-700 ease-in-out
        bg-gradient-to-b from-gray-900 to-gray-800 border-r border-slate-700/30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-72 md:translate-x-0 ${isOpen ? 'md:w-72' : 'md:w-20'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5 border-b border-slate-700/30 bg-gray-800/50 overflow-hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors duration-300">
              <i className="ri-graduation-cap-line text-xl text-indigo-400" />
            </div>
            <span className={`text-xl font-bold text-white transition-opacity duration-300 md:duration-700 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              College<span className="text-indigo-400">ERP</span>
            </span>
          </Link>
          
          {/* Close button for mobile */}
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-600/20 hover:bg-slate-600/30 transition-colors duration-300 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <i className="ri-close-line text-white" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`p-4 border-b border-slate-700/30 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <i className="ri-user-line text-indigo-400 text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {userData?.name || 'User'}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {userData?.email || 'user@college.edu'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Dashboard */}
            <div>
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-white shadow-lg border border-indigo-500/30' 
                    : 'text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-indigo-600/10 hover:text-white'
                  }`}
              >
                <i className={`ri-home-line text-lg ${
                  location.pathname === '/dashboard'
                    ? 'text-indigo-400'
                    : 'text-slate-400 group-hover:text-indigo-400'
                }`} />
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 md:duration-700 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}>
                  Dashboard
                </span>
              </Link>
            </div>

            {/* Student Section */}
            <div>
              {isOpen && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">
                  Student Portal
                </h3>
              )}
              <div className="space-y-1">
                {[
                  { name: "Admission", icon: "ri-file-add-line", path: "/dashboard/admission" },
                  { name: "Payment", icon: "ri-bank-card-line", path: "/dashboard/payment" },
                  { name: "Hostel", icon: "ri-building-2-line", path: "/dashboard/hostel" },
                  { name: "Attendance", icon: "ri-calendar-check-line", path: "/dashboard/attendance" },
                  { name: "Grades", icon: "ri-bar-chart-line", path: "/dashboard/grades" },
                  { name: "Library", icon: "ri-book-2-line", path: "/dashboard/library" },
                  { name: "Timetable", icon: "ri-calendar-2-line", path: "/dashboard/timetable" },
                  { name: "Calendar", icon: "ri-calendar-line", path: "/dashboard/calendar" },
                  { name: "Resources", icon: "ri-folder-2-line", path: "/dashboard/resources" },
                  { name: "Queries", icon: "ri-question-answer-line", path: "/dashboard/queries" },
                  { name: "Announcements", icon: "ri-megaphone-line", path: "/dashboard/events" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                      ${location.pathname === item.path
                        ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-white shadow-lg border border-indigo-500/30' 
                        : 'text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-indigo-600/10 hover:text-white'
                      }`}
                  >
                    <i className={`${item.icon} text-lg ${
                      location.pathname === item.path
                        ? 'text-indigo-400'
                        : 'text-slate-400 group-hover:text-indigo-400'
                    }`} />
                    <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 md:duration-700 ${
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-600/20 hover:text-white transition-all duration-300"
          >
            <i className="ri-logout-box-line text-lg" />
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 md:duration-700 ${
              isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;