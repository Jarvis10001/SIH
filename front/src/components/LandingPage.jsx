import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from './HeroSlider';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: '📚',
      title: 'Streamlined Admissions',
      description: 'Automated admission intake with digital forms, document verification, and instant confirmation. No more queues or paperwork.'
    },
    {
      icon: '💰',
      title: 'Automated Fee Collection',
      description: 'Digital receipts, payment tracking, and automated notifications. Real-time financial overview for administrators.'
    },
    {
      icon: '🏠',
      title: 'Smart Hostel Management',
      description: 'Live occupancy tracking, room allocation, and maintenance requests. Complete hostel ecosystem management.'
    },
    {
      icon: '📊',
      title: 'Real-time Dashboards',
      description: 'Comprehensive analytics and reporting for administrators. Key metrics and institutional overview at a glance.'
    },
    {
      icon: '🔒',
      title: 'Secure & Role-based',
      description: 'Built-in security with role-based access control. Data protection and regular backups ensure safety.'
    },
    {
      icon: '☁️',
      title: 'Cloud-based Solution',
      description: 'Leverages familiar cloud office suites. Low-cost, scalable solution that any college can implement.'
    }
  ];

  const benefits = [
    { stat: '80%', label: 'Reduction in Administrative Time' },
    { stat: '95%', label: 'Data Accuracy Improvement' },
    { stat: '70%', label: 'Cost Savings vs Traditional ERP' },
    { stat: '24/7', label: 'System Availability' }
  ];

  const workflow = [
    {
      step: '1',
      title: 'Admission Intake',
      description: 'Students apply through digital forms'
    },
    {
      step: '2',
      title: 'Data Integration',
      description: 'Information flows to central database'
    },
    {
      step: '3',
      title: 'Automated Processing',
      description: 'Fees, hostel, library records update automatically'
    },
    {
      step: '4',
      title: 'Real-time Insights',
      description: 'Administrators access live dashboards'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Portal Access Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Your Portal</h2>
            <p className="text-lg text-gray-600">Sign in to your dedicated dashboard based on your role</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Student Portal */}
            <Link 
              to="/login" 
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-graduation-cap-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Portal</h3>
              <p className="text-gray-600 mb-4">Access admission forms, fee payments, dashboard, and academic records</p>
              <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700">
                Sign In <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            {/* Teacher Portal */}
            <Link 
              to="/teacher/login" 
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-user-star-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Teacher Portal</h3>
              <p className="text-gray-600 mb-4">Manage courses, students, assignments, grades, and attendance</p>
              <div className="flex items-center justify-center text-green-600 font-medium group-hover:text-green-700">
                Sign In <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            {/* Admin Portal */}
            <Link 
              to="/admin/login" 
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="ri-admin-line text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Portal</h3>
              <p className="text-gray-600 mb-4">Manage teachers, students, admissions, and system administration</p>
              <div className="flex items-center justify-center text-purple-600 font-medium group-hover:text-purple-700">
                Sign In <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{benefit.stat}</h3>
                <p className="text-gray-600 font-medium">{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Challenge</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most colleges struggle with fragmented systems, manual processes, 
              and expensive ERP solutions that are out of reach.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">Separate Ledgers</h4>
              <p className="text-red-600">Admissions, fees, hostel, and exam records scattered across different systems</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
              <div className="text-4xl mb-4">⏰</div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">Long Queues</h4>
              <p className="text-red-600">Students wait at multiple counters for different services</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">Data Re-entry</h4>
              <p className="text-red-600">Staff manually enter the same information multiple times</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">No Real-time Overview</h4>
              <p className="text-red-600">Administrators lack instant access to institutional metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solutions" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive yet affordable ERP system built on familiar cloud tools. 
              Single source of truth without the massive capital investment.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {workflow.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="text-center max-w-xs">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto shadow-lg">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block text-3xl text-blue-600 mx-4">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Everything you need to run a modern educational institution</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-6 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your institution</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Perfect for small colleges</p>
              <div className="text-4xl font-bold text-blue-600 mb-6">₹15,000<span className="text-lg text-gray-500">/year</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Up to 500 students</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Basic modules</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Email support</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-500 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">Ideal for medium colleges</p>
              <div className="text-4xl font-bold text-blue-600 mb-6">₹35,000<span className="text-lg text-gray-500">/year</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Up to 2000 students</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>All modules included</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Priority support</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Custom integrations</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large institutions</p>
              <div className="text-4xl font-bold text-blue-600 mb-6">₹75,000<span className="text-lg text-gray-500">/year</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Unlimited students</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Advanced analytics</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>24/7 phone support</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>On-site training</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Institution?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of colleges already using our smart ERP solution. 
            Get started today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold">Smart College ERP</h4>
              </div>
              <p className="text-gray-400 mb-4">Simplifying education management through intelligent automation.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Admission Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fee Collection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hostel Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Real-time Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Admin Access</h4>
              <div className="space-y-3">
                <Link 
                  to="/admin/login"
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors group"
                >
                  <i className="ri-admin-line group-hover:scale-110 transition-transform"></i>
                  Admin Portal
                </Link>
                <div className="text-xs text-gray-500 bg-gray-800 p-2 rounded-lg">
                  <p className="font-medium text-gray-400 mb-1">Default Login:</p>
                  <p>Username: <span className="font-mono text-purple-400">admin</span></p>
                  <p>Password: <span className="font-mono text-purple-400">Admin@123</span></p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@smartcollegeerp.com</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 Bangalore, India</p>
                <p className="text-sm pt-2">Built for SIH 2025 • Problem Statement #1234</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Smart College ERP. Built with ❤️ for educational institutions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;