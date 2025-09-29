import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { themeClasses, iconClasses } from '../styles/theme';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = ['home', 'features', 'solutions', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active section based on current path
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection('home');
    }
  }, [location.pathname]);

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`fixed w-full top-0 z-50 transition-all duration-700 ${isScrolled ? 'mt-0' : 'mt-1'}`}>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`relative mx-4 transition-all duration-500 z-50 ${
        isScrolled 
          ? `${themeClasses.surface} ${themeClasses.border} shadow-2xl backdrop-blur-md border` 
          : 'bg-gray-900/30 backdrop-blur-md border border-white/10'
      } rounded-2xl`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link to="/" className="flex items-center group">
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <i className="ri-graduation-cap-line text-white text-lg"></i>
                </div>
              </div>
              <div className="ml-3">
                <h2 className={`font-bold text-xl transition-colors duration-300 ${
                  isScrolled ? themeClasses.text.primary : 'text-white'
                }`}>
                  <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-2 py-1 rounded-md text-white shadow-lg">AcademiX</span>
                </h2>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
                isScrolled ? 'bg-gray-700/50 backdrop-blur-sm' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                {[
                  { name: 'Home', path: '#home', section: 'home', icon: 'ri-home-line' },
                  { name: 'Features', path: '#features', section: 'features', icon: 'ri-star-line' },
                  { name: 'Solutions', path: '#solutions', section: 'solutions', icon: 'ri-lightbulb-line' },
                  { name: 'About', path: '#about', section: 'about', icon: 'ri-information-line' },
                  { name: 'Contact', path: '#contact', section: 'contact', onClick: handleContactClick, icon: 'ri-mail-line' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={item.onClick}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeSection === item.section
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                        : isScrolled 
                          ? `${themeClasses.text.secondary} hover:text-indigo-400 hover:bg-indigo-500/10`
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <i className={`${item.icon} text-sm`}></i>
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Portal Links */}
              <div className={`flex items-center gap-2 ml-4 pl-4 transition-colors duration-300 ${
                isScrolled ? 'border-l border-gray-600' : 'border-l border-white/20'
              }`}>
                <Link 
                  to="/teacher/login"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1 ${
                    isScrolled
                      ? `${themeClasses.text.tertiary} hover:text-blue-400 hover:bg-blue-500/10`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Teacher Portal"
                >
                  <i className="ri-user-star-line"></i>
                  Teacher
                </Link>
                <Link 
                  to="/clerk/login"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1 ${
                    isScrolled
                      ? `${themeClasses.text.tertiary} hover:text-green-400 hover:bg-emerald-500/10`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Clerk Portal"
                >
                  <i className="ri-user-settings-line"></i>
                  Clerk
                </Link>
                <Link 
                  to="/admin/login"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1 ${
                    isScrolled
                      ? `${themeClasses.text.tertiary} hover:text-purple-400 hover:bg-purple-500/10`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Admin Portal"
                >
                  <i className="ri-admin-line"></i>
                  Admin
                </Link>
              </div>

              {/* Auth Buttons */}
              <div className={`flex items-center gap-3 ml-6 pl-6 transition-colors duration-300 ${
                isScrolled ? 'border-l border-gray-600' : 'border-l border-white/20'
              }`}>
                <Link
                  to="/login"
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 ${
                    isScrolled
                      ? `${themeClasses.text.secondary} bg-gray-700/50 hover:bg-gray-700 border border-gray-600`
                      : 'text-white/90 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <i className="ri-login-circle-line"></i>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                  <i className="ri-user-add-line"></i>
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled ? `${themeClasses.text.primary} hover:bg-gray-700` : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45' : '-translate-y-2'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45' : 'translate-y-2'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden ${
            isScrolled 
              ? `${themeClasses.surface} border-t ${themeClasses.border}`
              : 'bg-gray-900/95 backdrop-blur-md border-t border-white/10'
          }`}
        >
          <div className="px-4 py-3">
            {[
              { name: 'Home', path: '#home', icon: 'ri-home-line' },
              { name: 'Features', path: '#features', icon: 'ri-star-line' },
              { name: 'Solutions', path: '#solutions', icon: 'ri-lightbulb-line' },
              { name: 'About', path: '#about', icon: 'ri-information-line' },
              { name: 'Contact', path: '#contact', icon: 'ri-mail-line', onClick: handleContactClick }
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  if (item.onClick) item.onClick(e);
                  setIsOpen(false);
                }}
                className={`flex px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 items-center gap-3 ${
                  isScrolled
                    ? `${themeClasses.text.secondary} hover:bg-indigo-500/10 hover:text-indigo-400`
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <i className={item.icon}></i>
                {item.name}
              </a>
            ))}
            
            {/* Portal Links Mobile */}
            <div className="pt-3 mt-3 border-t border-gray-600/50">
              <p className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                isScrolled ? themeClasses.text.muted : 'text-white/50'
              }`}>
                Portal Access
              </p>
              <Link 
                to="/teacher/login"
                className={`flex w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 items-center gap-3 ${
                  isScrolled
                    ? `${themeClasses.text.tertiary} hover:text-blue-400 hover:bg-blue-500/10`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-user-star-line text-lg"></i>
                <div>
                  <div className="font-semibold">Teacher Portal</div>
                  <div className="text-xs opacity-70">Manage classes & students</div>
                </div>
              </Link>
              <Link 
                to="/clerk/login"
                className={`flex w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 items-center gap-3 ${
                  isScrolled
                    ? `${themeClasses.text.tertiary} hover:text-green-400 hover:bg-emerald-500/10`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-user-settings-line text-lg"></i>
                <div>
                  <div className="font-semibold">Clerk Portal</div>
                  <div className="text-xs opacity-70">Handle administrative tasks</div>
                </div>
              </Link>
              <Link 
                to="/admin/login"
                className={`flex w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 items-center gap-3 ${
                  isScrolled
                    ? `${themeClasses.text.tertiary} hover:text-purple-400 hover:bg-purple-500/10`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-admin-line text-lg"></i>
                <div>
                  <div className="font-semibold">Admin Portal</div>
                  <div className="text-xs opacity-70">System administration</div>
                </div>
              </Link>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-600/50 flex gap-3">
              <Link 
                to="/login"
                className={`flex-1 px-4 py-3 text-indigo-400 border-2 border-indigo-500 rounded-lg 
                         text-center hover:bg-indigo-500 hover:text-white transition-all duration-300 
                         flex items-center justify-center gap-2 font-medium`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-login-circle-line"></i>
                Log In
              </Link>
              <Link 
                to="/signup"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg 
                         hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg
                         flex items-center justify-center gap-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-user-add-line"></i>
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </div>
  );
};

export default Navbar;