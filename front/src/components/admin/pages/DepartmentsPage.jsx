import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards');

    const [departmentForm, setDepartmentForm] = useState({
        name: '',
        code: '',
        head: '',
        established: '',
        description: '',
        vision: '',
        mission: '',
        contactEmail: '',
        contactPhone: '',
        location: '',
        facultyCount: 0,
        studentCapacity: 0
    });

    // Mock data
    const mockDepartments = [
        {
            id: 1,
            name: 'Computer Science Engineering',
            code: 'CSE',
            head: 'Dr. Sarah Wilson',
            established: '2010',
            description: 'Premier department offering cutting-edge education in computer science and engineering',
            vision: 'To be a leading department in computer science education and research globally',
            mission: 'To provide quality education and conduct research in emerging areas of computer science',
            contactEmail: 'cse@college.edu',
            contactPhone: '+91-9876543210',
            location: 'Block A, 2nd Floor',
            facultyCount: 12,
            studentCapacity: 240,
            courses: [
                { id: 1, name: 'Data Structures & Algorithms', code: 'CS301', semester: 3 },
                { id: 2, name: 'Database Management Systems', code: 'CS401', semester: 4 },
                { id: 3, name: 'Machine Learning', code: 'CS501', semester: 5 },
                { id: 4, name: 'Software Engineering', code: 'CS402', semester: 4 }
            ],
            faculty: [
                { id: 1, name: 'Dr. Sarah Wilson', designation: 'Professor & HOD' },
                { id: 2, name: 'Prof. Michael Chen', designation: 'Associate Professor' },
                { id: 3, name: 'Dr. Emily Rodriguez', designation: 'Assistant Professor' },
                { id: 4, name: 'Dr. James Kumar', designation: 'Assistant Professor' }
            ],
            branches: ['CSE-A', 'CSE-B', 'CSE-C'],
            totalStudents: 180,
            labs: [
                'Programming Lab',
                'Database Lab', 
                'Machine Learning Lab',
                'Software Engineering Lab'
            ]
        },
        {
            id: 2,
            name: 'Electronics & Communication Engineering',
            code: 'ECE',
            head: 'Prof. Robert Kim',
            established: '2008',
            description: 'Excellence in electronics and communication engineering education and research',
            vision: 'To be a center of excellence in electronics and communication engineering',
            mission: 'To educate students in electronics and communication technologies',
            contactEmail: 'ece@college.edu',
            contactPhone: '+91-9876543211',
            location: 'Block B, 1st Floor',
            facultyCount: 10,
            studentCapacity: 200,
            courses: [
                { id: 5, name: 'Digital Electronics', code: 'ECE201', semester: 2 },
                { id: 6, name: 'Microprocessors', code: 'ECE301', semester: 3 },
                { id: 7, name: 'Communication Systems', code: 'ECE401', semester: 4 },
                { id: 8, name: 'VLSI Design', code: 'ECE501', semester: 5 }
            ],
            faculty: [
                { id: 6, name: 'Prof. Robert Kim', designation: 'Professor & HOD' },
                { id: 7, name: 'Dr. Lisa Chen', designation: 'Associate Professor' },
                { id: 8, name: 'Prof. David Lee', designation: 'Assistant Professor' }
            ],
            branches: ['ECE-A', 'ECE-B'],
            totalStudents: 120,
            labs: [
                'Electronics Lab',
                'Communication Lab',
                'Microprocessor Lab',
                'VLSI Lab'
            ]
        },
        {
            id: 3,
            name: 'Mechanical Engineering',
            code: 'ME',
            head: 'Dr. Jennifer Brown',
            established: '2005',
            description: 'Comprehensive mechanical engineering programs with industry focus',
            vision: 'To be a leading department in mechanical engineering innovation',
            mission: 'To provide excellent mechanical engineering education and research opportunities',
            contactEmail: 'me@college.edu',
            contactPhone: '+91-9876543212',
            location: 'Block C, Ground Floor',
            facultyCount: 15,
            studentCapacity: 300,
            courses: [
                { id: 9, name: 'Thermodynamics', code: 'ME201', semester: 2 },
                { id: 10, name: 'Fluid Mechanics', code: 'ME301', semester: 3 },
                { id: 11, name: 'Machine Design', code: 'ME401', semester: 4 },
                { id: 12, name: 'Heat Transfer', code: 'ME302', semester: 3 }
            ],
            faculty: [
                { id: 9, name: 'Dr. Jennifer Brown', designation: 'Professor & HOD' },
                { id: 10, name: 'Prof. Mark Wilson', designation: 'Associate Professor' },
                { id: 11, name: 'Dr. Anna Garcia', designation: 'Assistant Professor' }
            ],
            branches: ['ME-A', 'ME-B'],
            totalStudents: 180,
            labs: [
                'Manufacturing Lab',
                'Thermal Lab',
                'Fluid Mechanics Lab',
                'CAD/CAM Lab'
            ]
        },
        {
            id: 4,
            name: 'Mathematics',
            code: 'MATH',
            head: 'Prof. Lisa Anderson',
            established: '2003',
            description: 'Strong foundation in mathematical sciences supporting all engineering disciplines',
            vision: 'To excel in mathematical education and research',
            mission: 'To provide quality mathematical education across all engineering streams',
            contactEmail: 'math@college.edu',
            contactPhone: '+91-9876543213',
            location: 'Block D, 3rd Floor',
            facultyCount: 8,
            studentCapacity: 500,
            courses: [
                { id: 13, name: 'Engineering Mathematics I', code: 'MA101', semester: 1 },
                { id: 14, name: 'Engineering Mathematics II', code: 'MA201', semester: 2 },
                { id: 15, name: 'Engineering Mathematics III', code: 'MA301', semester: 3 },
                { id: 16, name: 'Probability & Statistics', code: 'MA401', semester: 4 }
            ],
            faculty: [
                { id: 5, name: 'Prof. Lisa Anderson', designation: 'Professor & HOD' },
                { id: 12, name: 'Dr. Thomas Smith', designation: 'Associate Professor' },
                { id: 13, name: 'Prof. Maria Lopez', designation: 'Assistant Professor' }
            ],
            branches: ['All Engineering Branches'],
            totalStudents: 450,
            labs: [
                'Mathematical Computing Lab'
            ]
        }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setDepartments(mockDepartments);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDepartmentSubmit = () => {
        if (selectedDepartment) {
            setDepartments(departments.map(dept =>
                dept.id === selectedDepartment.id
                    ? { ...dept, ...departmentForm, id: selectedDepartment.id }
                    : dept
            ));
        } else {
            const newDepartment = {
                ...departmentForm,
                id: Date.now(),
                courses: [],
                faculty: [],
                branches: [],
                totalStudents: 0,
                labs: []
            };
            setDepartments([...departments, newDepartment]);
        }
        setShowDepartmentModal(false);
        resetForm();
    };

    const resetForm = () => {
        setDepartmentForm({
            name: '',
            code: '',
            head: '',
            established: '',
            description: '',
            vision: '',
            mission: '',
            contactEmail: '',
            contactPhone: '',
            location: '',
            facultyCount: 0,
            studentCapacity: 0
        });
        setSelectedDepartment(null);
    };

    const handleEditDepartment = (department) => {
        setDepartmentForm(department);
        setSelectedDepartment(department);
        setShowDepartmentModal(true);
    };

    const handleDeleteDepartment = (deptId) => {
        setDepartments(departments.filter(dept => dept.id !== deptId));
    };

    const StatCard = ({ title, value, icon, color = 'indigo' }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.primaryCard} p-6 rounded-xl`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`${themeClasses.text.secondary} text-sm font-medium`}>{title}</p>
                    <p className={`${themeClasses.text.primary} text-2xl font-bold mt-1`}>{value}</p>
                </div>
                <div className={`h-12 w-12 bg-${color}-500/20 rounded-xl flex items-center justify-center`}>
                    <i className={`${icon} text-xl text-${color}-400`}></i>
                </div>
            </div>
        </motion.div>
    );

    const DepartmentCard = ({ department }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${themeClasses.primaryCard} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <i className={`ri-building-2-line text-xl ${iconClasses.primary}`}></i>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                {department.name}
                            </h3>
                            <p className={`text-sm ${iconClasses.primary} font-semibold`}>
                                {department.code}
                            </p>
                        </div>
                    </div>
                    <p className={`text-sm ${themeClasses.text.secondary} mb-2`}>
                        Head: {department.head}
                    </p>
                    <p className={`text-sm ${themeClasses.text.muted}`}>
                        Est. {department.established} • {department.location}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditDepartment(department)}
                        className={`p-2 rounded-lg ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}
                    >
                        <i className="ri-edit-line"></i>
                    </button>
                    <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                        <i className="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={`p-3 rounded-lg ${themeClasses.surface} text-center`}>
                    <div className={`text-lg font-bold ${themeClasses.text.primary}`}>
                        {department.facultyCount}
                    </div>
                    <div className={`text-xs ${themeClasses.text.secondary}`}>Faculty</div>
                </div>
                <div className={`p-3 rounded-lg ${themeClasses.surface} text-center`}>
                    <div className={`text-lg font-bold ${themeClasses.text.primary}`}>
                        {department.totalStudents}
                    </div>
                    <div className={`text-xs ${themeClasses.text.secondary}`}>Students</div>
                </div>
                <div className={`p-3 rounded-lg ${themeClasses.surface} text-center`}>
                    <div className={`text-lg font-bold ${themeClasses.text.primary}`}>
                        {department.courses?.length || 0}
                    </div>
                    <div className={`text-xs ${themeClasses.text.secondary}`}>Courses</div>
                </div>
                <div className={`p-3 rounded-lg ${themeClasses.surface} text-center`}>
                    <div className={`text-lg font-bold ${themeClasses.text.primary}`}>
                        {department.labs?.length || 0}
                    </div>
                    <div className={`text-xs ${themeClasses.text.secondary}`}>Labs</div>
                </div>
            </div>

            {/* Description */}
            <p className={`text-sm ${themeClasses.text.secondary} mb-6 line-clamp-2`}>
                {department.description}
            </p>

            {/* Branches */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${themeClasses.text.primary} mb-2`}>
                    Branches
                </h4>
                <div className="flex flex-wrap gap-2">
                    {department.branches?.map((branch, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-lg"
                        >
                            {branch}
                        </span>
                    ))}
                </div>
            </div>

            {/* Recent Courses */}
            <div className="mb-6">
                <h4 className={`text-sm font-semibold ${themeClasses.text.primary} mb-3`}>
                    Recent Courses
                </h4>
                <div className="space-y-2">
                    {department.courses?.slice(0, 3).map((course) => (
                        <div
                            key={course.id}
                            className={`p-2 rounded-lg ${themeClasses.surface} flex items-center justify-between`}
                        >
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                    {course.name}
                                </p>
                                <p className={`text-xs ${themeClasses.text.secondary}`}>
                                    {course.code} • Semester {course.semester}
                                </p>
                            </div>
                        </div>
                    ))}
                    {department.courses?.length > 3 && (
                        <p className={`text-xs ${themeClasses.text.muted} text-center`}>
                            +{department.courses.length - 3} more courses
                        </p>
                    )}
                </div>
            </div>

            {/* Contact Info */}
            <div className={`p-4 rounded-lg ${themeClasses.surface} border-l-4 border-indigo-500`}>
                <h4 className={`text-sm font-semibold ${themeClasses.text.primary} mb-2`}>
                    Contact Information
                </h4>
                <div className="space-y-1">
                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                        <i className="ri-mail-line mr-2"></i>
                        {department.contactEmail}
                    </p>
                    <p className={`text-xs ${themeClasses.text.secondary}`}>
                        <i className="ri-phone-line mr-2"></i>
                        {department.contactPhone}
                    </p>
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                    <p className={themeClasses.text.secondary}>Loading departments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                        Department Management
                    </h1>
                    <p className={`${themeClasses.text.secondary} mt-1`}>
                        Manage academic departments, faculty and programs
                    </p>
                </div>
                <button
                    onClick={() => setShowDepartmentModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                    <i className="ri-add-line"></i>
                    Add Department
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Departments"
                    value={departments.length}
                    icon="ri-building-2-line"
                    color="indigo"
                />
                <StatCard
                    title="Total Faculty"
                    value={departments.reduce((acc, dept) => acc + dept.facultyCount, 0)}
                    icon="ri-team-line"
                    color="green"
                />
                <StatCard
                    title="Total Students"
                    value={departments.reduce((acc, dept) => acc + dept.totalStudents, 0)}
                    icon="ri-user-line"
                    color="blue"
                />
                <StatCard
                    title="Total Courses"
                    value={departments.reduce((acc, dept) => acc + (dept.courses?.length || 0), 0)}
                    icon="ri-book-line"
                    color="yellow"
                />
            </div>

            {/* Filters */}
            <div className={`${themeClasses.primaryCard} p-6 rounded-xl`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>
                            Search Departments
                        </label>
                        <div className="relative">
                            <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses.primary}`}></i>
                            <input
                                type="text"
                                placeholder="Search by name, code, or head..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>
                            View Mode
                        </label>
                        <div className="flex bg-gray-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'cards'
                                        ? 'bg-indigo-600 text-white'
                                        : `${themeClasses.text.secondary} hover:bg-gray-600`
                                }`}
                            >
                                <i className="ri-grid-line"></i>
                                Cards
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-indigo-600 text-white'
                                        : `${themeClasses.text.secondary} hover:bg-gray-600`
                                }`}
                            >
                                <i className="ri-list-unordered"></i>
                                Table
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Departments Display */}
            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredDepartments.map((department) => (
                            <DepartmentCard key={department.id} department={department} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                /* Table View */
                <div className={`${themeClasses.primaryCard} rounded-xl overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`${themeClasses.surface}`}>
                                <tr>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Department
                                    </th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Head
                                    </th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Faculty
                                    </th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Students
                                    </th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Courses
                                    </th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Contact
                                    </th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepartments.map((department) => (
                                    <tr
                                        key={department.id}
                                        className={`border-t ${themeClasses.border} hover:bg-gray-700/30 transition-colors`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                                    <i className={`ri-building-2-line ${iconClasses.primary}`}></i>
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${themeClasses.text.primary}`}>
                                                        {department.name}
                                                    </p>
                                                    <p className={`text-sm ${iconClasses.primary}`}>
                                                        {department.code}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.secondary}`}>
                                            {department.head}
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.primary}`}>
                                            {department.facultyCount}
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.primary}`}>
                                            {department.totalStudents}
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.primary}`}>
                                            {department.courses?.length || 0}
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.secondary} text-sm`}>
                                            <div>
                                                <p>{department.contactEmail}</p>
                                                <p>{department.contactPhone}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditDepartment(department)}
                                                    className={`p-2 rounded-lg ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDepartment(department.id)}
                                                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredDepartments.length === 0 && (
                <div className={`${themeClasses.primaryCard} rounded-xl p-12 text-center`}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/20 mb-4">
                        <i className={`ri-building-2-line text-2xl ${themeClasses.text.muted}`}></i>
                    </div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                        No departments found
                    </h3>
                    <p className={`${themeClasses.text.secondary} mb-6`}>
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first department.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowDepartmentModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors mx-auto"
                        >
                            <i className="ri-add-line"></i>
                            Add First Department
                        </button>
                    )}
                </div>
            )}

            {/* Department Modal */}
            <AnimatePresence>
                {showDepartmentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
                        onClick={() => setShowDepartmentModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${themeClasses.primaryCard} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
                        >
                            {/* Modal Header */}
                            <div className={`p-6 border-b ${themeClasses.border}`}>
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                        {selectedDepartment ? 'Edit Department' : 'Add New Department'}
                                    </h2>
                                    <button
                                        onClick={() => setShowDepartmentModal(false)}
                                        className={`p-2 rounded-xl ${themeClasses.text.secondary} hover:bg-gray-700/50 transition-colors`}
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                                            Basic Information
                                        </h3>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Department Name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter department name"
                                                value={departmentForm.name}
                                                onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Department Code *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., CSE, ECE, ME"
                                                value={departmentForm.code}
                                                onChange={(e) => setDepartmentForm({...departmentForm, code: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Head of Department *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter HOD name"
                                                value={departmentForm.head}
                                                onChange={(e) => setDepartmentForm({...departmentForm, head: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Established Year *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g., 2010"
                                                value={departmentForm.established}
                                                onChange={(e) => setDepartmentForm({...departmentForm, established: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Block A, 2nd Floor"
                                                value={departmentForm.location}
                                                onChange={(e) => setDepartmentForm({...departmentForm, location: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>
                                    </div>

                                    {/* Contact & Capacity */}
                                    <div className="space-y-4">
                                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
                                            Contact & Capacity
                                        </h3>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Contact Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="department@college.edu"
                                                value={departmentForm.contactEmail}
                                                onChange={(e) => setDepartmentForm({...departmentForm, contactEmail: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Contact Phone
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="+91-9876543210"
                                                value={departmentForm.contactPhone}
                                                onChange={(e) => setDepartmentForm({...departmentForm, contactPhone: e.target.value})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Faculty Count
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Number of faculty"
                                                value={departmentForm.facultyCount}
                                                onChange={(e) => setDepartmentForm({...departmentForm, facultyCount: parseInt(e.target.value) || 0})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className={`${themeClasses.text.primary} font-medium block`}>
                                                Student Capacity
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Maximum student capacity"
                                                value={departmentForm.studentCapacity}
                                                onChange={(e) => setDepartmentForm({...departmentForm, studentCapacity: parseInt(e.target.value) || 0})}
                                                className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description & Vision */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Department description"
                                            value={departmentForm.description}
                                            onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors h-24 resize-none`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Vision
                                        </label>
                                        <textarea
                                            placeholder="Department vision"
                                            value={departmentForm.vision}
                                            onChange={(e) => setDepartmentForm({...departmentForm, vision: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors h-24 resize-none`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`${themeClasses.text.primary} font-medium block`}>
                                            Mission
                                        </label>
                                        <textarea
                                            placeholder="Department mission"
                                            value={departmentForm.mission}
                                            onChange={(e) => setDepartmentForm({...departmentForm, mission: e.target.value})}
                                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors h-24 resize-none`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className={`p-6 border-t ${themeClasses.border}`}>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => setShowDepartmentModal(false)}
                                        className={`px-6 py-3 border ${themeClasses.border} rounded-xl ${themeClasses.text.secondary} font-medium hover:bg-gray-700 transition-colors`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDepartmentSubmit}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        {selectedDepartment ? 'Update Department' : 'Add Department'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentsPage;