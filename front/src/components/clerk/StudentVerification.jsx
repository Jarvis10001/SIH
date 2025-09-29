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
            <div className={`${themeClasses.primaryCard} rounded-lg shadow-md border ${themeClasses.border} overflow-hidden`}>
                {/* Header */}
                <div className="bg-gray-800 p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {selectedApplication.personalInfo?.fullName}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Application ID: {selectedApplication.applicationId}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setViewMode('list');
                                setSelectedApplication(null);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 rounded-md p-2 transition-colors text-gray-300"
                        >
                            <i className="ri-close-line"></i>
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
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => handleVerifyStudent(selectedApplication._id, 'rejected')}
                                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-md font-medium hover:bg-red-500/30 transition-colors flex items-center"
                                >
                                    <i className="ri-close-circle-line mr-2"></i>
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleVerifyStudent(selectedApplication._id, 'verified', suggestedStudentId)}
                                    className={`${themeClasses.button.primary} px-4 py-2 rounded-md font-medium transition-colors flex items-center`}
                                >
                                    <i className="ri-check-circle-line mr-2"></i>
                                    Verify & Assign ID
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderApplicationsList = () => (
        <div className="min-h-screen bg-gray-900 p-6">
            {/* Simple Header */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <i className="ri-shield-check-line text-indigo-400"></i>
                                Student Verification
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Review and verify student applications
                            </p>
                            <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                                <span>Total: {applications.length}</span>
                                <span>•</span>
                                <span>Updated: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="pending">Pending Applications</option>
                                <option value="verified">Verified Students</option>
                                <option value="rejected">Rejected Applications</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

                {/* Simple Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Pending Review</p>
                            <p className="text-2xl font-bold text-white">
                                {applications.filter(app => app.verificationStatus === 'pending').length}
                            </p>
                        </div>
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <i className="ri-time-line text-xl text-yellow-400"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Verified</p>
                            <p className="text-2xl font-bold text-white">
                                {applications.filter(app => app.verificationStatus === 'verified').length}
                            </p>
                        </div>
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <i className="ri-check-line text-xl text-emerald-400"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Rejected</p>
                            <p className="text-2xl font-bold text-white">
                                {applications.filter(app => app.verificationStatus === 'rejected').length}
                            </p>
                        </div>
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <i className="ri-close-line text-xl text-red-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <i className="ri-file-list-3-line text-indigo-400"></i>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)} Applications
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-400 text-lg">Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="p-4 bg-gray-700/50 rounded-2xl w-fit mx-auto mb-4">
                            <i className="ri-file-list-3-line text-gray-500 text-4xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">No Applications Found</h3>
                        <p className="text-gray-500">No {filter} applications at the moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Applicant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Course</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {applications.map((application) => (
                                    <tr
                                        key={application._id}
                                        className="hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                    {application.personalInfo?.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {application.personalInfo?.fullName}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {application.applicationId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <div className="text-sm font-medium text-white">{application.personalInfo?.course}</div>
                                                <div className="text-xs text-gray-400">
                                                    {application.academicInfo?.twelfthPercentage}% in 12th
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-white">
                                                {new Date(application.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                application.verificationStatus === 'verified'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : application.verificationStatus === 'rejected'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {application.verificationStatus || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedApplication(application);
                                                        setViewMode('detail');
                                                    }}
                                                    className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-md transition-colors"
                                                    title="Review Application"
                                                >
                                                    <i className="ri-eye-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
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
                <div className={`${themeClasses.surface} border border-red-500/30 ${themeClasses.text.error} px-4 py-3 rounded-lg mb-6`}>
                    <div className="flex items-center gap-2">
                        <i className="ri-error-warning-line"></i>
                        {error}
                    </div>
                </div>
            )}

            {viewMode === 'list' ? (
                renderApplicationsList()
            ) : (
                renderApplicationDetail()
            )}
        </div>
    );
};

export default StudentVerification;