import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {selectedApplication.personalInfo?.fullName}
                            </h2>
                            <p className="text-blue-100">
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <i className="ri-user-line mr-2 text-[#3B82F6]"></i>
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                <p className="text-gray-900 font-medium">{selectedApplication.personalInfo?.fullName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                                <p className="text-gray-900">{new Date(selectedApplication.personalInfo?.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-900">{selectedApplication.personalInfo?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-gray-900">{selectedApplication.personalInfo?.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Gender</label>
                                <p className="text-gray-900">{selectedApplication.personalInfo?.gender}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Course Applied</label>
                                <p className="text-gray-900 font-medium">{selectedApplication.personalInfo?.course}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <i className="ri-graduation-cap-line mr-2 text-[#3B82F6]"></i>
                            Academic Information
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">12th Percentage</label>
                                    <p className="text-gray-900 font-medium">{selectedApplication.academicInfo?.twelfthPercentage}%</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Board</label>
                                    <p className="text-gray-900">{selectedApplication.academicInfo?.board}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Passing Year</label>
                                    <p className="text-gray-900">{selectedApplication.academicInfo?.passingYear}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <i className="ri-file-list-3-line mr-2 text-[#3B82F6]"></i>
                            Submitted Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedApplication.documents && Object.entries(selectedApplication.documents).map(([docType, docData]) => (
                                <div key={docType} className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 capitalize">
                                                {docType.replace(/([A-Z])/g, ' $1').trim()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {docData.originalName || 'Uploaded document'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Status: <span className={`font-medium ${
                                                    docData.verificationStatus === 'verified' ? 'text-blue-600' :
                                                    docData.verificationStatus === 'rejected' ? 'text-red-600' :
                                                    'text-yellow-600'
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <i className="ri-checkbox-circle-line mr-2 text-[#3B82F6]"></i>
                            Verification & Student ID Assignment
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                            {/* Student ID Assignment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assign Student ID
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        value={suggestedStudentId}
                                        onChange={(e) => setStudentIdPrefix(e.target.value)}
                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                                        placeholder="Enter student ID"
                                    />
                                    <button
                                        onClick={() => setStudentIdPrefix(generateStudentId(selectedApplication))}
                                        className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        <i className="ri-refresh-line mr-1"></i>
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Verification Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Notes
                                </label>
                                <textarea
                                    value={verificationNotes}
                                    onChange={(e) => setVerificationNotes(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                                    placeholder="Add any notes about the verification process..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVerifyStudent(selectedApplication._id, 'rejected')}
                                    className="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 transition-colors flex items-center"
                                >
                                    <i className="ri-close-circle-line mr-2"></i>
                                    Reject Application
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleVerifyStudent(selectedApplication._id, 'verified', suggestedStudentId)}
                                    className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors flex items-center"
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Student Verification</h2>
                    <div className="flex items-center space-x-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                        >
                            <option value="pending">Pending Applications</option>
                            <option value="verified">Verified Students</option>
                            <option value="rejected">Rejected Applications</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-700">Pending Review</p>
                                <p className="text-2xl font-bold text-yellow-900">
                                    {applications.filter(app => app.verificationStatus === 'pending').length}
                                </p>
                            </div>
                            <i className="ri-time-line text-2xl text-yellow-600"></i>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Verified</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {applications.filter(app => app.verificationStatus === 'verified').length}
                                </p>
                            </div>
                            <i className="ri-check-line text-2xl text-blue-600"></i>
                        </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700">Rejected</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {applications.filter(app => app.verificationStatus === 'rejected').length}
                                </p>
                            </div>
                            <i className="ri-close-line text-2xl text-red-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <i className="ri-loader-4-line animate-spin text-2xl text-gray-400 mb-2"></i>
                        <p className="text-gray-600">Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-8 text-center">
                        <i className="ri-file-list-3-line text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-600 text-lg font-medium mb-2">No applications found</p>
                        <p className="text-gray-500">No {filter} applications at the moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((application) => (
                                    <motion.tr
                                        key={application._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center text-white font-semibold">
                                                    {application.personalInfo?.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {application.personalInfo?.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
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
        <div>
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