import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { themeClasses } from '../styles/theme';
import HeroSlider from './HeroSlider';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

// Background pattern component
const BackgroundPattern = ({ pattern = 'dots', opacity = 0.03 }) => {
  const patterns = {
    dots: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    grid: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='m0 40 40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E\")",
    circles: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z' fill='%236366f1' fill-opacity='0.08'/%3E%3C/svg%3E\")"
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <div className="absolute inset-0" style={{ backgroundImage: patterns[pattern] }} />
    </div>
  );
};

// Reusable feature card
const FeatureCard = ({ icon, title, description, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="group bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-2"
  >
    <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20`}>
      <i className={`${icon} text-2xl text-white`} aria-hidden="true" />
    </div>
    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const LandingPage = () => {
  const [visibleStats, setVisibleStats] = useState(false);

  const features = useMemo(() => [
    {
      icon: 'ri-graduation-cap-line',
      title: 'Streamlined Admissions',
      description: 'Automated admission intake with digital forms, document verification, and instant confirmation. No more queues or paperwork.',
      color: 'from-indigo-600 to-indigo-500'
    },
    {
      icon: 'ri-money-dollar-circle-line',
      title: 'Automated Fee Collection',
      description: 'Digital receipts, payment tracking, and automated notifications. Real-time financial overview for administrators.',
      color: 'from-emerald-500 to-emerald-400'
    },
    {
      icon: 'ri-building-line',
      title: 'Smart Hostel Management',
      description: 'Live occupancy tracking, room allocation, and maintenance requests. Complete hostel ecosystem management.',
      color: 'from-indigo-500 to-indigo-400'
    },
    {
      icon: 'ri-dashboard-line',
      title: 'Real-time Dashboards',
      description: 'Comprehensive analytics and reporting for administrators. Key metrics and institutional overview at a glance.',
      color: 'from-slate-600 to-slate-500'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Secure & Role-based',
      description: 'Built-in security with role-based access control. Data protection and regular backups ensure safety.',
      color: 'from-indigo-600 to-indigo-500'
    },
    {
      icon: 'ri-cloud-line',
      title: 'Cloud-based Solution',
      description: 'Leverages familiar cloud office suites. Low-cost, scalable solution that any college can implement.',
      color: 'from-emerald-500 to-emerald-400'
    }
  ], []);

  const benefits = useMemo(() => [
    { stat: '80%', label: 'Reduction in Administrative Time', icon: 'ri-time-line', color: 'text-indigo-400' },
    { stat: '95%', label: 'Data Accuracy Improvement', icon: 'ri-check-double-line', color: 'text-emerald-400' },
    { stat: '70%', label: 'Cost Savings vs Traditional ERP', icon: 'ri-money-dollar-circle-line', color: 'text-indigo-400' },
    { stat: '24/7', label: 'System Availability', icon: 'ri-24-hours-line', color: 'text-emerald-400' }
  ], []);

  const workflow = useMemo(() => [
    { step: '1', title: 'Admission Intake', description: 'Students apply through digital forms' },
    { step: '2', title: 'Data Integration', description: 'Information flows to central database' },
    { step: '3', title: 'Automated Processing', description: 'Fees, hostel, library records update automatically' },
    { step: '4', title: 'Real-time Insights', description: 'Administrators access live dashboards' }
  ], []);

  const problems = useMemo(() => [
    {
      icon: 'ri-file-list-3-line',
      title: 'Separate Ledgers',
      description: 'Admissions, fees, hostel, and exam records scattered across different systems',
      color: 'from-red-400 to-red-500'
    },
    {
      icon: 'ri-time-line',
      title: 'Long Queues',
      description: 'Students wait at multiple counters for different services',
      color: 'from-amber-400 to-amber-500'
    },
    {
      icon: 'ri-edit-line',
      title: 'Data Re-entry',
      description: 'Staff manually enter the same information multiple times',
      color: 'from-amber-500 to-amber-400'
    },
    {
      icon: 'ri-admin-line',
      title: 'No Real-time Overview',
      description: 'Administrators lack instant access to institutional metrics',
      color: 'from-red-500 to-red-400'
    }
  ], []);

  const handleScroll = useCallback(() => {
    const statsSection = document.getElementById('stats');
    if (statsSection && !visibleStats) {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisibleStats(true);
      }
    }
  }, [visibleStats]);

  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Portal Access Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden" aria-labelledby="portal-heading">
        <BackgroundPattern pattern="dots" opacity={0.05} />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 id="portal-heading" className="text-4xl md:text-5xl font-bold text-white mb-6">
              Access Your <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Portal</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sign in to your dedicated dashboard and unlock the full potential of smart education management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                to: '/login',
                icon: 'ri-graduation-cap-line',
                title: 'Student Portal',
                desc: 'Access admission forms, fee payments, academic records, and personalized dashboard',
                gradient: 'from-indigo-600 to-indigo-500',
                borderHover: 'hover:border-indigo-500',
                textColor: 'text-indigo-400',
                delay: 0.1
              },
              {
                to: '/teacher/login',
                icon: 'ri-user-star-line',
                title: 'Teacher Portal',
                desc: 'Manage courses, students, assignments, grades, and track attendance efficiently',
                gradient: 'from-emerald-500 to-emerald-400',
                borderHover: 'hover:border-emerald-500',
                textColor: 'text-emerald-400',
                delay: 0.2
              },
              {
                to: '/admin/login',
                icon: 'ri-admin-line',
                title: 'Admin Portal',
                desc: 'Complete system administration, user management, and institutional oversight',
                gradient: 'from-slate-600 to-slate-500',
                borderHover: 'hover:border-slate-500',
                textColor: 'text-slate-400',
                delay: 0.3
              }
            ].map((portal, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: portal.delay }}>
                <Link to={portal.to} className={`group bg-gray-800 p-8 rounded-2xl border border-gray-700 ${portal.borderHover} shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-3 text-center block`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${portal.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/20`}>
                    <i className={`${portal.icon} text-3xl text-white`} aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{portal.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{portal.desc}</p>
                  <div className={`flex items-center justify-center ${portal.textColor} font-semibold text-lg`}>
                    Sign In <i className="ri-arrow-right-line ml-2 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-20 relative overflow-hidden" aria-labelledby="stats-heading">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-emerald-900/10" />
        <BackgroundPattern pattern="grid" opacity={0.03} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 id="stats-heading" className="text-4xl font-bold text-white mb-4">
              Proven Results That <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Matter</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of educational institutions already experiencing transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="mb-4">
                  <i className={`${benefit.icon} text-4xl ${benefit.color} group-hover:scale-110 transition-transform duration-300`} aria-hidden="true" />
                </div>
                <h3 className="text-4xl lg:text-6xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
                  {visibleStats && benefit.stat}
                </h3>
                <p className="text-gray-400 font-medium text-lg leading-relaxed">{benefit.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="about" className="py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden" aria-labelledby="problem-heading">
        <BackgroundPattern pattern="circles" opacity={0.04} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 id="problem-heading" className="text-5xl font-bold text-white mb-6">
              The <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">Challenge</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Most educational institutions struggle with fragmented systems, manual processes,
              and expensive ERP solutions that are out of reach for smaller colleges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-red-400/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${problem.color} text-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <i className={`${problem.icon} text-2xl`} aria-hidden="true" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{problem.title}</h4>
                <p className="text-gray-400 leading-relaxed">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solutions" className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden" aria-labelledby="solution-heading">
        <BackgroundPattern pattern="dots" opacity={0.05} />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 id="solution-heading" className="text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Solution</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              A comprehensive yet affordable academic management system built on familiar cloud tools.
              Single source of truth without the massive capital investment.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
            {workflow.map((item, index) => (
              <React.Fragment key={index}>
                <motion.div {...scaleIn} transition={{ duration: 0.6, delay: index * 0.2 }} className="text-center max-w-xs group">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-2xl shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300 border border-indigo-400/20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </motion.div>
                {index < workflow.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    className="hidden lg:block text-4xl text-indigo-500 mx-8"
                    aria-hidden="true"
                  >
                    <i className="ri-arrow-right-line" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative" aria-labelledby="features-heading">
        <BackgroundPattern pattern="grid" opacity={0.03} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 id="features-heading" className="text-5xl font-bold text-white mb-6">
              Key <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to run a modern educational institution with efficiency and intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden" aria-labelledby="pricing-heading">
        <BackgroundPattern pattern="circles" opacity={0.04} />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <h2 id="pricing-heading" className="text-5xl font-bold text-white mb-6">
              Simple <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your institution. No hidden fees, transparent pricing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <p className="text-gray-400 mb-6">Perfect for small colleges</p>
                <div className="text-5xl font-bold text-indigo-400 mb-2">₹15,000<span className="text-lg text-gray-500">/year</span></div>
                <p className="text-sm text-gray-500">₹1,250 per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Up to 500 students',
                  'Basic modules included',
                  'Email support',
                  'Cloud storage 10GB',
                  'Monthly reports'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <i className="ri-check-line text-emerald-400 mr-3 text-lg" aria-hidden="true" />
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-gradient-to-r from-slate-600 to-slate-500 text-white py-4 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-300 shadow-lg shadow-slate-500/25 group-hover:scale-105">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-800 text-white relative overflow-hidden" aria-labelledby="cta-heading">
        <BackgroundPattern pattern="dots" opacity={0.08} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="cta-heading" className="text-5xl md:text-6xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Transform</span> Your Institution?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-indigo-100 leading-relaxed max-w-3xl mx-auto">
              Join hundreds of colleges already using our AcademiX solution.
              Start your journey towards digital transformation today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/25 flex items-center gap-3"
              >
                <i className="ri-rocket-line text-xl" aria-hidden="true" />
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3"
              >
                <i className="ri-calendar-line text-xl" aria-hidden="true" />
                Schedule Demo
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { value: '500+', label: 'Institutions', delay: 0.1 },
                { value: '50K+', label: 'Students', delay: 0.2 },
                { value: '99.9%', label: 'Uptime', delay: 0.3 },
                { value: '4.9/5', label: 'Rating', delay: 0.4 }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{item.value}</div>
                  <p className="text-indigo-200">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-20 relative overflow-hidden">
        <BackgroundPattern pattern="grid" opacity={0.02} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <i className="ri-graduation-cap-line text-white text-xl" aria-hidden="true" />
                  </div>
                  <h4 className="text-2xl font-bold"><span className="text-indigo-400">AcademiX</span></h4>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Revolutionizing education management through intelligent automation and cloud-based solutions.
                  Empowering institutions to focus on what matters most - education.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: 'ri-twitter-line', href: '#', color: 'hover:text-indigo-400' },
                    { icon: 'ri-linkedin-line', href: '#', color: 'hover:text-indigo-400' },
                    { icon: 'ri-github-line', href: '#', color: 'hover:text-gray-300' },
                    { icon: 'ri-mail-line', href: '#', color: 'hover:text-emerald-400' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 ${social.color} transition-all duration-300 hover:scale-110 border border-gray-700`}
                      aria-label={`Social media link ${index + 1}`}
                    >
                      <i className={social.icon} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-6 text-indigo-400">Features</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Admission Management', icon: 'ri-user-add-line' },
                  { name: 'Fee Collection', icon: 'ri-money-dollar-circle-line' },
                  { name: 'Hostel Management', icon: 'ri-building-line' },
                  { name: 'Real-time Analytics', icon: 'ri-bar-chart-line' },
                  { name: 'Event Management', icon: 'ri-calendar-event-line' }
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-indigo-400 transition-colors group">
                      <i className={`${item.icon} group-hover:text-indigo-400 transition-colors`} aria-hidden="true" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-6 text-indigo-400">Support</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Documentation', icon: 'ri-book-line' },
                  { name: 'API Reference', icon: 'ri-code-line' },
                  { name: 'Help Center', icon: 'ri-question-line' },
                  { name: 'Contact Us', icon: 'ri-customer-service-line' },
                  { name: 'Community', icon: 'ri-group-line' }
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors group">
                      <i className={`${item.icon} group-hover:text-emerald-400 transition-colors`} aria-hidden="true" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Admin Access & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-lg font-bold mb-6 text-indigo-400">Quick Access</h4>
              <div className="space-y-4 mb-8">
                <Link
                  to="/admin/login"
                  className="flex items-center gap-3 text-gray-400 hover:text-slate-400 transition-colors group"
                >
                  <i className="ri-admin-line group-hover:scale-110 transition-transform" aria-hidden="true" />
                  Admin Portal
                </Link>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                  <p className="font-medium text-gray-300 mb-2">Demo Login:</p>
                  <p className="text-sm text-gray-400">Username: <span className="font-mono text-indigo-400">admin</span></p>
                  <p className="text-sm text-gray-400">Password: <span className="font-mono text-indigo-400">Admin@123</span></p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-gray-300">Contact Info</h5>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-400">
                    <i className="ri-mail-line text-indigo-400" aria-hidden="true" />
                    info@academix.com
                  </p>
                  <p className="flex items-center gap-2 text-gray-400">
                    <i className="ri-phone-line text-emerald-400" aria-hidden="true" />
                    +91 98765 43210
                  </p>
                  <p className="flex items-center gap-2 text-gray-400">
                    <i className="ri-map-pin-line text-slate-400" aria-hidden="true" />
                    Bangalore, India
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-400">
                  &copy; 2025 AcademiX. Built with <span className="text-red-400" aria-label="love">❤️</span> for educational institutions.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Built for SIH 2025 • Problem Statement #1234
                </p>
              </div>
              <nav className="flex gap-6 text-sm" aria-label="Footer navigation">
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</a>
              </nav>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
// true" />
//   < span className = "text-gray-400" > { feature }</span >
//                   </li >
//                 ))}
//               </ul >
//   <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-indigo-500/25 group-hover:scale-105">
//     Get Started
//   </button>
//             </motion.div >

//   {/* Pro Plan */ }
//   < motion.div
// initial = {{ opacity: 0, y: 30 }}
// whileInView = {{ opacity: 1, y: 0 }}
// viewport = {{ once: true }}
// transition = {{ duration: 0.6, delay: 0.2 }}
// className = "bg-gray-800 p-8 rounded-2xl border-2 border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 relative group scale-105"
//   >
//               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                 <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
//                   Most Popular
//                 </span>
//               </div>
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
//                 <p className="text-gray-400 mb-6">Ideal for medium colleges</p>
//                 <div className="text-5xl font-bold text-indigo-400 mb-2">₹35,000<span className="text-lg text-gray-500">/year</span></div>
//                 <p className="text-sm text-gray-500">₹2,917 per month</p>
//               </div>
//               <ul className="space-y-4 mb-8">
//                 {[
//                   'Up to 2000 students',
//                   'All modules included',
//                   'Priority support',
//                   'Custom integrations',
//                   'Cloud storage 100GB',
//                   'Weekly reports',
//                   'Advanced analytics'
//                 ].map((feature, index) => (
//                   <li key={index} className="flex items-center">
//                     <i className="ri-check-line text-emerald-400 mr-3 text-lg" aria-hidden="true" />
//                     <span className="text-gray-400">{feature}</span>
//                   </li>
//                 ))}
//               </ul>
//               <button className="w-full bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-indigo-500/25 group-hover:scale-105">
//                 Get Started
//               </button>
//             </motion.div >

//   {/* Enterprise Plan */ }
//   < motion.div
// initial = {{ opacity: 0, y: 30 }}
// whileInView = {{ opacity: 1, y: 0 }}
// viewport = {{ once: true }}
// transition = {{ duration: 0.6, delay: 0.3 }}
// className = "bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-slate-500/50 hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 transform hover:-translate-y-2 group"
//   >
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
//                 <p className="text-gray-400 mb-6">For large institutions</p>
//                 <div className="text-5xl font-bold text-slate-400 mb-2">₹75,000<span className="text-lg text-gray-500">/year</span></div>
//                 <p className="text-sm text-gray-500">₹6,250 per month</p>
//               </div>
//               <ul className="space-y-4 mb-8">
//                 {[
//                   'Unlimited students',
//                   'Advanced analytics',
//                   '24/7 phone support',
//                   'On-site training',
//                   'Cloud storage unlimited',
//                   'Daily reports & insights',
//                   'Custom development',
//                   'Dedicated account manager'
//                 ].map((feature, index) => (
//                   <li key={index} className="flex items-center">
//                     <i className="ri-check-line text-emerald-400 mr-3 text-lg" aria-hidden="