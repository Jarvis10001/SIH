import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Smart College Management System",
      subtitle: "Revolutionizing Education Administration",
      description: "Complete ERP solution for modern educational institutions. Streamline admissions, manage students, and optimize operations.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
      cta: "Get Started",
      link: "/signup",
      stats: [
        { value: "500+", label: "Colleges Served" },
        { value: "98%", label: "User Satisfaction" },
        { value: "24/7", label: "Support Available" }
      ]
    },
    {
      title: "Streamlined Student Admissions",
      subtitle: "Digital-First Admission Process",
      description: "Automated admission workflows with digital forms, document verification, and real-time application tracking.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
      cta: "Learn More",
      link: "#features",
      stats: [
        { value: "80%", label: "Time Reduction" },
        { value: "100%", label: "Digital Process" },
        { value: "95%", label: "Accuracy Rate" }
      ]
    },
    {
      title: "Comprehensive Fee Management",
      subtitle: "Automated Financial Operations",
      description: "Complete fee collection system with digital receipts, payment tracking, and automated financial reporting.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",
      cta: "View Demo",
      link: "/login",
      stats: [
        { value: "99.9%", label: "Payment Accuracy" },
        { value: "70%", label: "Cost Savings" },
        { value: "Real-time", label: "Financial Reports" }
      ]
    },
    {
      title: "Smart Hostel Management",
      subtitle: "Complete Residential Solutions",
      description: "Intelligent hostel management with room allocation, occupancy tracking, and maintenance request systems.",
      image: "https://images.unsplash.com/photo-1555854877-bab0e655b8db?auto=format&fit=crop&w=1400&q=80",
      cta: "Explore Features",
      link: "#solutions",
      stats: [
        { value: "100%", label: "Occupancy Tracking" },
        { value: "Fast", label: "Room Allocation" },
        { value: "24/7", label: "Maintenance Support" }
      ]
    }
  ];

  // Updated slide variants with slower transitions
  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)'
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction) => ({
      y: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)'
    })
  };

  // Add direction state for slide transitions
  const [[page, direction], setPage] = useState([0, 0]);

  // Updated slide change handler
  const paginate = (newDirection) => {
    const newPage = (page + newDirection + slides.length) % slides.length;
    setPage([newPage, newDirection]);
  };

  // Modified useEffect for auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page]);

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleCTAClick = (link) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="home" className="relative h-screen overflow-hidden bg-black">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E40AF]/5 rounded-full translate-x-1/2 translate-y-1/2 z-10"></div>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 100, damping: 30 },
            opacity: { duration: 0.8 },
            scale: { duration: 0.8 },
            filter: { duration: 0.8 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with enhanced Gradient Overlay */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-20"></div>
            <img
              src={slides[page].image}
              alt={slides[page].title}
              className="w-full h-full object-cover transform scale-[1.02] transition-transform duration-[2000ms]"
              style={{ backgroundColor: 'black' }}
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-30 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wider text-white uppercase bg-[#3B82F6]/20 backdrop-blur-sm rounded-full mb-6">
                    {slides[page].subtitle}
                  </span>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {slides[page].title}
                  </h1>
                  
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    {slides[page].description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {slides[page].stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {slides[page].link.startsWith('#') ? (
                      <button
                        onClick={() => handleCTAClick(slides[page].link)}
                        className="px-8 py-4 bg-[#3B82F6] text-white text-lg font-semibold rounded-full hover:bg-[#2563EB] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        {slides[page].cta}
                      </button>
                    ) : (
                      <Link
                        to={slides[page].link}
                        className="inline-block px-8 py-4 bg-[#3B82F6] text-white text-lg font-semibold rounded-full hover:bg-[#2563EB] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        {slides[page].cta}
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-30">
        <button
          onClick={() => paginate(-1)}
          className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group"
        >
          <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-3 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group"
        >
          <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Updated Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setPage([index, index > page ? 1 : -1])}
            className={`h-3 rounded-full transition-all duration-500 ${
              page === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80 w-3'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 right-8 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSlider;