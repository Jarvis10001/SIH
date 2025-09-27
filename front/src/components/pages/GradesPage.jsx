import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../styles/theme';

const GradesPage = () => {
    const [activeView, setActiveView] = useState('overview');
    const [selectedSemester, setSelectedSemester] = useState('current');
    const [gradesData, setGradesData] = useState({});
    const [loading, setLoading] = useState(false);
    const [studentInfo, setStudentInfo] = useState({});

    // Mock data for demonstration
    useEffect(() => {
        setStudentInfo({
            name: 'John Doe',
            studentId: 'CS2021001',
            course: 'B.Tech Computer Science Engineering',
            currentSemester: 'Semester 6',
            overallCGPA: 8.45,
            currentSGPA: 8.72
        });

        setGradesData({
            'semester-1': {
                semester: 'Semester 1',
                year: '2021-22',
                sgpa: 8.2,
                credits: 22,
                status: 'completed',
                subjects: [
                    { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'A', points: 9, marks: 85 },
                    { code: 'PH101', name: 'Engineering Physics', credits: 3, grade: 'A+', points: 10, marks: 92 },
                    { code: 'CY101', name: 'Engineering Chemistry', credits: 3, grade: 'B+', points: 8, marks: 78 },
                    { code: 'CS101', name: 'Programming for Problem Solving', credits: 4, grade: 'A', points: 9, marks: 88 },
                    { code: 'EE101', name: 'Basic Electrical Engineering', credits: 3, grade: 'A-', points: 8.5, marks: 82 },
                    { code: 'ME101', name: 'Engineering Graphics', credits: 2, grade: 'A', points: 9, marks: 86 },
                    { code: 'EN101', name: 'English Communication', credits: 3, grade: 'B+', points: 8, marks: 76 }
                ]
            },
            'semester-2': {
                semester: 'Semester 2',
                year: '2021-22',
                sgpa: 8.5,
                credits: 23,
                status: 'completed',
                subjects: [
                    { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, grade: 'A+', points: 10, marks: 94 },
                    { code: 'PH102', name: 'Physics Lab', credits: 1, grade: 'A', points: 9, marks: 88 },
                    { code: 'CY102', name: 'Chemistry Lab', credits: 1, grade: 'A', points: 9, marks: 90 },
                    { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A+', points: 10, marks: 95 },
                    { code: 'EE102', name: 'Digital Electronics', credits: 3, grade: 'A', points: 9, marks: 87 },
                    { code: 'ME102', name: 'Workshop Technology', credits: 2, grade: 'A-', points: 8.5, marks: 80 },
                    { code: 'CS103', name: 'Programming Lab', credits: 2, grade: 'A+', points: 10, marks: 96 },
                    { code: 'HS101', name: 'Indian Constitution', credits: 2, grade: 'B+', points: 8, marks: 75 },
                    { code: 'PE101', name: 'Physical Education', credits: 1, grade: 'A', points: 9, marks: 85 },
                    { code: 'LI101', name: 'Library & Information Science', credits: 1, grade: 'A', points: 9, marks: 90 },
                    { code: 'EN102', name: 'Technical Communication', credits: 2, grade: 'B+', points: 8, marks: 77 }
                ]
            },
            'semester-3': {
                semester: 'Semester 3',
                year: '2022-23',
                sgpa: 8.8,
                credits: 24,
                status: 'completed',
                subjects: [
                    { code: 'MA201', name: 'Discrete Mathematics', credits: 4, grade: 'A+', points: 10, marks: 93 },
                    { code: 'CS201', name: 'Computer Organization', credits: 4, grade: 'A', points: 9, marks: 89 },
                    { code: 'CS202', name: 'Object Oriented Programming', credits: 4, grade: 'A+', points: 10, marks: 96 },
                    { code: 'CS203', name: 'Database Management Systems', credits: 4, grade: 'A', points: 9, marks: 87 },
                    { code: 'CS204', name: 'Operating Systems', credits: 4, grade: 'A+', points: 10, marks: 94 },
                    { code: 'CS205', name: 'Programming Lab II', credits: 2, grade: 'A+', points: 10, marks: 98 },
                    { code: 'HS201', name: 'Professional Ethics', credits: 2, grade: 'A-', points: 8.5, marks: 81 }
                ]
            },
            'semester-4': {
                semester: 'Semester 4',
                year: '2022-23',
                sgpa: 8.6,
                credits: 25,
                status: 'completed',
                subjects: [
                    { code: 'MA202', name: 'Probability & Statistics', credits: 4, grade: 'A', points: 9, marks: 88 },
                    { code: 'CS301', name: 'Algorithms', credits: 4, grade: 'A+', points: 10, marks: 95 },
                    { code: 'CS302', name: 'Computer Networks', credits: 4, grade: 'A', points: 9, marks: 86 },
                    { code: 'CS303', name: 'Software Engineering', credits: 4, grade: 'A+', points: 10, marks: 92 },
                    { code: 'CS304', name: 'Theory of Computation', credits: 3, grade: 'A-', points: 8.5, marks: 82 },
                    { code: 'CS305', name: 'System Programming', credits: 3, grade: 'A', points: 9, marks: 87 },
                    { code: 'CS306', name: 'Database Lab', credits: 2, grade: 'A+', points: 10, marks: 97 },
                    { code: 'HS202', name: 'Economics for Engineers', credits: 1, grade: 'B+', points: 8, marks: 78 }
                ]
            },
            'semester-5': {
                semester: 'Semester 5',
                year: '2023-24',
                sgpa: 8.4,
                credits: 24,
                status: 'completed',
                subjects: [
                    { code: 'CS401', name: 'Machine Learning', credits: 4, grade: 'A+', points: 10, marks: 94 },
                    { code: 'CS402', name: 'Compiler Design', credits: 4, grade: 'A', points: 9, marks: 85 },
                    { code: 'CS403', name: 'Computer Graphics', credits: 3, grade: 'A-', points: 8.5, marks: 83 },
                    { code: 'CS404', name: 'Web Technologies', credits: 3, grade: 'A+', points: 10, marks: 96 },
                    { code: 'CS405', name: 'Information Security', credits: 3, grade: 'A', points: 9, marks: 88 },
                    { code: 'CS406', name: 'Mobile Application Development', credits: 3, grade: 'A', points: 9, marks: 89 },
                    { code: 'CS407', name: 'Project Work I', credits: 2, grade: 'A+', points: 10, marks: 95 },
                    { code: 'PE201', name: 'Yoga & Meditation', credits: 1, grade: 'A', points: 9, marks: 90 },
                    { code: 'IN101', name: 'Internship', credits: 1, grade: 'A', points: 9, marks: 88 }
                ]
            },
            'semester-6': {
                semester: 'Semester 6',
                year: '2023-24',
                sgpa: 8.72,
                credits: 22,
                status: 'current',
                subjects: [
                    { code: 'CS501', name: 'Artificial Intelligence', credits: 4, grade: 'A+', points: 10, marks: 96 },
                    { code: 'CS502', name: 'Cloud Computing', credits: 4, grade: 'A+', points: 10, marks: 93 },
                    { code: 'CS503', name: 'Big Data Analytics', credits: 3, grade: 'A', points: 9, marks: 87 },
                    { code: 'CS504', name: 'Blockchain Technology', credits: 3, grade: 'A', points: 9, marks: 89 },
                    { code: 'CS505', name: 'Internet of Things', credits: 3, grade: 'A-', points: 8.5, marks: 84 },
                    { code: 'CS506', name: 'Capstone Project', credits: 3, grade: 'A+', points: 10, marks: 95 },
                    { code: 'MG101', name: 'Entrepreneurship', credits: 2, grade: 'A', points: 9, marks: 88 }
                ]
            }
        });
    }, []);

    const getGradeColor = (grade) => {
        const gradeColors = {
            'A+': 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
            'A': 'text-green-300 bg-green-500/20 border-green-500/30',
            'A-': 'text-green-300 bg-green-500/20 border-green-500/30',
            'B+': 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30',
            'B': 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30',
            'B-': 'text-orange-300 bg-orange-500/20 border-orange-500/30',
            'C+': 'text-orange-300 bg-orange-500/20 border-orange-500/30',
            'C': 'text-red-300 bg-red-500/20 border-red-500/30',
            'F': 'text-red-400 bg-red-500/30 border-red-500/50'
        };
        return gradeColors[grade] || 'text-slate-300 bg-slate-500/20 border-slate-500/30';
    };

    const getSGPAColor = (sgpa) => {
        if (sgpa >= 9.0) return 'text-emerald-300';
        if (sgpa >= 8.5) return 'text-green-300';
        if (sgpa >= 8.0) return 'text-yellow-300';
        if (sgpa >= 7.0) return 'text-orange-300';
        return 'text-red-300';
    };

    const calculateCGPA = () => {
        const completedSemesters = Object.values(gradesData).filter(sem => sem.status === 'completed');
        if (completedSemesters.length === 0) return 0;
        
        const totalPoints = completedSemesters.reduce((sum, sem) => sum + (sem.sgpa * sem.credits), 0);
        const totalCredits = completedSemesters.reduce((sum, sem) => sum + sem.credits, 0);
        
        return (totalPoints / totalCredits).toFixed(2);
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Student Info & CGPA Card */}
            <div className={`${themeClasses.welcomeCard} shadow-xl`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Academic Performance</h2>
                        <p className="text-indigo-100">{studentInfo.name} ({studentInfo.studentId})</p>
                        <p className="text-indigo-100 text-sm">{studentInfo.course}</p>
                        <p className="text-indigo-100 text-sm">Current: {studentInfo.currentSemester}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold">{calculateCGPA()}</span>
                        </div>
                        <p className="text-indigo-100 text-sm">Overall CGPA</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Current SGPA</p>
                            <p className={`text-3xl font-bold ${getSGPAColor(studentInfo.currentSGPA)}`}>
                                {studentInfo.currentSGPA}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-star-line ${iconClasses.primary} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Completed Semesters</p>
                            <p className="text-3xl font-bold text-white">
                                {Object.values(gradesData).filter(sem => sem.status === 'completed').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-checkbox-circle-line ${iconClasses.success} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Total Credits</p>
                            <p className="text-3xl font-bold text-white">
                                {Object.values(gradesData).reduce((sum, sem) => sum + sem.credits, 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-medal-line ${iconClasses.warning} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Grade Point Average</p>
                            <p className={`text-3xl font-bold ${getSGPAColor(calculateCGPA())}`}>
                                {calculateCGPA()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-trophy-line ${iconClasses.success} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Semester Performance Chart */}
            <div className={themeClasses.primaryCard}>
                <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Semester-wise Performance</h3>
                <div className="space-y-4">
                    {Object.values(gradesData).map((semester, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    semester.status === 'current' 
                                        ? 'bg-indigo-500/20 border border-indigo-500/30' 
                                        : 'bg-emerald-500/20 border border-emerald-500/30'
                                }`}>
                                    <i className={`text-lg ${
                                        semester.status === 'current' 
                                            ? `ri-play-circle-line ${iconClasses.primary}`
                                            : `ri-checkbox-circle-line ${iconClasses.success}`
                                    }`}></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{semester.semester}</h4>
                                    <p className="text-sm text-slate-400">{semester.year}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">Credits</p>
                                    <p className="font-semibold text-white">{semester.credits}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">SGPA</p>
                                    <p className={`font-bold text-lg ${getSGPAColor(semester.sgpa)}`}>
                                        {semester.sgpa}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedSemester(`semester-${index + 1}`);
                                        setActiveView('semester-detail');
                                    }}
                                    className={`${themeClasses.primaryButton} px-4 py-2 text-sm`}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className={themeClasses.primaryCard}>
                <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setActiveView('all-grades')}
                        className={`${themeClasses.primaryButton} p-4 text-left`}
                    >
                        <i className="ri-file-text-line text-xl mb-2 block"></i>
                        <span className="font-semibold">All Grades</span>
                        <p className="text-sm text-indigo-200 mt-1">View complete grade sheet</p>
                    </button>

                    <button
                        onClick={() => setActiveView('transcript')}
                        className={`${themeClasses.secondaryButton} p-4 text-left`}
                    >
                        <i className="ri-file-download-line text-xl mb-2 block"></i>
                        <span className="font-semibold">Download Transcript</span>
                        <p className="text-sm text-slate-400 mt-1">Get official transcript</p>
                    </button>

                    <button
                        onClick={() => setActiveView('grade-analysis')}
                        className={`${themeClasses.secondaryButton} p-4 text-left`}
                    >
                        <i className="ri-bar-chart-line text-xl mb-2 block"></i>
                        <span className="font-semibold">Grade Analysis</span>
                        <p className="text-sm text-slate-400 mt-1">Performance analytics</p>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSemesterDetail = () => {
        const semester = gradesData[selectedSemester];
        if (!semester) return null;

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className={themeClasses.secondaryHeading}>{semester.semester}</h2>
                        <p className={themeClasses.bodyText}>{semester.year} • {semester.credits} Credits</p>
                    </div>
                    <button
                        onClick={() => setActiveView('overview')}
                        className={`${themeClasses.secondaryButton} px-4 py-2`}
                    >
                        <i className="ri-arrow-left-line mr-2"></i>
                        Back
                    </button>
                </div>

                {/* Semester Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={themeClasses.primaryCard}>
                        <div className="text-center">
                            <div className={`text-3xl font-bold mb-2 ${getSGPAColor(semester.sgpa)}`}>
                                {semester.sgpa}
                            </div>
                            <p className={themeClasses.mutedText}>Semester GPA</p>
                        </div>
                    </div>
                    <div className={themeClasses.primaryCard}>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">{semester.credits}</div>
                            <p className={themeClasses.mutedText}>Total Credits</p>
                        </div>
                    </div>
                    <div className={themeClasses.primaryCard}>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-2">{semester.subjects.length}</div>
                            <p className={themeClasses.mutedText}>Subjects</p>
                        </div>
                    </div>
                </div>

                {/* Subject-wise Grades */}
                <div className={themeClasses.primaryCard}>
                    <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Subject-wise Grades</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Course Code</th>
                                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Subject Name</th>
                                    <th className="text-center py-3 px-4 text-slate-300 font-medium">Credits</th>
                                    <th className="text-center py-3 px-4 text-slate-300 font-medium">Marks</th>
                                    <th className="text-center py-3 px-4 text-slate-300 font-medium">Grade</th>
                                    <th className="text-center py-3 px-4 text-slate-300 font-medium">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semester.subjects.map((subject, index) => (
                                    <tr key={index} className="border-b border-slate-700/30 hover:bg-gray-700/20">
                                        <td className="py-3 px-4 text-white font-mono">{subject.code}</td>
                                        <td className="py-3 px-4 text-white">{subject.name}</td>
                                        <td className="py-3 px-4 text-center text-slate-300">{subject.credits}</td>
                                        <td className="py-3 px-4 text-center text-slate-300">{subject.marks}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getGradeColor(subject.grade)}`}>
                                                {subject.grade}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center text-white font-semibold">{subject.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderAllGrades = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>Complete Grade Sheet</h2>
                <button
                    onClick={() => setActiveView('overview')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            {Object.entries(gradesData).map(([key, semester]) => (
                <div key={key} className={themeClasses.primaryCard}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">{semester.semester}</h3>
                            <p className="text-sm text-slate-400">{semester.year} • SGPA: <span className={getSGPAColor(semester.sgpa)}>{semester.sgpa}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            {semester.status === 'current' && (
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs">
                                    Current
                                </span>
                            )}
                            <span className="px-2 py-1 bg-slate-600/20 text-slate-300 rounded-lg text-xs">
                                {semester.credits} Credits
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {semester.subjects.map((subject, index) => (
                            <div key={index} className="p-3 bg-gray-700/20 rounded-lg border border-slate-600/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono text-slate-400">{subject.code}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getGradeColor(subject.grade)}`}>
                                        {subject.grade}
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-white mb-1">{subject.name}</h4>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>{subject.credits} Credits</span>
                                    <span>{subject.marks} Marks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={themeClasses.primaryHeading}>Grades & Academic Performance</h1>
                    <p className={themeClasses.bodyText}>View your semester-wise grades, CGPA, and academic progress</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
                    { id: 'all-grades', label: 'All Grades', icon: 'ri-file-text-line' },
                    { id: 'transcript', label: 'Transcript', icon: 'ri-file-download-line' },
                    { id: 'grade-analysis', label: 'Analysis', icon: 'ri-bar-chart-line' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                            activeView === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-700/30 text-slate-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                    >
                        <i className={tab.icon}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeView === 'overview' && renderOverview()}
                    {activeView === 'semester-detail' && renderSemesterDetail()}
                    {activeView === 'all-grades' && renderAllGrades()}
                    {activeView === 'transcript' && (
                        <div className={`${themeClasses.primaryCard} text-center py-12`}>
                            <i className={`ri-file-download-line text-6xl ${iconClasses.primary} mb-4`}></i>
                            <h3 className="text-xl font-semibold text-white mb-2">Download Transcript</h3>
                            <p className="text-slate-400 mb-4">Get your official academic transcript</p>
                            <button className={`${themeClasses.primaryButton} px-6 py-3`}>
                                <i className="ri-download-line mr-2"></i>
                                Download PDF
                            </button>
                        </div>
                    )}
                    {activeView === 'grade-analysis' && (
                        <div className={`${themeClasses.primaryCard} text-center py-12`}>
                            <i className={`ri-bar-chart-line text-6xl ${iconClasses.primary} mb-4`}></i>
                            <h3 className="text-xl font-semibold text-white mb-2">Grade Analysis</h3>
                            <p className="text-slate-400">Detailed performance analytics coming soon</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default GradesPage;