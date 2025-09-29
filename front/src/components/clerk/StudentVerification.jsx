import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { themeClasses, iconClasses } from '../../styles/theme';

const StudentVerification = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending'); // pending, verified, rejected
    const [viewMode, setViewMode] = useState('list'); // list, detail
    const [studentIdPrefix, setStudentIdPrefix] = useState('2024');
    const [verificationNotes, setVerificationNotes] = useState('');

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('clerkToken');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/clerk/admission-applications?status=${filter}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError('Failed to fetch admission applications');
        } finally {
            setLoading(false);
        }
    };

    const generateStudentId = (application) => {
        const year = new Date().getFullYear();
        const dept = application.personalInfo?.course?.substr(0, 2).toUpperCase() || 'GN';
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${year}${dept}${random}`;
    };

    const handleVerifyStudent = async (applicationId, status, assignedStudentId = null) => {
        try {
            const token = localStorage.getItem('clerkToken');
            const payload = {
                status,
                verificationNotes,
                ...(status === 'verified' && assignedStudentId && { studentId: assignedStudentId })
            };

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/clerk/verify-student/${applicationId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                fetchApplications();
                setSelectedApplication(null);
                setViewMode('list');
                setVerificationNotes('');
            }
        } catch (error) {
            console.error('Error verifying student:', error);
            setError('Failed to update student verification status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'verified':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderApplicationDetail = () => {
        if (!selectedApplication) return null;

        const suggestedStudentId = generateStudentId(selectedApplication);

        return (
            <div className={`${themeClasses.primaryCard} rounded-2xl shadow-lg border ${themeClasses.border} overflow-hidden`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {selectedApplication.personalInfo?.fullName}
                            </h2>
                            <p className="text-indigo-100">
                                Application ID: {selectedApplication.applicationId}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setViewMode('list');
                                setSelectedApplication(null);
                            }}
                            className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-4 flex items-center`}>
                            <i className={`ri-user-line mr-2 ${themeClasses.text.accent}`}></i>
                            Personal Information
                        </h3>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${themeClasses.surface} p-4 rounded-xl`}>
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Full Name</label>
                                <p className={`${themeClasses.text.primary} font-medium`}>{selectedApplication.personalInfo?.fullName}</p>
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Date of Birth</label>
                                <p className={themeClasses.text.primary}>{new Date(selectedApplication.personalInfo?.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Email</label>
                                <p className={themeClasses.text.primary}>{selectedApplication.personalInfo?.email}</p>
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Phone</label>
                                <p className={themeClasses.text.primary}>{selectedApplication.personalInfo?.phone}</p>
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Gender</label>
                                <p className={themeClasses.text.primary}>{selectedApplication.personalInfo?.gender}</p>
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Course Applied</label>
                                <p className={`${themeClasses.text.primary} font-medium`}>{selectedApplication.personalInfo?.course}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-4 flex items-center`}>
                            <i className={`ri-graduation-cap-line mr-2 ${themeClasses.text.accent}`}></i>
                            Academic Information
                        </h3>
                        <div className={`${themeClasses.surface} p-4 rounded-xl`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className={`text-sm font-medium ${themeClasses.text.muted}`}>12th Percentage</label>
                                    <p className={`${themeClasses.text.primary} font-medium`}>{selectedApplication.academicInfo?.twelfthPercentage}%</p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Board</label>
                                    <p className={themeClasses.text.primary}>{selectedApplication.academicInfo?.board}</p>
                                </div>
                                <div>
                                    <label className={`text-sm font-medium ${themeClasses.text.muted}`}>Passing Year</label>
                                    <p className={themeClasses.text.primary}>{selectedApplication.academicInfo?.passingYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-4 flex items-center`}>
                            <i className={`ri-file-list-3-line mr-2 ${themeClasses.text.accent}`}></i>
                            Submitted Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedApplication.documents && Object.entries(selectedApplication.documents).map(([docType, docData]) => (
                                <div key={docType} className={`${themeClasses.surface} p-4 rounded-xl`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-medium ${themeClasses.text.primary} capitalize`}>
                                                {docType.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                            <p className={`text-sm ${themeClasses.text.secondary}`}>
                                                {docData.originalName || 'Uploaded document'}
                                            </p>
                                            <p className={`text-xs ${themeClasses.text.muted}`}>
                                                Status: <span className={`font-medium ${
                                                    docData.verificationStatus === 'verified' ? themeClasses.text.accent :
                                                    docData.verificationStatus === 'rejected' ? themeClasses.text.error :
                                                    themeClasses.text.warning
                                                }`}>
                                                    {docData.verificationStatus || 'pending'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => window.open(docData.url, '_blank')}
                                                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="View Document"
                                            >
                                                <i className="ri-eye-line"></i>
                                            </button>
                                            <button
                                                onClick={() => window.open(docData.url, '_blank')}
                                                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="Download Document"
                                            >
                                                <i className="ri-download-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verification Section */}
                    <div>
                        <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-4 flex items-center`}>
                            <i className={`ri-checkbox-circle-line mr-2 ${themeClasses.text.accent}`}></i>
                            Verification & Student ID Assignment
                        </h3>
                        <div className={`${themeClasses.surface} p-6 rounded-xl space-y-4`}>
                            {/* Student ID Assignment */}
                            <div>
                                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                                    Assign Student ID
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={suggestedStudentId}
                                        onChange={(e) => setStudentIdPrefix(e.target.value)}
                                        className={`flex-1 p-3 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                        placeholder="Enter student ID"
                                    />
                                    <button
                                        onClick={() => setStudentIdPrefix(generateStudentId(selectedApplication))}
                                        className={`${themeClasses.button.secondary} px-4 py-3 rounded-lg transition-colors`}
                                    >
                                        <i className="ri-refresh-line mr-1"></i>
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Verification Notes */}
                            <div>
                                <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                                    Verification Notes
                                </label>
                                <textarea
                                    value={verificationNotes}
                                    onChange={(e) => setVerificationNotes(e.target.value)}
                                    rows={3}
                                    className={`w-full p-3 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder="Add any notes about the verification process..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVerifyStudent(selectedApplication._id, 'rejected')}
                                    className="bg-red-500/20 text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition-colors flex items-center"
                                >
                                    <i className="ri-close-circle-line mr-2"></i>
                                    Reject Application
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVerifyStudent(selectedApplication._id, 'verified', suggestedStudentId)}
                                    className={`${themeClasses.button.primary} px-6 py-3 rounded-xl font-semibold transition-colors flex items-center`}
                                >
                                    <i className="ri-check-circle-line mr-2"></i>
                                    Verify & Assign ID
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderApplicationsList = () => (
        <div className="space-y-6">
            {/* Filter and Stats */}
            <div className={`${themeClasses.primaryCard} rounded-2xl shadow-lg border ${themeClasses.border} p-6`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>Student Verification</h2>
                    <div className="flex items-center space-x-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={`border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        >
                            <option value="pending">Pending Applications</option>
                            <option value="verified">Verified Students</option>
                            <option value="rejected">Rejected Applications</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`${themeClasses.surface} p-4 rounded-xl border border-yellow-500/30`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.warning}`}>Pending Review</p>
                                <p className={`text-2xl font-bold ${themeClasses.text.warning}`}>
                                    {applications.filter(app => app.verificationStatus === 'pending').length}
                                </p>
                            </div>
                            <i className={`ri-time-line text-2xl ${themeClasses.text.warning}`}></i>
                        </div>
                    </div>
                    <div className={`${themeClasses.surface} p-4 rounded-xl border border-indigo-500/30`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.accent}`}>Verified</p>
                                <p className={`text-2xl font-bold ${themeClasses.text.accent}`}>
                                    {applications.filter(app => app.verificationStatus === 'verified').length}
                                </p>
                            </div>
                            <i className={`ri-check-line text-2xl ${themeClasses.text.accent}`}></i>
                        </div>
                    </div>
                    <div className={`${themeClasses.surface} p-4 rounded-xl border border-red-500/30`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${themeClasses.text.error}`}>Rejected</p>
                                <p className={`text-2xl font-bold ${themeClasses.text.error}`}>
                                    {applications.filter(app => app.verificationStatus === 'rejected').length}
                                </p>
                            </div>
                            <i className={`ri-close-line text-2xl ${themeClasses.text.error}`}></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className={`${themeClasses.primaryCard} rounded-2xl shadow-lg border ${themeClasses.border} overflow-hidden`}>
                {loading ? (
                    <div className="p-8 text-center">
                        <i className={`ri-loader-4-line animate-spin text-2xl ${themeClasses.text.muted} mb-2`}></i>
                        <p className={themeClasses.text.secondary}>Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-8 text-center">
                        <i className={`ri-file-list-3-line text-4xl ${themeClasses.text.muted} mb-4`}></i>
                        <p className={`${themeClasses.text.secondary} text-lg font-medium mb-2`}>No applications found</p>
                        <p className={themeClasses.text.muted}>No {filter} applications at the moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={themeClasses.surfaceVariant}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Applicant</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Course</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Application Date</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Status</th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`${themeClasses.primaryCard} divide-y ${themeClasses.border}`}>
                                {applications.map((application) => (
                                    <motion.tr
                                        key={application._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`hover:${themeClasses.surfaceVariant} transition-colors`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {application.personalInfo?.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className={`text-sm font-medium ${themeClasses.text.primary}`}>
                                                        {application.personalInfo?.fullName}
                                                    </div>
                                                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                                                        {application.applicationId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{application.personalInfo?.course}</div>
                                            <div className="text-sm text-gray-500">{application.academicInfo?.twelfthPercentage}%</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(application.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.verificationStatus)}`}>
                                                {application.verificationStatus || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedApplication(application);
                                                    setViewMode('detail');
                                                }}
                                                className="text-[#3B82F6] hover:text-[#2563EB] p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                title="Review Application"
                                            >
                                                <i className="ri-eye-line"></i>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={themeClasses.pageBackground}>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${themeClasses.surface} border border-red-500/30 ${themeClasses.text.error} px-4 py-3 rounded-xl mb-6`}
                >
                    <div className="flex items-center gap-2">
                        <i className="ri-error-warning-line"></i>
                        {error}
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {renderApplicationsList()}
                    </motion.div>
                ) : (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {renderApplicationDetail()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentVerification;