import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { themeClasses, iconClasses } from '../../../styles/theme';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBranch, setFilterBranch] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentDetails, setShowStudentDetails] = useState(false);

    // Mock data for development - replace with actual API call
    const mockStudents = [
        {
            _id: '1',
            studentId: 'STU2024001',
            name: { firstName: 'Tanishq', lastName: 'Sharma', middleName: '' },
            email: 'sharmatanishq456@gmail.com',
            branch: 'Computer Science Engineering',
            year: 2,
            semester: 4,
            contact: { phone: { primary: '+91-9876543210' } },
            personalInfo: { gender: 'Male', dateOfBirth: '2003-05-15' },
            admissionInfo: { admissionDate: '2020-02-02' },
            status: 'Active',
            profile: { profilePhoto: null }
        },
        {
            _id: '2',
            studentId: 'STU2024002',
            name: { firstName: 'Priya', lastName: 'Sharma', middleName: '' },
            email: 'priya.sharma@college.edu',
            branch: 'Information Technology',
            year: 3,
            semester: 6,
            contact: { phone: { primary: '+91-9876543211' } },
            personalInfo: { gender: 'Female', dateOfBirth: '2002-03-22' },
            admissionInfo: { admissionDate: '2021-08-15' },
            status: 'Active',
            profile: { profilePhoto: null }
        },
        {
            _id: '3',
            studentId: 'STU2024003',
            name: { firstName: 'Amit', lastName: 'Patel', middleName: '' },
            email: 'amit.patel@college.edu',
            branch: 'Mechanical Engineering',
            year: 1,
            semester: 2,
            contact: { phone: { primary: '+91-9876543212' } },
            personalInfo: { gender: 'Male', dateOfBirth: '2004-01-10' },
            admissionInfo: { admissionDate: '2024-08-15' },
            status: 'Active',
            profile: { profilePhoto: null }
        },
        {
            _id: '4',
            studentId: 'STU2024004',
            name: { firstName: 'Sneha', lastName: 'Singh', middleName: '' },
            email: 'sneha.singh@college.edu',
            branch: 'Electronics and Communication Engineering',
            year: 4,
            semester: 8,
            contact: { phone: { primary: '+91-9876543213' } },
            personalInfo: { gender: 'Female', dateOfBirth: '2001-12-08' },
            admissionInfo: { admissionDate: '2020-08-15' },
            status: 'Active',
            profile: { profilePhoto: null }
        },
        {
            _id: '5',
            studentId: 'STU2024005',
            name: { firstName: 'Vikram', lastName: 'Reddy', middleName: '' },
            email: 'vikram.reddy@college.edu',
            branch: 'Computer Science Engineering',
            year: 3,
            semester: 5,
            contact: { phone: { primary: '+91-9876543214' } },
            personalInfo: { gender: 'Male', dateOfBirth: '2002-09-18' },
            admissionInfo: { admissionDate: '2021-08-15' },
            status: 'Inactive',
            profile: { profilePhoto: null }
        }
    ];

    const branches = [
        'Computer Science Engineering',
        'Information Technology',
        'Electronics and Communication Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Biotechnology',
        'Aerospace Engineering',
        'Automobile Engineering'
    ];

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError('');
        
        // Use mock data instead of API call
        setTimeout(() => {
            setStudents(mockStudents);
            setLoading(false);
        }, 500); // Simulate loading time
        
        /* API call disabled - using mock data
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStudents(response.data.data || response.data.students || []);
            } else {
                // Use mock data if API fails
                setStudents(mockStudents);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            // Use mock data for development
            setStudents(mockStudents);
            setError('Using demo data - API connection failed');
        } finally {
            setLoading(false);
        }
        */
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Filter students based on search and filter criteria
    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.name.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesBranch = !filterBranch || student.branch === filterBranch;
        const matchesYear = !filterYear || student.year.toString() === filterYear;
        const matchesStatus = !filterStatus || student.status === filterStatus;
        
        return matchesSearch && matchesBranch && matchesYear && matchesStatus;
    });

    // Group students by branch
    const studentsByBranch = filteredStudents.reduce((acc, student) => {
        const branch = student.branch;
        if (!acc[branch]) {
            acc[branch] = [];
        }
        acc[branch].push(student);
        return acc;
    }, {});

    // Calculate statistics
    const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'Active').length,
        inactive: students.filter(s => s.status === 'Inactive').length,
        branches: Object.keys(studentsByBranch).length,
        filtered: filteredStudents.length
    };

    const getStudentAvatar = (student) => {
        if (student.profile?.profilePhoto) {
            return student.profile.profilePhoto;
        }
        return `${student.name.firstName.charAt(0)}${student.name.lastName.charAt(0)}`;
    };

    const getStatusColor = (status) => {
        if (!status || typeof status !== 'string') {
            return 'text-slate-400 bg-slate-400/10';
        }
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-emerald-400 bg-emerald-400/10';
            case 'inactive':
                return 'text-red-400 bg-red-400/10';
            case 'suspended':
                return 'text-yellow-400 bg-yellow-400/10';
            default:
                return 'text-slate-400 bg-slate-400/10';
        }
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setShowStudentDetails(true);
    };

    const renderStudentCard = (student) => (
        <motion.div
            key={student._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${themeClasses.primaryCard} p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
            onClick={() => handleStudentClick(student)}
        >
            <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {student.profile?.profilePhoto ? (
                        <img 
                            src={student.profile.profilePhoto} 
                            alt={`${student.name.firstName} ${student.name.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {getStudentAvatar(student)}
                        </div>
                    )}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary} group-hover:text-indigo-400 transition-colors`}>
                                {student.name.firstName} {student.name.lastName}
                            </h3>
                            <p className={`text-sm ${themeClasses.text.secondary} mb-1`}>
                                ID: {student.studentId}
                            </p>
                            <p className={`text-sm ${themeClasses.text.secondary} mb-2`}>
                                {student.email}
                            </p>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status}
                        </span>
                    </div>

                    {/* Academic Info */}
                    <div className="flex items-center space-x-4 text-sm">
                        <div className={themeClasses.text.secondary}>
                            <i className="ri-graduation-cap-line mr-1"></i>
                            Year {student.year}, Sem {student.semester}
                        </div>
                        <div className={themeClasses.text.secondary}>
                            <i className="ri-phone-line mr-1"></i>
                            {student.contact?.phone?.primary}
                        </div>
                    </div>

                    {/* Branch Tag */}
                    <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                            {student.branch}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderTableView = () => (
        <div className={`${themeClasses.primaryCard} overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${themeClasses.surface} border-b ${themeClasses.border}`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                                Student
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                                Contact
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                                Academic Info
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                                Status
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredStudents.map((student) => (
                            <motion.tr
                                key={student._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10">
                                            {student.profile?.profilePhoto ? (
                                                <img 
                                                    src={student.profile.profilePhoto} 
                                                    alt={`${student.name.firstName} ${student.name.lastName}`}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                    {getStudentAvatar(student)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                                {student.name.firstName} {student.name.lastName}
                                            </div>
                                            <div className={`text-sm ${themeClasses.text.secondary}`}>
                                                ID: {student.studentId}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`text-sm ${themeClasses.text.primary}`}>{student.email}</div>
                                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                                        {student.contact?.phone?.primary}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`text-sm ${themeClasses.text.primary}`}>
                                        {student.branch}
                                    </div>
                                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                                        Year {student.year}, Semester {student.semester}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStudentClick(student);
                                            }}
                                            className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-indigo-500/20 transition-colors`}
                                            title="View Details"
                                        >
                                            <i className="ri-eye-line text-sm"></i>
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-emerald-500/20 transition-colors`}
                                            title="Edit Student"
                                        >
                                            <i className="ri-edit-line text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBranchGroups = () => (
        <div className="space-y-6">
            {Object.entries(studentsByBranch).map(([branch, branchStudents]) => (
                <motion.div
                    key={branch}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Branch Header */}
                    <div className="flex items-center justify-between">
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary} flex items-center`}>
                            <i className="ri-graduation-cap-line mr-2 text-indigo-400"></i>
                            {branch}
                            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400`}>
                                {branchStudents.length} students
                            </span>
                        </h3>
                    </div>

                    {/* Students Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {branchStudents.map(student => renderStudentCard(student))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className={`${themeClasses.background} min-h-screen flex items-center justify-center`}>
                <div className="text-center">
                    <div className={`${themeClasses.loadingSpinner} mx-auto mb-4`}></div>
                    <p className={themeClasses.text.secondary}>Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${themeClasses.background} min-h-screen p-6`}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
                            Student Management
                        </h1>
                        <p className={themeClasses.text.secondary}>
                            Manage and monitor all students across different branches
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <button className={`${themeClasses.button.primary} px-6 py-3 rounded-xl font-semibold transition-all duration-300`}>
                            <i className="ri-user-add-line mr-2"></i>
                            Add Student
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${themeClasses.primaryCard} p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${themeClasses.text.secondary}`}>Total Students</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                                    {stats.total}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full bg-indigo-500/20`}>
                                <i className={`ri-graduation-cap-line text-2xl ${iconClasses.primary}`}></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${themeClasses.primaryCard} p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${themeClasses.text.secondary}`}>Active Students</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                                    {stats.active}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full bg-emerald-500/20`}>
                                <i className={`ri-user-line text-2xl ${iconClasses.success}`}></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${themeClasses.primaryCard} p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${themeClasses.text.secondary}`}>Branches</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                                    {stats.branches}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full bg-purple-500/20`}>
                                <i className={`ri-building-line text-2xl text-purple-400`}></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${themeClasses.primaryCard} p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${themeClasses.text.secondary}`}>Inactive</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                                    {stats.inactive}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full bg-red-500/20`}>
                                <i className={`ri-user-unfollow-line text-2xl ${iconClasses.danger}`}></i>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters and Search */}
                <div className={`${themeClasses.primaryCard} p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses.muted}`}></i>
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 ${themeClasses.border} ${themeClasses.text.primary} placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                />
                            </div>
                        </div>

                        {/* Branch Filter */}
                        <div>
                            <select
                                value={filterBranch}
                                onChange={(e) => setFilterBranch(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-700 ${themeClasses.border} ${themeClasses.text.primary} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">All Branches</option>
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-700 ${themeClasses.border} ${themeClasses.text.primary} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">All Years</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-700 ${themeClasses.border} ${themeClasses.text.primary} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                        <p className={`text-sm ${themeClasses.text.secondary}`}>
                            Showing {stats.filtered} of {stats.total} students
                        </p>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-indigo-500/20 text-indigo-400' 
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <i className="ri-layout-grid-line"></i>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                    viewMode === 'table' 
                                        ? 'bg-indigo-500/20 text-indigo-400' 
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <i className="ri-list-check"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-xl">
                        <div className="flex items-center gap-2">
                            <i className="ri-information-line"></i>
                            {error}
                        </div>
                    </div>
                )}

                {/* Content */}
                <AnimatePresence mode="wait">
                    {viewMode === 'table' ? (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {renderTableView()}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {renderBranchGroups()}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* No Results */}
                {filteredStudents.length === 0 && !loading && (
                    <div className={`${themeClasses.primaryCard} p-12 text-center`}>
                        <i className={`ri-user-search-line text-6xl ${iconClasses.muted} mb-4`}></i>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-2`}>
                            No students found
                        </h3>
                        <p className={themeClasses.text.secondary}>
                            Try adjusting your search criteria or filters
                        </p>
                    </div>
                )}
            </div>

            {/* Student Details Modal */}
            <AnimatePresence>
                {showStudentDetails && selectedStudent && (
                    <StudentDetailsModal
                        student={selectedStudent}
                        onClose={() => {
                            setShowStudentDetails(false);
                            setSelectedStudent(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Student Details Modal Component
const StudentDetailsModal = ({ student, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`${themeClasses.primaryCard} w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {student.name.firstName.charAt(0)}{student.name.lastName.charAt(0)}
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                            {student.name.firstName} {student.name.lastName}
                        </h2>
                        <p className={themeClasses.text.secondary}>
                            {student.studentId} • {student.branch}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-red-500/20 transition-colors`}
                >
                    <i className="ri-close-line text-xl"></i>
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                            Basic Information
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <span className={themeClasses.text.secondary}>Email: </span>
                                <span className={themeClasses.text.primary}>{student.email}</span>
                            </div>
                            <div>
                                <span className={themeClasses.text.secondary}>Phone: </span>
                                <span className={themeClasses.text.primary}>{student.contact?.phone?.primary}</span>
                            </div>
                            <div>
                                <span className={themeClasses.text.secondary}>Gender: </span>
                                <span className={themeClasses.text.primary}>{student.personalInfo?.gender}</span>
                            </div>
                            <div>
                                <span className={themeClasses.text.secondary}>Date of Birth: </span>
                                <span className={themeClasses.text.primary}>
                                    {new Date(student.personalInfo?.dateOfBirth).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                            Academic Information
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <span className={themeClasses.text.secondary}>Branch: </span>
                                <span className={themeClasses.text.primary}>{student.branch}</span>
                            </div>
                            <div>
                                <span className={themeClasses.text.secondary}>Year: </span>
                                <span className={themeClasses.text.primary}>{student.year}</span>
                            </div>
                            <div>
                                <span className={themeClasses.text.secondary}>Semester: </span>
                                <span className={themeClasses.text.primary}>{student.semester}</span>
                            </div>
                            <div>
                                <span className={themeClasses.text.secondary}>Admission Date: </span>
                                <span className={themeClasses.text.primary}>
                                    {new Date(student.admissionInfo?.admissionDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-3`}>
                            Status Information
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <span className={themeClasses.text.secondary}>Current Status: </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    student.status === 'Active' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {student.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-700">
                    <button className={`${themeClasses.button.primary} px-6 py-2 rounded-lg`}>
                        <i className="ri-edit-line mr-2"></i>
                        Edit Student
                    </button>
                    <button className={`${themeClasses.button.secondary} px-6 py-2 rounded-lg`}>
                        <i className="ri-user-settings-line mr-2"></i>
                        Manage Access
                    </button>
                    <button className={`bg-red-500/20 text-red-400 hover:bg-red-500/30 px-6 py-2 rounded-lg transition-colors`}>
                        <i className="ri-user-unfollow-line mr-2"></i>
                        Suspend
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

export default StudentsPage;