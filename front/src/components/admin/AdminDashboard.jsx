import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import TeacherForm from './TeacherForm';
import ClerkForm from './ClerkForm';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import AnnouncementsManagementPage from './pages/AnnouncementsManagementPage';
import EventManagementPage from './pages/EventManagementPage';
import DepartmentsPage from './pages/DepartmentsPage';
import QueriesPage from './pages/QueriesPage';
import SettingsPage from '../pages/SettingsPage';
import { validateAdminToken, getAdminTokenInfo } from '../../utils/tokenUtils';
import { themeClasses, iconClasses } from '../../styles/theme';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [clerks, setClerks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddTeacher, setShowAddTeacher] = useState(false);
    const [showAddClerk, setShowAddClerk] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [editingClerk, setEditingClerk] = useState(null);
    const [adminData, setAdminData] = useState(null);

    // Teacher page specific state
    const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
    const [teacherFilterDepartment, setTeacherFilterDepartment] = useState('all');
    const [teacherViewMode, setTeacherViewMode] = useState('grid');

    const [clerkForm, setClerkForm] = useState({
        employeeId: '',
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            gender: '',
            dateOfBirth: '',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: ''
            },
            emergencyContact: {
                name: '',
                relationship: '',
                phone: ''
            }
        },
        professionalInfo: {
            designation: '',
            department: '',
            joiningDate: '',
            experience: 0,
            workShift: 'Morning',
            reportingTo: '',
            salary: {
                basic: 0,
                allowances: 0,
                total: 0
            }
        },
        systemAccess: {
            modules: [],
            accessLevel: 'read'
        },
        password: '',
        isActive: true
    });

    const [teacherForm, setTeacherForm] = useState({
        teacherId: '',
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        designation: '',
        department: '',
        joiningDate: '',
        employeeType: '',
        experience: '',
        salary: '',
        subjects: '',
        qualification: '',
        specialization: '',
        researchInterests: '',
        publications: '',
        password: ''
    });

    useEffect(() => {
        // Validate admin token and redirect if invalid/expired
        if (!validateAdminToken(navigate)) {
            return;
        }

        // Get token info and log status
        const tokenInfo = getAdminTokenInfo();
        if (tokenInfo) {
            console.log('✅ Admin dashboard loaded with valid token');
            console.log('Token expires in:', tokenInfo.hoursLeft, 'hours', tokenInfo.minutesLeft, 'minutes');
            setAdminData(tokenInfo.admin);

            // Set up token expiry warning if less than 1 hour remaining
            if (tokenInfo.timeLeft < 60 * 60 * 1000) { // Less than 1 hour
                console.warn('⚠️ Token expires soon! Consider logging out and back in for a fresh token.');
            }
        }

        fetchTeachers();
        fetchClerks();

        // Set up periodic token validation (every 5 minutes)
        const tokenCheckInterval = setInterval(() => {
            if (!validateAdminToken(navigate)) {
                clearInterval(tokenCheckInterval);
            }
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(tokenCheckInterval);
    }, [navigate]);

    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/teachers`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setTeachers(response.data.teachers);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setError('Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchClerks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clerks`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setClerks(response.data.clerks);
            }
        } catch (error) {
            console.error('Error fetching clerks:', error);
            setError('Failed to fetch clerks');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        console.log('🚪 Admin logging out...');
        // Clear all admin token data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('tokenTimestamp');
        navigate('/admin/login');
    };

    const handleTeacherSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            console.log('Admin token from localStorage:', token ? 'Token exists' : 'No token found');
            console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'null');
            
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Transform flat teacherForm to structured format expected by backend
            const transformedData = {
                teacherId: teacherForm.teacherId, // Backend expects teacherId, not employeeId
                personalInfo: {
                    fullName: teacherForm.name,
                    firstName: teacherForm.name.split(' ')[0] || '',
                    lastName: teacherForm.name.split(' ').slice(1).join(' ') || teacherForm.name.split(' ')[0] || 'N/A', // Use first name as last name if no space
                    email: teacherForm.email,
                    phone: teacherForm.phone,
                    dateOfBirth: teacherForm.dateOfBirth,
                    gender: teacherForm.gender,
                    address: {
                        street: teacherForm.address,
                        city: '',
                        state: '',
                        pincode: ''
                    }
                },
                professionalInfo: {
                    employeeId: teacherForm.teacherId, // Also set employeeId for consistency with model
                    designation: teacherForm.designation,
                    department: teacherForm.department,
                    specialization: teacherForm.specialization || 'Computer Science', // Provide default
                    qualification: teacherForm.qualification || 'B.Tech', // Provide default
                    experience: parseInt(teacherForm.experience) || 0,
                    joiningDate: teacherForm.joiningDate,
                    employmentType: teacherForm.employeeType || 'Permanent', // Backend expects employmentType, provide default
                    salary: {
                        basic: parseInt(teacherForm.salary) || 25000,
                        allowances: 0,
                        total: parseInt(teacherForm.salary) || 25000
                    }
                },
                academicInfo: {
                    subjects: teacherForm.subjects ? teacherForm.subjects.split(',').map(s => ({
                        name: s.trim(),
                        code: '',
                        semester: 0,
                        branch: '',
                        credits: 0
                    })) : [],
                    researchAreas: teacherForm.researchInterests ? teacherForm.researchInterests.split(',').map(s => s.trim()) : [],
                    publications: teacherForm.publications ? teacherForm.publications.split(',').map(pub => ({
                        title: pub.trim(),
                        journal: '',
                        year: new Date().getFullYear(),
                        coAuthors: [],
                        doi: ''
                    })) : []
                },
                password: teacherForm.password
            };

            // Debug: Log the form data and transformed data
            console.log('📝 Original teacherForm:', teacherForm);
            console.log('🔄 Transformed data:', transformedData);
            
            // Detailed debugging of specific fields
            console.log('🔍 Field-by-field check:');
            console.log('  teacherId:', teacherForm.teacherId, '→', transformedData.teacherId);
            console.log('  name:', teacherForm.name, '→', transformedData.personalInfo?.fullName);
            console.log('  email:', teacherForm.email, '→', transformedData.personalInfo?.email);
            console.log('  employeeType:', teacherForm.employeeType, '→', transformedData.professionalInfo?.employmentType);
            console.log('  password:', teacherForm.password ? '[PROVIDED]' : '[MISSING]', '→', transformedData.password ? '[PROVIDED]' : '[MISSING]');
            
            // Validate required fields before sending
            const requiredFields = ['teacherId', 'personalInfo.fullName', 'personalInfo.email', 'password'];
            const missingFields = [];
            
            // Helper function to check if a value is truly missing (null, undefined, or empty string)
            const isMissing = (value) => !value || value.toString().trim() === '';
            
            if (isMissing(transformedData.teacherId)) missingFields.push('teacherId');
            if (isMissing(transformedData.personalInfo?.fullName)) missingFields.push('personalInfo.fullName (name)');
            if (isMissing(transformedData.personalInfo?.lastName)) missingFields.push('personalInfo.lastName (derived from name)');
            if (isMissing(transformedData.personalInfo?.email)) missingFields.push('personalInfo.email (email)');
            if (isMissing(transformedData.professionalInfo?.qualification)) missingFields.push('professionalInfo.qualification');
            if (isMissing(transformedData.professionalInfo?.specialization)) missingFields.push('professionalInfo.specialization');
            if (isMissing(transformedData.professionalInfo?.employmentType)) missingFields.push('professionalInfo.employmentType');
            if (isMissing(transformedData.password)) missingFields.push('password');
            
            if (missingFields.length > 0) {
                console.error('❌ Missing required fields:', missingFields);
                setError(`Missing required fields: ${missingFields.join(', ')}`);
                return;
            }
            
            console.log('✅ All required fields present, sending request...');

            let response;
            if (editingTeacher) {
                // Update teacher
                response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/teachers/${editingTeacher._id}`,
                    transformedData,
                    config
                );
            } else {
                // Create new teacher
                response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/teachers`,
                    transformedData,
                    config
                );
            }

            if (response.data.success) {
                setShowAddTeacher(false);
                setEditingTeacher(null);
                setTeacherForm({
                    teacherId: '',
                    name: '',
                    email: '',
                    phone: '',
                    dateOfBirth: '',
                    gender: '',
                    address: '',
                    designation: '',
                    department: '',
                    joiningDate: '',
                    employeeType: '',
                    experience: '',
                    salary: '',
                    subjects: '',
                    qualification: '',
                    specialization: '',
                    researchInterests: '',
                    publications: '',
                    password: ''
                });
                fetchTeachers();
            }
        } catch (error) {
            console.error('Error saving teacher:', error);
            console.error('Server response:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Headers sent:', error.config?.headers);
            
            // Check if it's a token expiry or invalid token error
            if (error.response?.status === 401) {
                const errorMessage = error.response?.data?.message || '';
                if (errorMessage.includes('expired') || errorMessage.includes('Invalid token')) {
                    // Token is expired or invalid, redirect to login
                    console.log('Token expired or invalid, redirecting to login...');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminData');
                    navigate('/admin/login');
                    return;
                }
            }
            
            setError(error.response?.data?.message || 'Failed to save teacher');
        } finally {
            setLoading(false);
        }
    }, [editingTeacher, fetchTeachers]);

    const handleTeacherFormChange = useCallback((updater) => {
        setTeacherForm(updater);
    }, []);

    const handleTeacherCancel = useCallback(() => {
        setShowAddTeacher(false);
        setEditingTeacher(null);
        setTeacherForm({
            teacherId: '',
            name: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            designation: '',
            department: '',
            joiningDate: '',
            employeeType: '',
            experience: '',
            salary: '',
            subjects: '',
            qualification: '',
            specialization: '',
            researchInterests: '',
            publications: '',
            password: ''
        });
    }, []);

    const handleClerkSubmit = async (clerkData, profilePhoto) => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            let response;
            if (editingClerk) {
                // Update clerk
                response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/clerks/${editingClerk._id}`,
                    clerkData,
                    config
                );
            } else {
                // Create new clerk
                response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/clerks`,
                    clerkData,
                    config
                );
            }

            if (response.data.success) {
                setShowAddClerk(false);
                setEditingClerk(null);
                setClerkForm({
                    employeeId: '',
                    personalInfo: {
                        fullName: '',
                        email: '',
                        phone: '',
                        gender: '',
                        dateOfBirth: '',
                        address: {
                            street: '',
                            city: '',
                            state: '',
                            pincode: ''
                        },
                        emergencyContact: {
                            name: '',
                            relationship: '',
                            phone: ''
                        }
                    },
                    professionalInfo: {
                        designation: '',
                        department: '',
                        joiningDate: '',
                        experience: 0,
                        workShift: 'Morning',
                        reportingTo: '',
                        salary: {
                            basic: 0,
                            allowances: 0,
                            total: 0
                        }
                    },
                    systemAccess: {
                        modules: [],
                        accessLevel: 'read'
                    },
                    password: '',
                    isActive: true
                });
                fetchClerks();
            }
        } catch (error) {
            console.error('Error saving clerk:', error);
            setError(error.response?.data?.message || 'Failed to save clerk');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/teachers/${teacherId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                fetchTeachers();
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
            setError('Failed to delete teacher');
        }
    };

    const handleDeleteClerk = async (clerkId) => {
        if (!window.confirm('Are you sure you want to delete this clerk?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/clerks/${clerkId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                fetchClerks();
            }
        } catch (error) {
            console.error('Error deleting clerk:', error);
            setError('Failed to delete clerk');
        }
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher(teacher);
        setTeacherForm({
            teacherId: teacher.teacherId,
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '',
            gender: teacher.gender || '',
            address: teacher.address || '',
            designation: teacher.designation || '',
            department: teacher.department || '',
            joiningDate: teacher.joiningDate ? teacher.joiningDate.split('T')[0] : '',
            employeeType: teacher.employeeType || '',
            experience: teacher.experience || '',
            salary: teacher.salary || '',
            subjects: teacher.subjects?.join(', ') || '',
            qualification: teacher.qualification || '',
            specialization: teacher.specialization || '',
            researchInterests: teacher.researchInterests || '',
            publications: teacher.publications || '',
            password: ''
        });
        setShowAddTeacher(true);
    };

    const handleEditClerk = (clerk) => {
        setEditingClerk(clerk);
        setClerkForm({
            employeeId: clerk.employeeId || '',
            personalInfo: {
                fullName: clerk.personalInfo?.fullName || '',
                email: clerk.personalInfo?.email || '',
                phone: clerk.personalInfo?.phone || '',
                gender: clerk.personalInfo?.gender || '',
                dateOfBirth: clerk.personalInfo?.dateOfBirth ? clerk.personalInfo.dateOfBirth.split('T')[0] : '',
                address: {
                    street: clerk.personalInfo?.address?.street || '',
                    city: clerk.personalInfo?.address?.city || '',
                    state: clerk.personalInfo?.address?.state || '',
                    pincode: clerk.personalInfo?.address?.pincode || ''
                },
                emergencyContact: {
                    name: clerk.personalInfo?.emergencyContact?.name || '',
                    relationship: clerk.personalInfo?.emergencyContact?.relationship || '',
                    phone: clerk.personalInfo?.emergencyContact?.phone || ''
                }
            },
            professionalInfo: {
                designation: clerk.professionalInfo?.designation || '',
                department: clerk.professionalInfo?.department || '',
                joiningDate: clerk.professionalInfo?.joiningDate ? clerk.professionalInfo.joiningDate.split('T')[0] : '',
                experience: clerk.professionalInfo?.experience || 0,
                workShift: clerk.professionalInfo?.workShift || 'Morning',
                reportingTo: clerk.professionalInfo?.reportingTo || '',
                salary: {
                    basic: clerk.professionalInfo?.salary?.basic || 0,
                    allowances: clerk.professionalInfo?.salary?.allowances || 0,
                    total: clerk.professionalInfo?.salary?.total || 0
                }
            },
            systemAccess: {
                modules: clerk.systemAccess?.modules || [],
                accessLevel: clerk.systemAccess?.accessLevel || 'read'
            },
            password: '',
            isActive: clerk.isActive !== false
        });
        setShowAddClerk(true);
    };

    const renderOverview = () => {
        // Mock data for enhanced statistics (in real app, this would come from API)
        const mockStats = {
            totalStudents: 850,
            totalBranches: 12,
            totalCourses: 85,
            activeAssignments: 125,
            pendingQueries: 18,
            totalAnnouncements: 42,
            branchDistribution: {
                'CSE': 180,
                'ECE': 120,
                'ME': 180,
                'CE': 150,
                'EE': 140,
                'IT': 80
            },
            teacherWorkload: {
                'underloaded': 8, // < 3 subjects
                'optimal': 15,    // 3-5 subjects
                'overloaded': 5   // > 5 subjects
            },
            recentActivity: [
                { type: 'query', message: 'New query submitted by John Smith', time: '2 mins ago' },
                { type: 'assignment', message: 'Dr. Sarah Wilson assigned to CSE-A for Data Structures', time: '1 hour ago' },
                { type: 'announcement', message: 'Mid-term schedule announcement published', time: '3 hours ago' }
            ]
        };

        return (
            <div className="space-y-8">
                {/* Main Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Total Students</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{mockStats.totalStudents}</p>
                                <p className={`text-xs ${themeClasses.text.muted} mt-1`}>Across {mockStats.totalBranches} branches</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <i className="ri-user-3-line text-blue-400 text-xl"></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Faculty Members</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{teachers.length}</p>
                                <p className={`text-xs ${themeClasses.text.muted} mt-1`}>{teachers.filter(t => t.status === 'active').length} active teachers</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                <i className={`ri-team-line ${iconClasses.primary} text-xl`}></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Course Assignments</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{mockStats.activeAssignments}</p>
                                <p className={`text-xs ${themeClasses.text.muted} mt-1`}>{mockStats.totalCourses} total courses</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <i className="ri-book-line text-green-400 text-xl"></i>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Pending Queries</p>
                                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{mockStats.pendingQueries}</p>
                                <p className={`text-xs ${themeClasses.text.muted} mt-1`}>Require attention</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                                <i className="ri-question-answer-line text-red-400 text-xl"></i>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Secondary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Branch Distribution</h3>
                            <i className="ri-pie-chart-line text-indigo-400"></i>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(mockStats.branchDistribution).slice(0, 4).map(([branch, count]) => (
                                <div key={branch} className="flex items-center justify-between">
                                    <span className={`text-sm ${themeClasses.text.secondary}`}>{branch}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${(count / Math.max(...Object.values(mockStats.branchDistribution))) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>System Status</h3>
                            <i className="ri-dashboard-line text-green-400"></i>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${themeClasses.text.secondary}`}>Server Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className={`text-sm font-medium text-green-400`}>Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${themeClasses.text.secondary}`}>Database</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className={`text-sm font-medium text-green-400`}>Connected</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${themeClasses.text.secondary}`}>Last Backup</span>
                                <span className={`text-sm font-medium text-blue-400`}>2 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${themeClasses.text.secondary}`}>Storage Used</span>
                                <span className={`text-sm font-medium text-yellow-400`}>68%</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <p className={`text-xs ${themeClasses.text.muted}`}>
                                All systems operational
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Recent Activity</h3>
                            <i className="ri-time-line text-blue-400"></i>
                        </div>
                        <div className="space-y-3">
                            {mockStats.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        activity.type === 'query' ? 'bg-red-400' :
                                        activity.type === 'assignment' ? 'bg-green-400' : 'bg-blue-400'
                                    }`}></div>
                                    <div className="flex-1">
                                        <p className={`text-sm ${themeClasses.text.secondary} line-clamp-2`}>
                                            {activity.message}
                                        </p>
                                        <p className={`text-xs ${themeClasses.text.muted} mt-1`}>
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className={`${themeClasses.primaryCard} p-6 rounded-xl`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Quick Actions</h3>
                        <i className="ri-lightning-line text-yellow-400"></i>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                            onClick={() => setActiveTab('teachers')}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                <i className="ri-user-add-line text-indigo-400 text-xl"></i>
                            </div>
                            <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Add Teacher</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('courses')}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                <i className="ri-book-add-line text-green-400 text-xl"></i>
                            </div>
                            <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Manage Courses</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('queries')}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                                <i className="ri-customer-service-2-line text-red-400 text-xl"></i>
                            </div>
                            <span className={`text-sm font-medium ${themeClasses.text.primary}`}>View Queries</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('announcements')}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                <i className="ri-megaphone-line text-purple-400 text-xl"></i>
                            </div>
                            <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Announcements</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    const renderTeachers = () => {
        // Get unique departments
        const departments = [...new Set(teachers.map(t => t.department).filter(Boolean))];
        
        // Filter teachers
        const filteredTeachers = teachers.filter(teacher => {
            const matchesSearch = teacher.name?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
                                teacher.email?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
                                teacher.teacherId?.toLowerCase().includes(teacherSearchTerm.toLowerCase());
            const matchesDepartment = teacherFilterDepartment === 'all' || teacher.department === teacherFilterDepartment;
            return matchesSearch && matchesDepartment;
        });

        const getTeacherStats = () => ({
            active: teachers.filter(t => t.status === 'active').length,
            inactive: teachers.filter(t => t.status === 'inactive').length,
            total: teachers.length,
            departments: departments.length
        });

        const stats = getTeacherStats();

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>Teacher Management</h2>
                        <p className={`${themeClasses.text.secondary} mt-1`}>Manage faculty members and their assignments</p>
                    </div>
                    <button
                        onClick={() => setShowAddTeacher(true)}
                        className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg flex items-center gap-2`}
                    >
                        <i className="ri-add-line"></i>
                        Add Teacher
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { title: 'Total Teachers', value: stats.total, icon: 'ri-team-line', color: 'text-blue-400' },
                        { title: 'Active', value: stats.active, icon: 'ri-user-line', color: 'text-green-400' },
                        { title: 'Inactive', value: stats.inactive, icon: 'ri-user-forbid-line', color: 'text-red-400' },
                        { title: 'Departments', value: stats.departments, icon: 'ri-building-line', color: 'text-purple-400' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className={`${themeClasses.primaryCard} p-4 rounded-lg`}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.title}</p>
                                    <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.value}</p>
                                </div>
                                <div className={`text-2xl ${stat.color}`}>
                                    <i className={stat.icon}></i>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div className={`${themeClasses.primaryCard} p-4 rounded-lg`}>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted}`}></i>
                                <input
                                    type="text"
                                    placeholder="Search teachers..."
                                    value={teacherSearchTerm}
                                    onChange={(e) => setTeacherSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg`}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={teacherFilterDepartment}
                                onChange={(e) => setTeacherFilterDepartment(e.target.value)}
                                className={`px-3 py-2 ${themeClasses.input} rounded-lg`}
                            >
                                <option value="all">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <div className={`flex rounded-lg overflow-hidden border ${themeClasses.border}`}>
                                <button
                                    onClick={() => setTeacherViewMode('grid')}
                                    className={`px-3 py-2 ${teacherViewMode === 'grid' ? themeClasses.button.primary : themeClasses.button.secondary}`}
                                >
                                    <i className="ri-grid-line"></i>
                                </button>
                                <button
                                    onClick={() => setTeacherViewMode('table')}
                                    className={`px-3 py-2 ${teacherViewMode === 'table' ? themeClasses.button.primary : themeClasses.button.secondary}`}
                                >
                                    <i className="ri-table-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className={`${themeClasses.primaryCard} p-8 rounded-lg text-center`}>
                        <i className={`ri-loader-4-line animate-spin text-2xl ${themeClasses.text.muted} mb-2`}></i>
                        <p className={themeClasses.text.secondary}>Loading teachers...</p>
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div className={`${themeClasses.primaryCard} p-8 rounded-lg text-center`}>
                        <i className={`ri-team-line text-4xl ${themeClasses.text.muted} mb-4`}></i>
                        <h3 className={`${themeClasses.text.primary} text-lg font-medium mb-2`}>
                            {teachers.length === 0 ? 'No teachers found' : 'No teachers match your filters'}
                        </h3>
                        <p className={themeClasses.text.muted}>
                            {teachers.length === 0 ? 'Add your first teacher to get started' : 'Try adjusting your search or filters'}
                        </p>
                    </div>
                ) : teacherViewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeachers.map((teacher) => (
                            <motion.div
                                key={teacher._id}
                                className={`${themeClasses.primaryCard} p-6 rounded-lg hover:shadow-lg transition-shadow`}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {teacher.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${themeClasses.text.primary}`}>
                                                {teacher.name}
                                            </h3>
                                            <p className={`text-sm ${themeClasses.text.secondary}`}>
                                                ID: {teacher.teacherId}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        teacher.status === 'active' 
                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {teacher.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        <i className="ri-mail-line text-indigo-400 mr-2"></i>
                                        <span className={themeClasses.text.secondary}>{teacher.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <i className="ri-phone-line text-indigo-400 mr-2"></i>
                                        <span className={themeClasses.text.secondary}>{teacher.phone}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <i className="ri-briefcase-line text-indigo-400 mr-2"></i>
                                        <span className={themeClasses.text.secondary}>{teacher.designation}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <i className="ri-building-line text-indigo-400 mr-2"></i>
                                        <span className={themeClasses.text.secondary}>{teacher.department}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                                    <div className={`text-xs ${themeClasses.text.muted}`}>
                                        Teaching: {Math.floor(Math.random() * 5) + 1} courses
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditTeacher(teacher)}
                                            className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-indigo-500/20`}
                                            title="Edit Teacher"
                                        >
                                            <i className="ri-edit-line text-indigo-400"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeacher(teacher._id)}
                                            className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-red-500/20`}
                                            title="Delete Teacher"
                                        >
                                            <i className="ri-delete-bin-line text-red-400"></i>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    // Table View
                    <div className={`${themeClasses.primaryCard} rounded-lg overflow-hidden`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${themeClasses.surface} border-b ${themeClasses.border}`}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Teacher</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Contact</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Position</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Courses</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Status</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredTeachers.map((teacher) => (
                                        <motion.tr
                                            key={teacher._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {teacher.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className={`text-sm font-medium ${themeClasses.text.primary}`}>{teacher.name}</div>
                                                        <div className={`text-sm ${themeClasses.text.secondary}`}>ID: {teacher.teacherId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${themeClasses.text.primary}`}>{teacher.email}</div>
                                                <div className={`text-sm ${themeClasses.text.secondary}`}>{teacher.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${themeClasses.text.primary}`}>{teacher.designation}</div>
                                                <div className={`text-sm ${themeClasses.text.secondary}`}>{teacher.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${themeClasses.text.primary}`}>
                                                    {Math.floor(Math.random() * 5) + 1} courses
                                                </div>
                                                <div className={`text-xs ${themeClasses.text.secondary}`}>
                                                    {Math.floor(Math.random() * 100) + 50} students
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    teacher.status === 'active' 
                                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {teacher.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditTeacher(teacher)}
                                                        className={`${iconClasses.primary} hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-500/20 transition-colors`}
                                                        title="Edit Teacher"
                                                    >
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTeacher(teacher._id)}
                                                        className={`${iconClasses.danger} hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-colors`}
                                                        title="Delete Teacher"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderClerks = () => (
        <div className={`${themeClasses.primaryCard} rounded-2xl shadow-lg overflow-hidden`}>
            <div className={`p-6 border-b ${themeClasses.border}`}>
                <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>Clerk Management</h3>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddClerk(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <i className="ri-add-line"></i>
                        Add Clerk
                    </motion.button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center">
                    <i className={`ri-loader-4-line animate-spin text-2xl ${themeClasses.text.muted} mb-2`}></i>
                    <p className={themeClasses.text.secondary}>Loading clerks...</p>
                </div>
            ) : clerks.length === 0 ? (
                <div className="p-8 text-center">
                    <i className={`ri-user-settings-line text-4xl ${themeClasses.text.muted} mb-4`}></i>
                    <p className={`${themeClasses.text.secondary} text-lg font-medium mb-2`}>No clerks found</p>
                    <p className={themeClasses.text.muted}>Add your first clerk to get started</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${themeClasses.surface} border-b ${themeClasses.border}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Clerk</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Contact</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Position</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Access Level</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Status</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.secondary} uppercase tracking-wider`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {clerks.map((clerk) => (
                                <motion.tr
                                    key={clerk._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-700/50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
                                                {clerk.personalInfo?.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className={`text-sm font-medium ${themeClasses.text.primary}`}>{clerk.personalInfo?.fullName}</div>
                                                <div className={`text-sm ${themeClasses.text.secondary}`}>ID: {clerk.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${themeClasses.text.primary}`}>{clerk.personalInfo?.email}</div>
                                        <div className={`text-sm ${themeClasses.text.secondary}`}>{clerk.personalInfo?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${themeClasses.text.primary}`}>{clerk.professionalInfo?.designation}</div>
                                        <div className={`text-sm ${themeClasses.text.secondary}`}>{clerk.professionalInfo?.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            clerk.systemAccess?.accessLevel === 'admin' 
                                                ? 'bg-purple-500/20 text-purple-400' 
                                                : clerk.systemAccess?.accessLevel === 'write'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-slate-500/20 text-slate-400'
                                        }`}>
                                            {clerk.systemAccess?.accessLevel || 'read'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            clerk.isActive 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {clerk.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditClerk(clerk)}
                                                className={`${iconClasses.primary} hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-500/20 transition-colors`}
                                                title="Edit Clerk"
                                            >
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClerk(clerk._id)}
                                                className={`${iconClasses.danger} hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-colors`}
                                                title="Delete Clerk"
                                            >
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'teachers':
                return renderTeachers();
            case 'clerks':
                return renderClerks();
            case 'students':
                return renderStudents();
            case 'courses':
                return renderCourses();
            case 'departments':
                return renderDepartments();
            case 'queries':
                return renderQueries();
            case 'academic-calendar':
                return renderAcademicCalendar();
            case 'events':
                return <EventManagementPage />;
            case 'applications':
                return renderApplications();
            case 'admission-reports':
                return renderAdmissionReports();
            case 'fee-management':
                return renderFeeManagement();
            case 'payroll':
                return renderPayroll();
            case 'financial-reports':
                return renderFinancialReports();
            case 'announcements':
                return <AnnouncementsManagementPage />;
            case 'settings':
                return <SettingsPage userRole="admin" />;
            default:
                return renderOverview();
        }
    };

    // Placeholder render functions for new sections
    const renderStudents = () => <StudentsPage />;

    const renderCourses = () => <CoursesPage />;

    const renderDepartments = () => <DepartmentsPage />;

    const renderQueries = () => <QueriesPage />;

    const renderAcademicCalendar = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-calendar-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Academic Calendar</h3>
            <p className="text-gray-600">Coming soon - Academic calendar features</p>
        </div>
    );

    const renderApplications = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-file-text-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admission Applications</h3>
            <p className="text-gray-600">Coming soon - Application management features</p>
        </div>
    );

    const renderAdmissionReports = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-bar-chart-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admission Reports</h3>
            <p className="text-gray-600">Coming soon - Admission reporting features</p>
        </div>
    );

    const renderFeeManagement = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-wallet-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fee Management</h3>
            <p className="text-gray-600">Coming soon - Fee management features</p>
        </div>
    );

    const renderPayroll = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-bank-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payroll Management</h3>
            <p className="text-gray-600">Coming soon - Payroll management features</p>
        </div>
    );

    const renderFinancialReports = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-line-chart-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-600">Coming soon - Financial reporting features</p>
        </div>
    );

    const renderSettings = () => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <i className="ri-settings-3-line text-4xl text-[#3B82F6] mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">Coming soon - System configuration features</p>
        </div>
    );

    return (
        <div className={themeClasses.dashboardLayout}>
            {/* Admin Sidebar */}
            <AdminSidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all md:duration-700 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
                {/* Top Navigation */}
                <AdminTopNav 
                    activeTab={activeTab}
                    isOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                />

                {/* Main Content */}
                <main className="flex-1 px-4 py-6 md:p-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6"
                        >
                            <div className="flex items-center gap-2">
                                <i className="ri-error-warning-line"></i>
                                {error}
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Enhanced Teacher Form Modal */}
            <AnimatePresence>
                {showAddTeacher && (
                    <TeacherForm
                        teacherForm={teacherForm}
                        setTeacherForm={setTeacherForm}
                        onSubmit={handleTeacherSubmit}
                        onCancel={handleTeacherCancel}
                        loading={loading}
                        editingTeacher={editingTeacher}
                        error={error}
                    />
                )}
            </AnimatePresence>

            {/* Enhanced Clerk Form Modal */}
            <AnimatePresence>
                {showAddClerk && (
                    <ClerkForm
                        clerkForm={clerkForm}
                        setClerkForm={setClerkForm}
                        onSubmit={handleClerkSubmit}
                        onCancel={() => {
                            setShowAddClerk(false);
                            setEditingClerk(null);
                            setClerkForm({
                                employeeId: '',
                                personalInfo: {
                                    fullName: '',
                                    email: '',
                                    phone: '',
                                    gender: '',
                                    dateOfBirth: '',
                                    address: {
                                        street: '',
                                        city: '',
                                        state: '',
                                        pincode: ''
                                    },
                                    emergencyContact: {
                                        name: '',
                                        relationship: '',
                                        phone: ''
                                    }
                                },
                                professionalInfo: {
                                    designation: '',
                                    department: '',
                                    joiningDate: '',
                                    experience: 0,
                                    workShift: 'Morning',
                                    reportingTo: '',
                                    salary: {
                                        basic: 0,
                                        allowances: 0,
                                        total: 0
                                    }
                                },
                                systemAccess: {
                                    modules: [],
                                    accessLevel: 'read'
                                },
                                password: '',
                                isActive: true
                            });
                        }}
                        loading={loading}
                        editingClerk={editingClerk}
                        error={error}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;