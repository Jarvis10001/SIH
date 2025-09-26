import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Reduced scroll threshold
      
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`relative mx-4 transition-all duration-500 z-50 ${
        isScrolled 
          ? 'bg-white shadow-lg border border-gray-100' 
          : 'bg-black/20 backdrop-blur-sm border border-white/20'
      } rounded-2xl`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Updated with new color scheme */}
            <Link to="/" className="flex items-center group">
              <div className={`p-2 rounded-xl transition-colors duration-300 ${
                isScrolled
                  ? 'bg-[#3B82F6]/10 group-hover:bg-[#3B82F6]/20'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                {/* <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                </svg> */}
              </div>
              <div className="ml-3">
                <h2 className={`font-bold text-xl transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Smart <span className="bg-[#3B82F6] px-2 rounded-md text-white shadow-sm">ERP</span>
                </h2>
              </div>
            </Link>

            {/* Desktop Navigation - Updated styling */}
            <div className="hidden md:flex items-center space-x-1">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors duration-300 ${
                isScrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                {[
                  { name: 'Home', path: '#home', section: 'home' },
                  { name: 'Features', path: '#features', section: 'features' },
                  { name: 'Solutions', path: '#solutions', section: 'solutions' },
                  { name: 'About', path: '#about', section: 'about' },
                  { name: 'Contact', path: '#contact', section: 'contact', onClick: handleContactClick }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={item.onClick}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeSection === item.section
                        ? 'bg-[#3B82F6] text-white shadow-lg'
                        : isScrolled 
                          ? 'text-gray-700 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Portal Links - Compact styling */}
              <div className={`flex items-center gap-2 ml-4 pl-4 transition-colors duration-300 ${
                isScrolled ? 'border-l border-gray-200' : 'border-l border-white/20'
              }`}>
                <Link 
                  to="/teacher/login"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Teacher Portal"
                >
                  Teacher
                </Link>
                <Link 
                  to="/clerk/login"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Clerk Portal"
                >
                  Clerk
                </Link>
                <Link 
                  to="/admin/login"
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Admin Portal"
                >
                  Admin
                </Link>
              </div>

              {/* Auth Buttons - Updated styling */}
              <div className={`flex items-center gap-3 ml-6 pl-6 transition-colors duration-300 ${
                isScrolled ? 'border-l border-gray-200' : 'border-l border-white/20'
              }`}>
                <Link
                  to="/login"
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      : 'text-white/90 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-[#3B82F6] rounded-full hover:bg-[#2563EB] transition-all duration-300 shadow-lg shadow-[#3B82F6]/20"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button - Updated */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
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

        {/* Mobile Menu - Updated styling */}
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden ${
            isScrolled 
              ? 'bg-white border-t border-gray-100'
              : 'bg-black/90 backdrop-blur-md border-t border-white/10'
          }`}
        >
          <div className="px-4 py-3">
            {[
              { name: 'Home', path: '#home' },
              { name: 'Features', path: '#features' },
              { name: 'Solutions', path: '#solutions' },
              { name: 'Pricing', path: '#pricing' },
              { name: 'About', path: '#about' },
              { name: 'Contact', path: '#contact' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`block px-4 py-2.5 rounded-full text-base font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Portal Links Mobile */}
            <div className="pt-3 border-t border-gray-200/20">
              <Link 
                to="/teacher/login"
                className={`flex w-full text-left px-4 py-2.5 rounded-full font-medium transition-all duration-300 items-center gap-2 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-user-star-line"></i>
                Teacher Portal
              </Link>
              <Link 
                to="/clerk/login"
                className={`flex w-full text-left px-4 py-2.5 rounded-full font-medium transition-all duration-300 items-center gap-2 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-user-settings-line"></i>
                Clerk Portal
              </Link>
              <Link 
                to="/admin/login"
                className={`flex w-full text-left px-4 py-2.5 rounded-full font-medium transition-all duration-300 items-center gap-2 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <i className="ri-admin-line"></i>
                Admin Portal
              </Link>
            </div>
            
            <div className="pt-4 flex gap-2">
              <Link 
                to="/login"
                className="flex-1 px-4 py-2.5 text-[#3B82F6] border-2 border-[#3B82F6] rounded-full 
                         text-center hover:bg-[#3B82F6] hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="flex-1 px-4 py-2.5 bg-[#3B82F6] text-white rounded-full 
                         hover:bg-[#2563EB] transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => setIsOpen(false)}
              >
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