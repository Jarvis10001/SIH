import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

const teacherNavItems = [
  { name: "Dashboard", icon: "ri-home-line", path: "/teacher/dashboard" },
  { name: "My Courses", icon: "ri-book-line", path: "/teacher/dashboard/courses" },
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

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 ease-in-out
        bg-gradient-to-b from-[#1E3A8A] to-[#0C4A6E] border-r border-white/10
        ${isOpen ? 'w-72' : 'w-20'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-5 border-b border-white/10 bg-[#0C4A6E]/50 overflow-hidden">
          <Link to="/teacher/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300">
              <i className="ri-user-star-line text-xl text-white" />
            </div>
            <span className={`text-xl font-bold text-white transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              Teacher<span className="text-blue-200">Portal</span>
            </span>
          </Link>
          
          {/* Close button for mobile */}
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <i className="ri-close-line text-white" />
          </button>
        </div>

        {/* Teacher Profile Section */}
        <div className={`p-4 border-b border-white/10 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i className="ri-user-star-line text-white text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {teacherData?.name || 'Teacher'}
              </p>
              <p className="text-blue-100 text-xs truncate">
                {teacherData?.designation || 'Faculty'} • {teacherData?.department || 'Department'}
              </p>
              <p className="text-blue-100 text-xs truncate">
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
                    ? 'bg-gradient-to-r from-white/20 to-cyan-300/20 text-white shadow-lg' 
                    : 'text-white/70 hover:bg-gradient-to-r hover:from-white/10 hover:to-cyan-300/10 hover:text-white'
                  }`}
              >
                <i className={`${item.icon} text-lg ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-white/70 group-hover:text-white'
                }`} />
                <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            {/* Profile Link */}
            <Link
              to="/teacher/dashboard/profile"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:bg-gradient-to-r hover:from-white/10 hover:to-cyan-300/10 hover:text-white transition-all duration-300"
            >
              <i className="ri-user-settings-line text-lg" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                Profile
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/70 hover:bg-gradient-to-r hover:from-white/10 hover:to-cyan-300/10 hover:text-white transition-all duration-300"
            >
              <i className="ri-logout-box-line text-lg" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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