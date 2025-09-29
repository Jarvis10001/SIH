import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    const [courseForm, setCourseForm] = useState({
        name: '',
        code: '',
        department: '',
        semester: '',
        credits: '',
        type: 'Core',
        description: '',
        prerequisites: []
    });

    const [assignmentForm, setAssignmentForm] = useState({
        courseId: '',
        teacherId: '',
        branches: [],
        semester: '',
        academicYear: '2024-25'
    });

    // Mock data
    const mockCourses = [
        {
            id: 1,
            name: 'Data Structures & Algorithms',
            code: 'CS301',
            department: 'Computer Science Engineering',
            semester: 3,
            credits: 4,
            type: 'Core',
            description: 'Fundamental data structures and algorithm design techniques',
            prerequisites: ['Programming Fundamentals', 'Mathematics I'],
            assignments: [
                {
                    id: 1,
                    teacher: 'Dr. Sarah Wilson',
                    teacherId: 1,
                    branches: ['CSE-A', 'CSE-B'],
                    academicYear: '2024-25'
                },
                {
                    id: 2,
                    teacher: 'Prof. Michael Chen',
                    teacherId: 2,
                    branches: ['CSE-C'],
                    academicYear: '2024-25'
                }
            ]
        },
        {
            id: 2,
            name: 'Database Management Systems',
            code: 'CS401',
            department: 'Computer Science Engineering',
            semester: 4,
            credits: 3,
            type: 'Core',
            description: 'Design and implementation of database systems',
            prerequisites: ['Data Structures & Algorithms'],
            assignments: [
                {
                    id: 3,
                    teacher: 'Dr. Emily Rodriguez',
                    teacherId: 3,
                    branches: ['CSE-A', 'CSE-C'],
                    academicYear: '2024-25'
                }
            ]
        },
        {
            id: 3,
            name: 'Machine Learning',
            code: 'CS501',
            department: 'Computer Science Engineering',
            semester: 5,
            credits: 4,
            type: 'Elective',
            description: 'Introduction to machine learning algorithms and applications',
            prerequisites: ['Linear Algebra', 'Statistics', 'Programming'],
            assignments: [
                {
                    id: 4,
                    teacher: 'Dr. James Kumar',
                    teacherId: 4,
                    branches: ['CSE-A'],
                    academicYear: '2024-25'
                }
            ]
        },
        {
            id: 4,
            name: 'Engineering Mathematics III',
            code: 'MA301',
            department: 'Mathematics',
            semester: 3,
            credits: 3,
            type: 'Core',
            description: 'Advanced mathematical concepts for engineering applications',
            prerequisites: ['Mathematics I', 'Mathematics II'],
            assignments: [
                {
                    id: 5,
                    teacher: 'Prof. Lisa Anderson',
                    teacherId: 5,
                    branches: ['CSE-A', 'CSE-B', 'CSE-C', 'ECE-A', 'ME-A'],
                    academicYear: '2024-25'
                }
            ]
        },
        {
            id: 5,
            name: 'Digital Electronics',
            code: 'ECE201',
            department: 'Electronics & Communication',
            semester: 2,
            credits: 4,
            type: 'Core',
            description: 'Digital systems design and Boolean algebra',
            prerequisites: ['Basic Electronics'],
            assignments: [
                {
                    id: 6,
                    teacher: 'Dr. Robert Kim',
                    teacherId: 6,
                    branches: ['ECE-A', 'ECE-B'],
                    academicYear: '2024-25'
                }
            ]
        }
    ];

    const mockDepartments = [
        'Computer Science Engineering',
        'Electronics & Communication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Mathematics',
        'Physics',
        'Chemistry'
    ];

    const mockTeachers = [
        { id: 1, name: 'Dr. Sarah Wilson', department: 'Computer Science Engineering' },
        { id: 2, name: 'Prof. Michael Chen', department: 'Computer Science Engineering' },
        { id: 3, name: 'Dr. Emily Rodriguez', department: 'Computer Science Engineering' },
        { id: 4, name: 'Dr. James Kumar', department: 'Computer Science Engineering' },
        { id: 5, name: 'Prof. Lisa Anderson', department: 'Mathematics' },
        { id: 6, name: 'Dr. Robert Kim', department: 'Electronics & Communication' }
    ];

    const mockBranches = [
        'CSE-A', 'CSE-B', 'CSE-C',
        'ECE-A', 'ECE-B',
        'ME-A', 'ME-B',
        'CE-A', 'CE-B',
        'EE-A', 'EE-B'
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setCourses(mockCourses);
            setDepartments(mockDepartments);
            setTeachers(mockTeachers);
            setBranches(mockBranches);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = !filterDepartment || course.department === filterDepartment;
        return matchesSearch && matchesDepartment;
    });

    const handleCourseSubmit = () => {
        if (selectedCourse) {
            setCourses(courses.map(course => 
                course.id === selectedCourse.id 
                    ? { ...course, ...courseForm, id: selectedCourse.id }
                    : course
            ));
        } else {
            const newCourse = {
                ...courseForm,
                id: Date.now(),
                assignments: []
            };
            setCourses([...courses, newCourse]);
        }
        setShowCourseModal(false);
        resetCourseForm();
    };

    const handleAssignmentSubmit = () => {
        const teacher = teachers.find(t => t.id === parseInt(assignmentForm.teacherId));
        const newAssignment = {
            id: Date.now(),
            teacher: teacher.name,
            teacherId: teacher.id,
            branches: assignmentForm.branches,
            academicYear: assignmentForm.academicYear
        };

        setCourses(courses.map(course => 
            course.id === parseInt(assignmentForm.courseId)
                ? { ...course, assignments: [...course.assignments, newAssignment] }
                : course
        ));

        setShowAssignmentModal(false);
        resetAssignmentForm();
    };

    const resetCourseForm = () => {
        setCourseForm({
            name: '',
            code: '',
            department: '',
            semester: '',
            credits: '',
            type: 'Core',
            description: '',
            prerequisites: []
        });
        setSelectedCourse(null);
    };

    const resetAssignmentForm = () => {
        setAssignmentForm({
            courseId: '',
            teacherId: '',
            branches: [],
            semester: '',
            academicYear: '2024-25'
        });
    };

    const handleEditCourse = (course) => {
        setCourseForm(course);
        setSelectedCourse(course);
        setShowCourseModal(true);
    };

    const handleDeleteCourse = (courseId) => {
        setCourses(courses.filter(course => course.id !== courseId));
    };

    const handleRemoveAssignment = (courseId, assignmentId) => {
        setCourses(courses.map(course => 
            course.id === courseId
                ? { ...course, assignments: course.assignments.filter(a => a.id !== assignmentId) }
                : course
        ));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Core': return 'text-blue-400 bg-blue-500/20';
            case 'Elective': return 'text-green-400 bg-green-500/20';
            case 'Lab': return 'text-purple-400 bg-purple-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
                    <p className={themeClasses.text.secondary}>Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>Course Management</h1>
                    <p className={`${themeClasses.text.secondary} mt-1`}>
                        Manage courses, subjects and teacher assignments
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                        <i className="ri-user-add-line"></i>
                        Assign Teacher
                    </button>
                    <button
                        onClick={() => setShowCourseModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <i className="ri-add-line"></i>
                        Add Course
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Courses"
                    value={courses.length}
                    icon="ri-book-line"
                    color="indigo"
                />
                <StatCard
                    title="Active Assignments"
                    value={courses.reduce((acc, course) => acc + course.assignments.length, 0)}
                    icon="ri-team-line"
                    color="green"
                />
                <StatCard
                    title="Departments"
                    value={new Set(courses.map(c => c.department)).size}
                    icon="ri-building-line"
                    color="blue"
                />
                <StatCard
                    title="Core Subjects"
                    value={courses.filter(c => c.type === 'Core').length}
                    icon="ri-star-line"
                    color="yellow"
                />
            </div>

            {/* Filters */}
            <div className={`${themeClasses.primaryCard} p-6 rounded-xl`}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Search Courses</label>
                        <div className="relative">
                            <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses.primary}`}></i>
                            <input
                                type="text"
                                placeholder="Search by name or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>Department</label>
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className={`${themeClasses.text.primary} font-medium block`}>View Mode</label>
                        <div className="flex bg-gray-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-indigo-600 text-white' 
                                        : `${themeClasses.text.secondary} hover:bg-gray-600`
                                }`}
                            >
                                <i className="ri-grid-line"></i>
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-indigo-600 text-white' 
                                        : `${themeClasses.text.secondary} hover:bg-gray-600`
                                }`}
                            >
                                <i className="ri-list-unordered"></i>
                                List
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <p className={`${themeClasses.text.secondary} text-sm`}>
                            Showing {filteredCourses.length} of {courses.length} courses
                        </p>
                    </div>
                </div>
            </div>

            {/* Courses Display */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`${themeClasses.primaryCard} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
                            >
                                {/* Course Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className={`text-lg font-bold ${themeClasses.text.primary}`}>
                                                {course.name}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getTypeColor(course.type)}`}>
                                                {course.type}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${iconClasses.primary} font-semibold mb-1`}>
                                            {course.code}
                                        </p>
                                        <p className={`text-sm ${themeClasses.text.secondary}`}>
                                            {course.department}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditCourse(course)}
                                            className={`p-2 rounded-lg ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}
                                        >
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={themeClasses.text.secondary}>Semester:</span>
                                        <span className={`${themeClasses.text.primary} font-medium`}>{course.semester}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={themeClasses.text.secondary}>Credits:</span>
                                        <span className={`${themeClasses.text.primary} font-medium`}>{course.credits}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className={`text-sm ${themeClasses.text.secondary} mb-4 line-clamp-2`}>
                                    {course.description}
                                </p>

                                {/* Teacher Assignments */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-sm font-semibold ${themeClasses.text.primary}`}>
                                            Teacher Assignments
                                        </h4>
                                        <span className={`text-xs px-2 py-1 rounded-lg bg-indigo-500/20 ${iconClasses.primary}`}>
                                            {course.assignments.length} assigned
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {course.assignments.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className={`p-3 rounded-lg ${themeClasses.surface} border ${themeClasses.border}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${themeClasses.text.primary} truncate`}>
                                                            {assignment.teacher}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {assignment.branches.map((branch) => (
                                                                <span
                                                                    key={branch}
                                                                    className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-lg"
                                                                >
                                                                    {branch}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveAssignment(course.id, assignment.id)}
                                                        className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors ml-2"
                                                    >
                                                        <i className="ri-close-line text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {course.assignments.length === 0 && (
                                            <div className={`p-3 rounded-lg ${themeClasses.surface} border ${themeClasses.border} text-center`}>
                                                <p className={`text-sm ${themeClasses.text.muted}`}>
                                                    No teachers assigned
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                /* List View */
                <div className={`${themeClasses.primaryCard} rounded-xl overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={`${themeClasses.surface}`}>
                                <tr>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Course</th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Department</th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Semester</th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Credits</th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Type</th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Assignments</th>
                                    <th className={`text-left p-4 ${themeClasses.text.primary} font-semibold`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course, index) => (
                                    <tr
                                        key={course.id}
                                        className={`border-t ${themeClasses.border} hover:bg-gray-700/30 transition-colors`}
                                    >
                                        <td className="p-4">
                                            <div>
                                                <p className={`font-medium ${themeClasses.text.primary}`}>
                                                    {course.name}
                                                </p>
                                                <p className={`text-sm ${iconClasses.primary}`}>
                                                    {course.code}
                                                </p>
                                            </div>
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.secondary}`}>
                                            {course.department}
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.primary}`}>
                                            {course.semester}
                                        </td>
                                        <td className={`p-4 ${themeClasses.text.primary}`}>
                                            {course.credits}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getTypeColor(course.type)}`}>
                                                {course.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {course.assignments.slice(0, 2).map((assignment) => (
                                                    <span
                                                        key={assignment.id}
                                                        className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-lg"
                                                    >
                                                        {assignment.teacher.split(' ')[0]}
                                                    </span>
                                                ))}
                                                {course.assignments.length > 2 && (
                                                    <span className={`px-2 py-1 text-xs ${themeClasses.text.muted} bg-gray-500/20 rounded-lg`}>
                                                        +{course.assignments.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditCourse(course)}
                                                    className={`p-2 rounded-lg ${iconClasses.primary} hover:bg-indigo-500/20 transition-colors`}
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCourse(course.id)}
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

            {filteredCourses.length === 0 && (
                <div className={`${themeClasses.primaryCard} rounded-xl p-12 text-center`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-500/20 mb-4`}>
                        <i className={`ri-book-line text-2xl ${themeClasses.text.muted}`}></i>
                    </div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                        No courses found
                    </h3>
                    <p className={`${themeClasses.text.secondary} mb-6`}>
                        {searchTerm || filterDepartment ? 'Try adjusting your search filters.' : 'Get started by adding your first course.'}
                    </p>
                    {!searchTerm && !filterDepartment && (
                        <button
                            onClick={() => setShowCourseModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors mx-auto"
                        >
                            <i className="ri-add-line"></i>
                            Add First Course
                        </button>
                    )}
                </div>
            )}

            {/* Course Modal */}
            <AnimatePresence>
                {showCourseModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowCourseModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${themeClasses.primaryCard} rounded-2xl w-full max-w-2xl p-6`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                    {selectedCourse ? 'Edit Course' : 'Add New Course'}
                                </h2>
                                <button
                                    onClick={() => setShowCourseModal(false)}
                                    className={`p-2 rounded-xl ${themeClasses.text.secondary} hover:bg-gray-700/50 transition-colors`}
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Course Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter course name"
                                        value={courseForm.name}
                                        onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Course Code *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., CS301"
                                        value={courseForm.code}
                                        onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Department *
                                    </label>
                                    <select
                                        value={courseForm.department}
                                        onChange={(e) => setCourseForm({...courseForm, department: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Semester *
                                    </label>
                                    <select
                                        value={courseForm.semester}
                                        onChange={(e) => setCourseForm({...courseForm, semester: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                    >
                                        <option value="">Select Semester</option>
                                        {[1,2,3,4,5,6,7,8].map(sem => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Credits *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter credits"
                                        min="1"
                                        max="6"
                                        value={courseForm.credits}
                                        onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Course Type *
                                    </label>
                                    <select
                                        value={courseForm.type}
                                        onChange={(e) => setCourseForm({...courseForm, type: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                    >
                                        <option value="Core">Core</option>
                                        <option value="Elective">Elective</option>
                                        <option value="Lab">Lab</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 mt-6">
                                <label className={`${themeClasses.text.primary} font-medium block`}>
                                    Description
                                </label>
                                <textarea
                                    placeholder="Enter course description"
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                                    className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} placeholder-slate-400 outline-none transition-colors h-24 resize-none`}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowCourseModal(false)}
                                    className={`px-6 py-3 border ${themeClasses.border} rounded-xl ${themeClasses.text.secondary} font-medium hover:bg-gray-700 transition-colors`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCourseSubmit}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    {selectedCourse ? 'Update Course' : 'Add Course'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assignment Modal */}
            <AnimatePresence>
                {showAssignmentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAssignmentModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${themeClasses.primaryCard} rounded-2xl w-full max-w-lg p-6`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                                    Assign Teacher to Course
                                </h2>
                                <button
                                    onClick={() => setShowAssignmentModal(false)}
                                    className={`p-2 rounded-xl ${themeClasses.text.secondary} hover:bg-gray-700/50 transition-colors`}
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Select Course *
                                    </label>
                                    <select
                                        value={assignmentForm.courseId}
                                        onChange={(e) => setAssignmentForm({...assignmentForm, courseId: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                    >
                                        <option value="">Choose a course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name} ({course.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Select Teacher *
                                    </label>
                                    <select
                                        value={assignmentForm.teacherId}
                                        onChange={(e) => setAssignmentForm({...assignmentForm, teacherId: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                    >
                                        <option value="">Choose a teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name} - {teacher.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Select Branches *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-slate-600 rounded-xl bg-gray-700/50">
                                        {branches.map(branch => (
                                            <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={assignmentForm.branches.includes(branch)}
                                                    onChange={(e) => {
                                                        const branches = e.target.checked
                                                            ? [...assignmentForm.branches, branch]
                                                            : assignmentForm.branches.filter(b => b !== branch);
                                                        setAssignmentForm({...assignmentForm, branches});
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                                                />
                                                <span className={`text-sm ${themeClasses.text.primary}`}>{branch}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={`${themeClasses.text.primary} font-medium block`}>
                                        Academic Year *
                                    </label>
                                    <select
                                        value={assignmentForm.academicYear}
                                        onChange={(e) => setAssignmentForm({...assignmentForm, academicYear: e.target.value})}
                                        className={`w-full p-3 rounded-xl bg-gray-700 border-2 border-slate-600 focus:border-indigo-500 ${themeClasses.text.primary} outline-none transition-colors`}
                                    >
                                        <option value="2024-25">2024-25</option>
                                        <option value="2025-26">2025-26</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowAssignmentModal(false)}
                                    className={`px-6 py-3 border ${themeClasses.border} rounded-xl ${themeClasses.text.secondary} font-medium hover:bg-gray-700 transition-colors`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignmentSubmit}
                                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                                >
                                    Assign Teacher
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CoursesPage;