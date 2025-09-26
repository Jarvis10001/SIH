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
    clerkForm,
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
                value={clerkForm[name] || ''}
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
                value={clerkForm[name] || ''}
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
                value={clerkForm[name] || ''}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="mb-2 text-sm text-[#666666]">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-[#999999]">PNG, JPG or PDF</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-8 h-8 mb-4 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-[#3B82F6] font-medium">{file.name}</p>
                                <p className="text-xs text-[#666666]">Click to change file</p>
                            </>
                        )}
                    </div>
                    <input type="file" className="hidden" onChange={onChange} accept={accept} />
                </label>
            </div>
            {preview && (
                <div className="flex items-center justify-center">
                    <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border" />
                </div>
            )}
        </div>
    </div>
));

DocumentUpload.displayName = 'DocumentUpload';

const ClerkForm = ({ 
    clerkForm, 
    setClerkForm, 
    onSubmit, 
    onCancel, 
    loading, 
    editingClerk,
    error 
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const inputClasses = `
        w-full p-4 rounded-xl 
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
        { number: 1, title: "Personal Information", icon: "ri-user-line" },
        { number: 2, title: "Professional Details", icon: "ri-briefcase-line" },
        { number: 3, title: "System Access & Account", icon: "ri-settings-line" }
    ];

    const departments = [
        'Administration',
        'Admissions',
        'Accounts',
        'Library',
        'Student Affairs',
        'Examination',
        'HR',
        'IT Support',
        'Maintenance'
    ];

    const designations = [
        'Office Clerk',
        'Administrative Assistant',
        'Data Entry Clerk',
        'Admission Clerk',
        'Accounts Clerk',
        'Library Assistant',
        'Reception Clerk',
        'Senior Clerk',
        'Office Supervisor'
    ];

    const systemModules = [
        { id: 'student_management', label: 'Student Management' },
        { id: 'admission_processing', label: 'Admission Processing' },
        { id: 'fee_collection', label: 'Fee Collection' },
        { id: 'library_management', label: 'Library Management' },
        { id: 'examination_records', label: 'Examination Records' },
        { id: 'attendance_tracking', label: 'Attendance Tracking' },
        { id: 'document_verification', label: 'Document Verification' },
        { id: 'report_generation', label: 'Report Generation' }
    ];

    const workShifts = ['Morning', 'Evening', 'Night', 'Rotating'];

    const handleStepClick = (stepNumber) => {
        if (stepNumber <= currentStep || validateCurrentStep()) {
            setCurrentStep(stepNumber);
        }
    };

    const validateCurrentStep = () => {
        const errors = {};
        const { personalInfo, professionalInfo, systemAccess } = clerkForm;

        if (currentStep === 1) {
            if (!personalInfo.fullName?.trim()) errors.fullName = 'Full name is required';
            if (!personalInfo.email?.trim()) errors.email = 'Email is required';
            if (!personalInfo.phone?.trim()) errors.phone = 'Phone number is required';
            if (!clerkForm.employeeId?.trim()) errors.employeeId = 'Employee ID is required';
        }

        if (currentStep === 2) {
            if (!professionalInfo.designation) errors.designation = 'Designation is required';
            if (!professionalInfo.department) errors.department = 'Department is required';
            if (!professionalInfo.joiningDate) errors.joiningDate = 'Joining date is required';
        }

        if (currentStep === 3) {
            if (!clerkForm.password?.trim() && !editingClerk) errors.password = 'Password is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateCurrentStep() && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (section, field, value) => {
        setClerkForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        
        // Clear specific error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleDirectChange = (field, value) => {
        setClerkForm(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleModuleToggle = (moduleId) => {
        const currentModules = clerkForm.systemAccess?.modules || [];
        const updatedModules = currentModules.includes(moduleId)
            ? currentModules.filter(id => id !== moduleId)
            : [...currentModules, moduleId];
        
        handleInputChange('systemAccess', 'modules', updatedModules);
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onload = (e) => setProfilePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            onSubmit(clerkForm, profilePhoto);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <FormSection icon="ri-user-line" title="Basic Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Employee ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`${inputClasses} ${formErrors.employeeId ? 'border-red-300' : ''}`}
                                        placeholder="Enter employee ID (e.g., CLK001)"
                                        value={clerkForm.employeeId || ''}
                                        onChange={(e) => handleDirectChange('employeeId', e.target.value)}
                                    />
                                    {formErrors.employeeId && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.employeeId}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`${inputClasses} ${formErrors.fullName ? 'border-red-300' : ''}`}
                                        placeholder="Enter full name"
                                        value={clerkForm.personalInfo?.fullName || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                    />
                                    {formErrors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`${inputClasses} ${formErrors.email ? 'border-red-300' : ''}`}
                                        placeholder="Enter email address"
                                        value={clerkForm.personalInfo?.email || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className={`${inputClasses} ${formErrors.phone ? 'border-red-300' : ''}`}
                                        placeholder="Enter phone number"
                                        value={clerkForm.personalInfo?.phone || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                    />
                                    {formErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Gender</label>
                                    <select
                                        className={selectClasses}
                                        value={clerkForm.personalInfo?.gender || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Date of Birth</label>
                                    <input
                                        type="date"
                                        className={inputClasses}
                                        value={clerkForm.personalInfo?.dateOfBirth || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                                    />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection icon="ri-map-pin-line" title="Address Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[#333333] font-medium block">Street Address</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter street address"
                                        value={clerkForm.personalInfo?.address?.street || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'address', { 
                                            ...clerkForm.personalInfo?.address, 
                                            street: e.target.value 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">City</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter city"
                                        value={clerkForm.personalInfo?.address?.city || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'address', { 
                                            ...clerkForm.personalInfo?.address, 
                                            city: e.target.value 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">State</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter state"
                                        value={clerkForm.personalInfo?.address?.state || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'address', { 
                                            ...clerkForm.personalInfo?.address, 
                                            state: e.target.value 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Pincode</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter pincode"
                                        value={clerkForm.personalInfo?.address?.pincode || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'address', { 
                                            ...clerkForm.personalInfo?.address, 
                                            pincode: e.target.value 
                                        })}
                                    />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection icon="ri-phone-line" title="Emergency Contact">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Contact Name</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter contact name"
                                        value={clerkForm.personalInfo?.emergencyContact?.name || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', { 
                                            ...clerkForm.personalInfo?.emergencyContact, 
                                            name: e.target.value 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Relationship</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g., Father, Mother, Spouse"
                                        value={clerkForm.personalInfo?.emergencyContact?.relationship || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', { 
                                            ...clerkForm.personalInfo?.emergencyContact, 
                                            relationship: e.target.value 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Contact Phone</label>
                                    <input
                                        type="tel"
                                        className={inputClasses}
                                        placeholder="Enter contact phone"
                                        value={clerkForm.personalInfo?.emergencyContact?.phone || ''}
                                        onChange={(e) => handleInputChange('personalInfo', 'emergencyContact', { 
                                            ...clerkForm.personalInfo?.emergencyContact, 
                                            phone: e.target.value 
                                        })}
                                    />
                                </div>
                            </div>
                        </FormSection>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <FormSection icon="ri-briefcase-line" title="Professional Details">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Designation <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className={`${selectClasses} ${formErrors.designation ? 'border-red-300' : ''}`}
                                        value={clerkForm.professionalInfo?.designation || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'designation', e.target.value)}
                                    >
                                        <option value="">Select Designation</option>
                                        {designations.map(designation => (
                                            <option key={designation} value={designation}>{designation}</option>
                                        ))}
                                    </select>
                                    {formErrors.designation && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.designation}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        className={`${selectClasses} ${formErrors.department ? 'border-red-300' : ''}`}
                                        value={clerkForm.professionalInfo?.department || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'department', e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {formErrors.department && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.department}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">
                                        Joining Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className={`${inputClasses} ${formErrors.joiningDate ? 'border-red-300' : ''}`}
                                        value={clerkForm.professionalInfo?.joiningDate || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'joiningDate', e.target.value)}
                                    />
                                    {formErrors.joiningDate && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.joiningDate}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Experience (Years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className={inputClasses}
                                        placeholder="Enter years of experience"
                                        value={clerkForm.professionalInfo?.experience || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'experience', parseInt(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Work Shift</label>
                                    <select
                                        className={selectClasses}
                                        value={clerkForm.professionalInfo?.workShift || 'Morning'}
                                        onChange={(e) => handleInputChange('professionalInfo', 'workShift', e.target.value)}
                                    >
                                        {workShifts.map(shift => (
                                            <option key={shift} value={shift}>{shift}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Reporting To (Employee ID)</label>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="Enter supervisor's employee ID"
                                        value={clerkForm.professionalInfo?.reportingTo || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'reportingTo', e.target.value)}
                                    />
                                </div>
                            </div>
                        </FormSection>

                        <FormSection icon="ri-money-dollar-circle-line" title="Salary Information">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Basic Salary</label>
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="Enter basic salary"
                                        value={clerkForm.professionalInfo?.salary?.basic || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'salary', { 
                                            ...clerkForm.professionalInfo?.salary, 
                                            basic: parseFloat(e.target.value) || 0 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Allowances</label>
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="Enter allowances"
                                        value={clerkForm.professionalInfo?.salary?.allowances || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'salary', { 
                                            ...clerkForm.professionalInfo?.salary, 
                                            allowances: parseFloat(e.target.value) || 0 
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Total Salary</label>
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="Enter total salary"
                                        value={clerkForm.professionalInfo?.salary?.total || ''}
                                        onChange={(e) => handleInputChange('professionalInfo', 'salary', { 
                                            ...clerkForm.professionalInfo?.salary, 
                                            total: parseFloat(e.target.value) || 0 
                                        })}
                                    />
                                </div>
                            </div>
                        </FormSection>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <FormSection icon="ri-settings-line" title="System Access">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">System Modules Access</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {systemModules.map(module => (
                                            <label key={module.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-[#3B82F6] border-gray-300 rounded focus:ring-[#3B82F6]"
                                                    checked={clerkForm.systemAccess?.modules?.includes(module.id) || false}
                                                    onChange={() => handleModuleToggle(module.id)}
                                                />
                                                <span className="text-sm text-gray-700">{module.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#333333] font-medium block">Access Level</label>
                                    <select
                                        className={selectClasses}
                                        value={clerkForm.systemAccess?.accessLevel || 'read'}
                                        onChange={(e) => handleInputChange('systemAccess', 'accessLevel', e.target.value)}
                                    >
                                        <option value="read">Read Only</option>
                                        <option value="write">Read & Write</option>
                                        <option value="admin">Administrative</option>
                                    </select>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection icon="ri-lock-line" title="Account Credentials">
                            <div className="space-y-4">
                                {!editingClerk && (
                                    <div className="space-y-2">
                                        <label className="text-[#333333] font-medium block">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`${inputClasses} ${formErrors.password ? 'border-red-300' : ''}`}
                                            placeholder="Enter password"
                                            value={clerkForm.password || ''}
                                            onChange={(e) => handleDirectChange('password', e.target.value)}
                                        />
                                        {formErrors.password && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        className="w-4 h-4 text-[#3B82F6] border-gray-300 rounded focus:ring-[#3B82F6]"
                                        checked={clerkForm.isActive !== false}
                                        onChange={(e) => handleDirectChange('isActive', e.target.checked)}
                                    />
                                    <label htmlFor="isActive" className="text-sm text-gray-700">
                                        Account is active
                                    </label>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection icon="ri-image-line" title="Profile Photo">
                            <DocumentUpload
                                label="Profile Photo"
                                fieldName="profilePhoto"
                                file={profilePhoto}
                                preview={profilePreview}
                                onChange={handleProfilePhotoChange}
                                accept="image/*"
                            />
                        </FormSection>
                    </motion.div>
                );

            default:
                return null;
        }
    };

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
                                    {editingClerk ? 'Edit Clerk' : 'Add New Clerk'}
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
                            {renderStepContent()}
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
                                            {editingClerk ? 'Update Clerk' : 'Add Clerk'}
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

export default ClerkForm;