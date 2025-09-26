import React, { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// FormSection Component - moved outside to prevent recreation
const FormSection = memo(({ icon, title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 rounded-xl p-6 backdrop-blur-sm border border-gray-100 shadow-sm"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                <i className={`${icon} text-xl text-[#3B82F6]`}></i>
            </div>
            <h3 className="text-xl font-bold text-[#333333]">{title}</h3>
        </div>
        {children}
    </motion.div>
));

FormSection.displayName = 'FormSection';

// FormField Component - moved outside to prevent recreation
const FormField = memo(({ 
    label, 
    type = "text", 
    name, 
    placeholder, 
    required = false, 
    options = null, 
    className,
    teacherForm,
    handleInputChange,
    formErrors,
    selectClasses,
    ...props 
}) => (
    <div className="space-y-2">
        <label className="text-[#333333] font-medium block">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {options ? (
            <select
                name={name}
                value={teacherForm[name] || ''}
                onChange={handleInputChange}
                className={selectClasses}
                required={required}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        ) : type === 'textarea' ? (
            <textarea
                name={name}
                placeholder={placeholder}
                value={teacherForm[name] || ''}
                onChange={handleInputChange}
                className={className + ' h-24 resize-none'}
                required={required}
                {...props}
            />
        ) : (
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={teacherForm[name] || ''}
                onChange={handleInputChange}
                className={className}
                required={required}
                {...props}
            />
        )}
        {formErrors[name] && (
            <p className="text-red-500 text-sm">{formErrors[name]}</p>
        )}
    </div>
));

FormField.displayName = 'FormField';

// DocumentUpload Component - moved outside to prevent recreation
const DocumentUpload = memo(({ label, fieldName, file, preview, onChange, required = false, accept = "image/*" }) => (
    <div className="space-y-2">
        <label className="text-[#333333] font-medium block">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                    ${file ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-gray-300 bg-[#F8F9F4]'} 
                    hover:bg-[#F1F3F1] transition-colors duration-300`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {!file ? (
                            <>
                                <svg className="w-8 h-8 mb-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="mb-2 text-sm text-[#6C757D]">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-[#6C757D]">JPG, PNG (Max 5MB)</p>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-[#3B82F6]">
                                <i className="ri-check-line text-xl"></i>
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept={accept}
                        onChange={onChange}
                        required={required}
                    />
                </label>
            </div>

            {/* File Preview */}
            {file && preview && (
                <div className="relative bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[#333333]">{file.name}</p>
                            <p className="text-xs text-[#6C757D]">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
));

DocumentUpload.displayName = 'DocumentUpload';

const TeacherForm = ({ 
    teacherForm, 
    setTeacherForm, 
    onSubmit, 
    onCancel, 
    loading, 
    editingTeacher,
    error 
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [resume, setResume] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const inputClasses = `
        w-full p-3 rounded-xl 
        bg-[#F8F9F4] border-2 border-transparent
        focus:border-[#3B82F6]
        focus:ring-4 focus:ring-[#3B82F6]/10 
        focus:bg-white
        hover:border-[#3B82F6]/30
        transition-all duration-300 ease-in-out
        text-[#333333] placeholder-[#6C757D]/60
        focus:placeholder-[#3B82F6]/50
        focus:shadow-lg focus:shadow-[#3B82F6]/5
        outline-none
    `;

    const selectClasses = inputClasses + ` appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(
        `<svg width="20" height="20" fill="none" stroke="%233B82F6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`
    )}')] bg-[length:20px_20px] bg-no-repeat bg-[center_right_1rem] pr-12`;

    const steps = [
        { number: 1, title: "Basic Information", icon: "ri-user-line" },
        { number: 2, title: "Professional Details", icon: "ri-briefcase-line" },
        { number: 3, title: "Academic & Documents", icon: "ri-graduation-cap-line" }
    ];

    const departments = [
        'Computer Science Engineering',
        'Information Technology',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electronics & Communication',
        'Chemical Engineering',
        'Mathematics',
        'Physics',
        'Chemistry',
        'English',
        'Management Studies'
    ];

    const designations = [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer',
        'Senior Lecturer',
        'Principal',
        'Vice Principal',
        'Head of Department',
        'Dean'
    ];

    const qualifications = [
        'Ph.D',
        'M.Tech',
        'M.Sc',
        'M.A',
        'MBA',
        'B.Tech',
        'B.Sc',
        'B.A',
        'Other'
    ];

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setTeacherForm(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        setFormErrors(prev => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
    }, [setTeacherForm]);

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            if (fileType === 'photo') {
                setProfilePhoto(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (fileType === 'resume') {
                setResume(file);
            }
        }
    };

    const validateAllSteps = () => {
        const errors = {};
        
        // Step 1 validation
        if (!teacherForm.teacherId) errors.teacherId = 'Teacher ID is required';
        if (!teacherForm.name) errors.name = 'Full name is required';
        if (!teacherForm.email) errors.email = 'Email is required';
        if (!teacherForm.phone) errors.phone = 'Phone number is required';
        if (!teacherForm.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!teacherForm.gender) errors.gender = 'Gender is required';
        if (!teacherForm.address) errors.address = 'Address is required';
        
        // Step 2 validation
        if (!teacherForm.designation) errors.designation = 'Designation is required';
        if (!teacherForm.department) errors.department = 'Department is required';
        if (!teacherForm.joiningDate) errors.joiningDate = 'Joining date is required';
        if (!teacherForm.employeeType) errors.employeeType = 'Employee type is required';
        if (!teacherForm.qualification) errors.qualification = 'Qualification is required';
        if (!teacherForm.specialization) errors.specialization = 'Specialization is required';
        
        // Password validation (only for new teachers)
        if (!editingTeacher && !teacherForm.password) {
            errors.password = 'Password is required for new teachers';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep = (step) => {
        const errors = {};
        
        if (step === 1) {
            if (!teacherForm.teacherId) errors.teacherId = 'Teacher ID is required';
            if (!teacherForm.name) errors.name = 'Full name is required';
            if (!teacherForm.email) errors.email = 'Email is required';
            if (!teacherForm.phone) errors.phone = 'Phone number is required';
            if (!teacherForm.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
            if (!teacherForm.gender) errors.gender = 'Gender is required';
            if (!teacherForm.address) errors.address = 'Address is required';
        } else if (step === 2) {
            if (!teacherForm.designation) errors.designation = 'Designation is required';
            if (!teacherForm.department) errors.department = 'Department is required';
            if (!teacherForm.joiningDate) errors.joiningDate = 'Joining date is required';
            if (!teacherForm.employeeType) errors.employeeType = 'Employee type is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // For final submission, validate all required fields
        if (currentStep === 3 || editingTeacher) {
            // On final step or when editing, validate everything
            console.log('🔍 TeacherForm handleSubmit - Current teacherForm state:', teacherForm);
            console.log('🔍 TeacherForm handleSubmit - Individual field check:');
            console.log('  teacherId:', teacherForm.teacherId);
            console.log('  name:', teacherForm.name);
            console.log('  email:', teacherForm.email);
            console.log('  employeeType:', teacherForm.employeeType);
            console.log('  qualification:', teacherForm.qualification);
            console.log('  specialization:', teacherForm.specialization);
            console.log('  password:', teacherForm.password ? '[PROVIDED]' : '[MISSING]');
            
            if (validateAllSteps()) {
                console.log('✅ TeacherForm validation passed, calling parent onSubmit');
                onSubmit(e);
            } else {
                console.warn('❌ Form validation failed. Please fill in all required fields.');
                console.warn('Missing fields:', Object.keys(formErrors));
                
                // If there are errors in earlier steps, go back to first step with errors
                const errorKeys = Object.keys(formErrors);
                if (errorKeys.some(key => ['teacherId', 'name', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'password'].includes(key))) {
                    setCurrentStep(1);
                } else if (errorKeys.some(key => ['designation', 'department', 'joiningDate', 'employeeType', 'qualification', 'specialization'].includes(key))) {
                    setCurrentStep(2);
                }
            }
        } else {
            // For steps 1 and 2, just validate current step and move forward
            if (validateStep(currentStep)) {
                if (currentStep < 3) {
                    setCurrentStep(prev => prev + 1);
                }
            }
        }
    };

    // Helper function to create FormField with all required props
    const createFormField = useCallback((props) => (
        <FormField
            {...props}
            teacherForm={teacherForm}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            selectClasses={selectClasses}
            className={props.className || inputClasses}
        />
    ), [teacherForm, handleInputChange, formErrors, selectClasses, inputClasses]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={onCancel}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-[#3B82F6]/20 to-[#2563EB]/20">
                    <div className="absolute inset-0 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-1">
                                    {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                                </h2>
                                <p className="text-[#6C757D] text-sm">
                                    Please fill in all the required information carefully
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <i className="ri-close-line text-2xl text-[#333333]"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="px-8 py-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                        {steps.map((step) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex items-center gap-3 ${
                                    step.number === currentStep 
                                        ? 'text-[#3B82F6]' 
                                        : step.number < currentStep 
                                        ? 'text-[#3B82F6]' 
                                        : 'text-gray-400'
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                        step.number === currentStep 
                                            ? 'bg-[#3B82F6] text-white' 
                                            : step.number < currentStep 
                                            ? 'bg-[#3B82F6] text-white' 
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {step.number < currentStep ? (
                                            <i className="ri-check-line"></i>
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    <span className="font-medium text-sm hidden md:block">{step.title}</span>
                                </div>
                                {step.number < steps.length && (
                                    <div className={`w-8 h-0.5 mx-4 ${
                                        step.number < currentStep ? 'bg-[#3B82F6]' : 'bg-gray-200'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
                        >
                            <div className="flex items-center gap-2">
                                <i className="ri-error-warning-line"></i>
                                {error}
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <FormSection icon="ri-user-line" title="Basic Information">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {createFormField({
                                                label: "Teacher ID",
                                                name: "teacherId",
                                                placeholder: "e.g., TCH001",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Full Name",
                                                name: "name",
                                                placeholder: "Enter full name",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Email",
                                                type: "email",
                                                name: "email",
                                                placeholder: "teacher@college.edu",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Phone Number",
                                                type: "tel",
                                                name: "phone",
                                                placeholder: "Enter phone number",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Date of Birth",
                                                type: "date",
                                                name: "dateOfBirth",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Gender",
                                                name: "gender",
                                                placeholder: "Select Gender",
                                                options: ['Male', 'Female', 'Other'],
                                                required: true
                                            })}
                                            <div className="md:col-span-2">
                                                {createFormField({
                                                    label: "Address",
                                                    type: "textarea",
                                                    name: "address",
                                                    placeholder: "Enter complete address",
                                                    required: true
                                                })}
                                            </div>
                                        </div>
                                    </FormSection>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <FormSection icon="ri-briefcase-line" title="Professional Details">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {createFormField({
                                                label: "Designation",
                                                name: "designation",
                                                placeholder: "Select Designation",
                                                options: designations,
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Department",
                                                name: "department",
                                                placeholder: "Select Department",
                                                options: departments,
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Joining Date",
                                                type: "date",
                                                name: "joiningDate",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Employee Type",
                                                name: "employeeType",
                                                placeholder: "Select Employee Type",
                                                options: ['Permanent', 'Contract', 'Part-time', 'Visiting'],
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Qualification",
                                                name: "qualification",
                                                placeholder: "Select Qualification",
                                                options: qualifications,
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Specialization",
                                                name: "specialization",
                                                placeholder: "Enter specialization area",
                                                required: true
                                            })}
                                            {createFormField({
                                                label: "Experience (Years)",
                                                type: "number",
                                                name: "experience",
                                                placeholder: "Years of experience",
                                                min: "0",
                                                max: "50"
                                            })}
                                            {createFormField({
                                                label: "Salary",
                                                type: "number",
                                                name: "salary",
                                                placeholder: "Monthly salary"
                                            })}
                                            <div className="md:col-span-2">
                                                {createFormField({
                                                    label: "Subjects (comma-separated)",
                                                    name: "subjects",
                                                    placeholder: "e.g., Mathematics, Physics, Chemistry"
                                                })}
                                            </div>
                                        </div>
                                    </FormSection>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <FormSection icon="ri-graduation-cap-line" title="Academic Details">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {createFormField({
                                                label: "Highest Qualification",
                                                name: "qualification",
                                                placeholder: "Select Qualification",
                                                options: qualifications
                                            })}
                                            {createFormField({
                                                label: "Specialization",
                                                name: "specialization",
                                                placeholder: "e.g., Computer Networks, Data Structures"
                                            })}
                                            <div className="md:col-span-2">
                                                {createFormField({
                                                    label: "Research Interests",
                                                    type: "textarea",
                                                    name: "researchInterests",
                                                    placeholder: "Describe research interests and areas"
                                                })}
                                            </div>
                                            <div className="md:col-span-2">
                                                {createFormField({
                                                    label: "Publications",
                                                    type: "textarea",
                                                    name: "publications",
                                                    placeholder: "List publications, papers, books"
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <DocumentUpload
                                                label="Profile Photo"
                                                fieldName="photo"
                                                file={profilePhoto}
                                                preview={profilePreview}
                                                onChange={(e) => handleFileChange(e, 'photo')}
                                                accept="image/*"
                                            />
                                            <DocumentUpload
                                                label="Resume/CV"
                                                fieldName="resume"
                                                file={resume}
                                                onChange={(e) => handleFileChange(e, 'resume')}
                                                accept=".pdf,.doc,.docx"
                                            />
                                        </div>

                                        {!editingTeacher && (
                                            <div className="mt-6">
                                                {createFormField({
                                                    label: "Password",
                                                    type: "password",
                                                    name: "password",
                                                    placeholder: "Enter password",
                                                    required: !editingTeacher
                                                })}
                                            </div>
                                        )}
                                        
                                        {/* Validation Summary for Step 3 */}
                                        {currentStep === 3 && (
                                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">📋 Form Completion Status:</h4>
                                                <div className="space-y-1 text-xs">
                                                    <div className={`flex items-center gap-2 ${teacherForm.teacherId && teacherForm.name && teacherForm.email ? 'text-green-600' : 'text-red-600'}`}>
                                                        <i className={`${teacherForm.teacherId && teacherForm.name && teacherForm.email ? 'ri-check-line' : 'ri-close-line'}`}></i>
                                                        Step 1: Basic Information {teacherForm.teacherId && teacherForm.name && teacherForm.email ? '✓' : '(Incomplete)'}
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${teacherForm.designation && teacherForm.department && teacherForm.qualification && teacherForm.specialization ? 'text-green-600' : 'text-red-600'}`}>
                                                        <i className={`${teacherForm.designation && teacherForm.department && teacherForm.qualification && teacherForm.specialization ? 'ri-check-line' : 'ri-close-line'}`}></i>
                                                        Step 2: Professional Details {teacherForm.designation && teacherForm.department && teacherForm.qualification && teacherForm.specialization ? '✓' : '(Incomplete)'}
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${(!editingTeacher ? teacherForm.password : true) ? 'text-green-600' : 'text-red-600'}`}>
                                                        <i className={`${(!editingTeacher ? teacherForm.password : true) ? 'ri-check-line' : 'ri-close-line'}`}></i>
                                                        Password {(!editingTeacher ? teacherForm.password : true) ? '✓' : '(Required)'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </FormSection>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={currentStep === 1 ? onCancel : prevStep}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                <i className="ri-arrow-left-line"></i>
                                {currentStep === 1 ? 'Cancel' : 'Previous'}
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-xl font-medium hover:bg-[#2563EB] transition-colors"
                                >
                                    Next
                                    <i className="ri-arrow-right-line"></i>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-xl font-medium hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin"></i>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-save-line"></i>
                                            {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default memo(TeacherForm);