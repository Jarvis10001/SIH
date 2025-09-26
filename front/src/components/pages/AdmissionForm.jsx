import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdmissionForm = () => {
  const navigate = useNavigate();

  // Shared input classes for consistent styling
  const inputClasses = `
    w-full p-3 rounded-xl 
    bg-[#F8F9F4] border-2 border-transparent
    focus:border-[#4CAF50]
    focus:ring-4 focus:ring-[#4CAF50]/10 
    focus:bg-white
    hover:border-[#4CAF50]/30
    transition-all duration-300 ease-in-out
    text-[#333333] placeholder-[#6C757D]/60
    focus:placeholder-[#4CAF50]/50
    focus:shadow-lg focus:shadow-[#4CAF50]/5
    outline-none
  `;

  const selectClasses = inputClasses + ` appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(
    `<svg width="20" height="20" fill="none" stroke="%234CAF50" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`
  )}')] bg-[length:20px_20px] bg-no-repeat bg-[center_right_1rem] pr-12`;

  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    mobileNo: '',
    parentsMobileNo: '',
    email: '',

    // Address Information
    address: '',
    city: '',
    state: '',
    pincode: '',
    isOtherState: false,
    domicileState: '',

    // Academic Information
    course: '',
    branch: '',
    tenthBoard: '',
    tenthPercentage: '',
    tenthYearOfPassing: '',
    twelfthBoard: '',
    twelfthPercentage: '',
    twelfthYearOfPassing: '',

    // Entrance Exam Details
    jeeRollNo: '',
    jeeRank: '',
    jeeScore: '',

    // Category Information
    category: '',
    isMinority: false,
    minorityType: '',

    // Additional Information
    bloodGroup: '',
    aadharNo: '',
    religion: '',
    nationality: 'Indian',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactMobile: ''
  });

  const [documents, setDocuments] = useState({
    tenthMarksheet: null,
    twelfthMarksheet: null,
    medicalCertificate: null,
    jeeResult: null,
    categoryCertificate: null,
    aadharCard: null,
    photo: null,
    signature: null
  });

  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState('');

  // Check if user has already submitted admission form
  useEffect(() => {
    console.log("check");

    const checkAdmissionStatus = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        // Check if user has already submitted admission form
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admission/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success && response.data.admission) {
          setSubmitted(true);
        }
      } catch (error) {
        // If no admission found (404), that's fine - user can submit
        if (error.response?.status !== 404) {
          console.error('Error checking admission status:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmissionStatus();
  }, [navigate]);


  const courseOptions = [
    'B.Tech',
    'M.Tech',
    'B.Sc',
    'M.Sc',
    'BCA',
    'MCA',
    'MBA',
    'B.Com',
    'M.Com',
    'BA',
    'MA'
  ];

  const branchOptions = {
    'B.Tech': [
      'Computer Science Engineering',
      'Information Technology',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electronics & Communication',
      'Chemical Engineering',
      'Aerospace Engineering'
    ],
    'M.Tech': [
      'Computer Science',
      'Information Technology',
      'VLSI Design',
      'Power Systems',
      'Structural Engineering',
      'Thermal Engineering'
    ],
    'B.Sc': [
      'Computer Science',
      'Physics',
      'Chemistry',
      'Mathematics',
      'Biology',
      'Biotechnology'
    ],
    'M.Sc': [
      'Computer Science',
      'Physics',
      'Chemistry',
      'Mathematics',
      'Biotechnology'
    ],
    'BCA': [
      'Computer Applications',
      'Software Development',
      'Web Development',
      'Database Management',
      'Network Administration'
    ],
    'MCA': [
      'Computer Applications',
      'Software Engineering',
      'Data Science',
      'Artificial Intelligence',
      'Cyber Security',
      'Cloud Computing'
    ],
    'MBA': [
      'Finance',
      'Marketing',
      'Human Resource Management',
      'Operations Management',
      'Information Technology',
      'International Business',
      'Entrepreneurship',
      'Healthcare Management'
    ],
    'B.Com': [
      'General',
      'Accounting & Finance',
      'Banking & Insurance',
      'Taxation',
      'E-Commerce',
      'Computer Applications'
    ],
    'M.Com': [
      'Accounting',
      'Finance',
      'Banking',
      'Taxation',
      'Business Analytics',
      'International Business'
    ],
    'BA': [
      'English Literature',
      'History',
      'Political Science',
      'Psychology',
      'Sociology',
      'Economics',
      'Philosophy',
      'Geography'
    ],
    'MA': [
      'English Literature',
      'History',
      'Political Science',
      'Psychology',
      'Sociology',
      'Economics',
      'Philosophy',
      'Public Administration'
    ]
  };

  // Helper to resolve branches for a selected course
  const getBranchesForCourse = (course) => {
    if (!course) return [];

    // Direct lookup from branchOptions
    return branchOptions[course] || [];
  };

  const availableBranches = getBranchesForCourse(formData.course);

  // Minimal debug: log when course changes (only during debugging)
  useEffect(() => {
    if (formData.course) {
      // eslint-disable-next-line no-console
      console.log('DEBUG: course selected ->', formData.course, '; availableBranches ->', availableBranches);
    }
  }, [formData.course]);

  const categoryOptions = [
    'General',
    'OBC-NCL',
    'SC',
    'ST',
    'EWS'
  ];

  const stateOptions = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Lakshadweep', 'Puducherry'
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  const validateFile = (file) => {
    if (!file) return 'Please select a file';
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG and PDF files are allowed';
    }
    return null;
  };

  const handleInputChange = (e) => {
    console.log('handleInputChange: course changed ->');
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Reset branch when course changes
      if (name === 'course') {
        // eslint-disable-next-line no-console
        console.log('handleInputChange: course changed ->', value);
        newData.branch = '';
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Explicit handler for Course select to log selection
  const handleCourseSelect = (e) => {
    const value = e.target.value;
    console.log('Course selected (handler):', value);
    console.info('Course selected (info):', value);

    // Debug branch lookup
    const branches = getBranchesForCourse(value);
    console.log('Branches found for course:', value, '→', branches);

    // Show ephemeral on-page flash to help verify selection
    if (value) {
      setFlashMessage(`Selected: ${value} (${branches.length} branches)`);
      setTimeout(() => setFlashMessage(''), 2500);
    }
    handleInputChange(e);
  };

  // Handler for Category select to log and alert selection
  const handleCategorySelect = (e) => {
    const value = e.target.value;
    console.log('Category selected (handler):', value);
    if (value) {
      setFlashMessage(`Selected category: ${value}`);
      setTimeout(() => setFlashMessage(''), 2500);
    }
    handleInputChange(e);
  };


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const error = validateFile(files[0]);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }));
        e.target.value = ''; // Reset input
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [name]: files[0]
      }));

      // Clear error
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-[#4CAF50]', 'bg-[#4CAF50]/5');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-[#4CAF50]', 'bg-[#4CAF50]/5');
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-[#4CAF50]', 'bg-[#4CAF50]/5');

    const file = e.dataTransfer.files[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Clear error
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      'name', 'fatherName', 'motherName', 'gender', 'dateOfBirth',
      'mobileNo', 'parentsMobileNo', 'email', 'address', 'city', 'state',
      'pincode', 'course', 'tenthBoard', 'tenthPercentage',
      'tenthYearOfPassing', 'twelfthBoard', 'twelfthPercentage',
      'twelfthYearOfPassing', 'category', 'aadharNo'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile number validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (formData.mobileNo && !mobileRegex.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.parentsMobileNo && !mobileRegex.test(formData.parentsMobileNo)) {
      newErrors.parentsMobileNo = 'Please enter a valid 10-digit mobile number';
    }

    // Aadhar number validation
    const aadharRegex = /^\d{12}$/;
    if (formData.aadharNo && !aadharRegex.test(formData.aadharNo)) {
      newErrors.aadharNo = 'Please enter a valid 12-digit Aadhar number';
    }

    // Percentage validation
    if (formData.tenthPercentage && (formData.tenthPercentage < 0 || formData.tenthPercentage > 100)) {
      newErrors.tenthPercentage = 'Percentage should be between 0 and 100';
    }
    if (formData.twelfthPercentage && (formData.twelfthPercentage < 0 || formData.twelfthPercentage > 100)) {
      newErrors.twelfthPercentage = 'Percentage should be between 0 and 100';
    }

    // Document validation
    const requiredDocuments = ['tenthMarksheet', 'twelfthMarksheet', 'medicalCertificate', 'aadharCard', 'photo'];
    requiredDocuments.forEach(doc => {
      if (!documents[doc]) {
        newErrors[doc] = 'This document is required';
      }
    });

    // JEE result required for engineering courses
    if ((formData.course === 'B.Tech' || formData.course === 'M.Tech') && !documents.jeeResult) {
      newErrors.jeeResult = 'JEE result is required for engineering courses';
    }

    // Category certificate required for reserved categories
    if (['OBC-NCL', 'SC', 'ST', 'EWS'].includes(formData.category) && !documents.categoryCertificate) {
      newErrors.categoryCertificate = 'Category certificate is required for reserved categories';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();

      // Append form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append documents
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formDataToSend.append(key, documents[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admission/submit`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSubmitted(true);
        alert('Admission form submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-2xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your admission form has been submitted. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
          >
            Submit Another Form
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Admission Form</h1>
            <p className="text-green-100 mt-2">Please fill all the required information carefully</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter father's name"
                  />
                  {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter mother's name"
                  />
                  {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parents Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="parentsMobileNo"
                    value={formData.parentsMobileNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter parents mobile number"
                    maxLength="10"
                  />
                  {errors.parentsMobileNo && <p className="text-red-500 text-xs mt-1">{errors.parentsMobileNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadharNo"
                    value={formData.aadharNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                  />
                  {errors.aadharNo && <p className="text-red-500 text-xs mt-1">{errors.aadharNo}</p>}
                </div>
              </div>
            </section>

            {/* Address Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter complete address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  >
                    <option value="">Select State</option>
                    {stateOptions.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter PIN code"
                    maxLength="6"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isOtherState"
                      checked={formData.isOtherState}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
                    />
                    <span className="text-sm text-gray-700">Student from other state</span>
                  </label>
                  {formData.isOtherState && (
                    <select
                      name="domicileState"
                      value={formData.domicileState}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    >
                      <option value="">Select Domicile State</option>
                      {stateOptions.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </section>

            {/* Academic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Academic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleCourseSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch <span className="text-gray-500">(Optional)</span>
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Branch</option>
                    {/* B.Tech Branches */}
                    <option value="Computer Science Engineering">Computer Science Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Aerospace Engineering">Aerospace Engineering</option>

                    {/* M.Tech Branches */}
                    <option value="Computer Science">Computer Science</option>
                    <option value="VLSI Design">VLSI Design</option>
                    <option value="Power Systems">Power Systems</option>
                    <option value="Structural Engineering">Structural Engineering</option>
                    <option value="Thermal Engineering">Thermal Engineering</option>

                    {/* B.Sc/M.Sc Branches */}
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Biotechnology">Biotechnology</option>

                    {/* BCA/MCA Branches */}
                    <option value="Computer Applications">Computer Applications</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Database Management">Database Management</option>
                    <option value="Network Administration">Network Administration</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Cloud Computing">Cloud Computing</option>

                    {/* MBA Branches */}
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resource Management">Human Resource Management</option>
                    <option value="Operations Management">Operations Management</option>
                    <option value="International Business">International Business</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Healthcare Management">Healthcare Management</option>

                    {/* B.Com/M.Com Branches */}
                    <option value="General">General</option>
                    <option value="Accounting & Finance">Accounting & Finance</option>
                    <option value="Banking & Insurance">Banking & Insurance</option>
                    <option value="Taxation">Taxation</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Banking">Banking</option>
                    <option value="Business Analytics">Business Analytics</option>

                    {/* BA/MA Branches */}
                    <option value="English Literature">English Literature</option>
                    <option value="History">History</option>
                    <option value="Political Science">Political Science</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Sociology">Sociology</option>
                    <option value="Economics">Economics</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Geography">Geography</option>
                    <option value="Public Administration">Public Administration</option>
                  </select>
                  {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategorySelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                {/* Visible debug indicator */}
                <div className="lg:col-span-3 mt-2 text-sm text-gray-600">
                  <span className="font-medium">Selected Course:</span> {formData.course || '—'}
                  <span className="ml-4 font-medium">Available Branches:</span> {getBranchesForCourse(formData.course).length}
                  {formData.branch && (
                    <>
                      <span className="ml-4 font-medium">Selected Branch:</span>
                      <span className="text-green-600">{formData.branch}</span>
                    </>
                  )}
                </div>
                {flashMessage && (
                  <div className="lg:col-span-3 mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                    {flashMessage}
                  </div>
                )}

                {/* 10th Class Details */}
                <div className="lg:col-span-3">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 mt-4">10th Class Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Board <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="tenthBoard"
                        value={formData.tenthBoard}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="e.g., CBSE, ICSE, State Board"
                      />
                      {errors.tenthBoard && <p className="text-red-500 text-xs mt-1">{errors.tenthBoard}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tenthPercentage"
                        value={formData.tenthPercentage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      {errors.tenthPercentage && <p className="text-red-500 text-xs mt-1">{errors.tenthPercentage}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Passing <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="tenthYearOfPassing"
                        value={formData.tenthYearOfPassing}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="e.g., 2020"
                        min="2000"
                        max="2030"
                      />
                      {errors.tenthYearOfPassing && <p className="text-red-500 text-xs mt-1">{errors.tenthYearOfPassing}</p>}
                    </div>
                  </div>
                </div>

                {/* 12th Class Details */}
                <div className="lg:col-span-3">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 mt-4">12th Class Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Board <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="twelfthBoard"
                        value={formData.twelfthBoard}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="e.g., CBSE, ICSE, State Board"
                      />
                      {errors.twelfthBoard && <p className="text-red-500 text-xs mt-1">{errors.twelfthBoard}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="twelfthPercentage"
                        value={formData.twelfthPercentage}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      {errors.twelfthPercentage && <p className="text-red-500 text-xs mt-1">{errors.twelfthPercentage}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Passing <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="twelfthYearOfPassing"
                        value={formData.twelfthYearOfPassing}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="e.g., 2022"
                        min="2000"
                        max="2030"
                      />
                      {errors.twelfthYearOfPassing && <p className="text-red-500 text-xs mt-1">{errors.twelfthYearOfPassing}</p>}
                    </div>
                  </div>
                </div>

                {/* JEE Details */}
                {(formData.course === 'B.Tech' || formData.course === 'M.Tech') && (
                  <div className="lg:col-span-3">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 mt-4">JEE Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          JEE Roll Number
                        </label>
                        <input
                          type="text"
                          name="jeeRollNo"
                          value={formData.jeeRollNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                          placeholder="Enter JEE roll number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          JEE Rank
                        </label>
                        <input
                          type="number"
                          name="jeeRank"
                          value={formData.jeeRank}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                          placeholder="Enter JEE rank"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          JEE Score
                        </label>
                        <input
                          type="number"
                          name="jeeScore"
                          value={formData.jeeScore}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                          placeholder="Enter JEE score"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Document Upload Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Document Upload
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    10th Class Marksheet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="tenthMarksheet"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                  {errors.tenthMarksheet && <p className="text-red-500 text-xs mt-1">{errors.tenthMarksheet}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    12th Class Marksheet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="twelfthMarksheet"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                  {errors.twelfthMarksheet && <p className="text-red-500 text-xs mt-1">{errors.twelfthMarksheet}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Fitness Certificate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="medicalCertificate"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                  {errors.medicalCertificate && <p className="text-red-500 text-xs mt-1">{errors.medicalCertificate}</p>}
                </div>

                {(formData.course === 'B.Tech' || formData.course === 'M.Tech') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      JEE Result <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="jeeResult"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                    {errors.jeeResult && <p className="text-red-500 text-xs mt-1">{errors.jeeResult}</p>}
                  </div>
                )}

                {['OBC-NCL', 'SC', 'ST', 'EWS'].includes(formData.category) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Certificate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="categoryCertificate"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                    {errors.categoryCertificate && <p className="text-red-500 text-xs mt-1">{errors.categoryCertificate}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhar Card <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="aadharCard"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF (Max 5MB)</p>
                  {errors.aadharCard && <p className="text-red-500 text-xs mt-1">{errors.aadharCard}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport Size Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG only (Max 5MB)</p>
                  {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Signature
                  </label>
                  <input
                    type="file"
                    name="signature"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG only (Max 5MB)</p>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter religion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter nationality"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <h3 className="text-lg font-medium text-gray-800 mb-3 mt-6">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relation
                  </label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="e.g., Uncle, Aunt, Brother"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactMobile"
                    value={formData.emergencyContactMobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter mobile number"
                    maxLength="10"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-8 py-3 bg-[#4CAF50] text-white font-medium rounded-lg hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Admission Form'
                  )}
                </button>
                <p className="text-sm text-gray-600">
                  Please review all information before submitting
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdmissionForm;