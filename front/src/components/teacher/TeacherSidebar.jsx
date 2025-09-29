import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { themeClasses, iconClasses } from '../../styles/theme';

const teacherNavItems = [
  { name: "Dashboard", icon: "ri-home-line", path: "/teacher/dashboard" },
  { name: "Students", icon: "ri-user-3-line", path: "/teacher/dashboard/students" },
  { name: "Assignments", icon: "ri-file-list-3-line", path: "/teacher/dashboard/assignments" },
  { name: "Attendance", icon: "ri-calendar-check-line", path: "/teacher/dashboard/attendance" },
  { name: "Grades", icon: "ri-bar-chart-line", path: "/teacher/dashboard/grades" },
  { name: "Schedule", icon: "ri-calendar-line", path: "/teacher/dashboard/schedule" },
  { name: "Resources", icon: "ri-folder-line", path: "/teacher/dashboard/resources" },
  { name: "Reports", icon: "ri-file-chart-line", path: "/teacher/dashboard/reports" },
  { name: "Settings", icon: "ri-settings-line", path: "/teacher/dashboard/settings" },
];

const TeacherSidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const teacherData = JSON.parse(localStorage.getItem('teacherData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherData');
    navigate('/teacher/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#0C4A6E] text-white shadow-lg md:hidden hover:shadow-xl transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <i className="ri-menu-line text-xl" />
      </button>

      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar (off-canvas on small screens, collapsible on md+) */}
      <aside className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 md:duration-700 ease-in-out
        ${themeClasses.sidebar} border-r border-slate-700/30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-72 md:translate-x-0 ${isOpen ? 'md:w-72' : 'md:w-20'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5 border-b border-slate-700/30 bg-gray-900/50 overflow-hidden">
          <Link to="/teacher/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors duration-300">
              <i className={`ri-user-star-line text-xl ${iconClasses.primary}`} />
            </div>
            <span className={`text-xl font-bold text-white transition-opacity duration-300 md:duration-700 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="text-indigo-300">AcademiX</span> Teacher
            </span>
          </Link>
          
          {/* Close button for mobile */}
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors duration-300 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <i className="ri-close-line text-white" />
          </button>
        </div>

        {/* Teacher Profile Section */}
        <div className={`p-4 border-b border-slate-700/30 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <i className={`ri-user-star-line ${iconClasses.primary} text-lg`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {teacherData?.name || 'Teacher'}
              </p>
              <p className="text-slate-300 text-xs truncate">
                {teacherData?.designation || 'Faculty'} • {teacherData?.department || 'Department'}
              </p>
              <p className="text-slate-400 text-xs truncate">
                ID: {teacherData?.teacherId || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-1.5">
            {teacherNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${location.pathname === item.path
                    ? `${themeClasses.sidebarActive} shadow-lg` 
                    : 'text-slate-300 hover:bg-indigo-500/20 hover:text-white'
                  }`}
              >
                <i className={`${item.icon} text-lg ${
                  location.pathname === item.path
                    ? iconClasses.primary
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
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700/30">
          <div className="space-y-2">
            {/* Profile Link */}
            <Link
              to="/teacher/dashboard/profile"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-indigo-500/20 hover:text-white transition-all duration-300 md:duration-700"
            >
              <i className="ri-user-settings-line text-lg text-slate-400 group-hover:text-indigo-400" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 md:duration-700 ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                Profile
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 md:duration-700"
            >
              <i className="ri-logout-box-line text-lg text-slate-400 hover:text-red-400" />
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 md:duration-700 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;