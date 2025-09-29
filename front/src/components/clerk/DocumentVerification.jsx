import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { themeClasses, iconClasses } from '../../styles/theme';

const DocumentVerification = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applicationDocuments, setApplicationDocuments] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('pending');
    const [viewMode, setViewMode] = useState('list'); // list, detail
    const [verificationModal, setVerificationModal] = useState({ open: false, document: null, application: null });
    const [verificationNotes, setVerificationNotes] = useState('');

    const documentDisplayNames = {
        tenthMarksheet: '10th Grade Marksheet',
        twelfthMarksheet: '12th Grade Marksheet',
        medicalCertificate: 'Medical Certificate',
        jeeResult: 'JEE Result',
        categoryCertificate: 'Category Certificate',
        aadharCard: 'Aadhar Card',
        photo: 'Student Photo',
        signature: 'Student Signature'
    };

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

    const fetchApplicationDocuments = async (applicationId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('clerkToken');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/clerk/application/${applicationId}/documents`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setApplicationDocuments(response.data.application);
                setViewMode('detail');
            }
        } catch (error) {
            console.error('Error fetching application documents:', error);
            setError('Failed to fetch application documents');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDocument = async (status) => {
        try {
            const token = localStorage.getItem('clerkToken');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/clerk/verify-document/${verificationModal.application}/${verificationModal.document}`,
                {
                    status,
                    notes: verificationNotes
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                // Refresh application documents
                await fetchApplicationDocuments(verificationModal.application);
                setVerificationModal({ open: false, document: null, application: null });
                setVerificationNotes('');
                // Refresh applications list
                fetchApplications();
            }
        } catch (error) {
            console.error('Error verifying document:', error);
            setError('Failed to verify document');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return `${themeClasses.surface} ${themeClasses.text.warning} border border-yellow-500/30`;
            case 'verified':
                return `${themeClasses.surface} ${themeClasses.text.success} border border-green-500/30`;
            case 'rejected':
                return `${themeClasses.surface} ${themeClasses.text.error} border border-red-500/30`;
            case 'not_uploaded':
                return `${themeClasses.surface} ${themeClasses.text.muted} border ${themeClasses.border}`;
            default:
                return `${themeClasses.surface} ${themeClasses.text.muted} border ${themeClasses.border}`;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
                return 'ri-check-line';
            case 'rejected':
                return 'ri-close-line';
            case 'pending':
                return 'ri-time-line';
            case 'not_uploaded':
                return 'ri-upload-line';
            default:
                return 'ri-question-line';
        }
    };

    const openVerificationModal = (documentType, applicationId) => {
        setVerificationModal({
            open: true,
            document: documentType,
            application: applicationId
        });
        setVerificationNotes('');
    };

    const renderDocumentCard = (documentType, documentData) => {
        const isUploaded = documentData && documentData.url; // Check if document has URL
        const status = documentData?.verificationStatus || (isUploaded ? 'pending' : 'not_uploaded');

        return (
            <motion.div
                key={documentType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${themeClasses.primaryCard} rounded-xl border ${themeClasses.border} shadow-sm hover:shadow-md transition-all duration-300`}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(status)}`}>
                                <i className={`${getStatusIcon(status)} text-lg`}></i>
                            </div>
                            <div>
                                <h4 className={`font-semibold ${themeClasses.text.primary}`}>{documentDisplayNames[documentType]}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                                    {status === 'not_uploaded' ? 'Not Uploaded' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isUploaded && (
                        <>
                            <div className="space-y-2 mb-4">
                                <div className={`text-sm ${themeClasses.text.secondary}`}>
                                    <span className="font-medium">File:</span> {documentData.originalName}
                                </div>
                                <div className={`text-sm ${themeClasses.text.secondary}`}>
                                    <span className="font-medium">Uploaded:</span> {new Date(documentData.uploadedAt).toLocaleString()}
                                </div>
                                {documentData.verificationNotes && (
                                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                                        <span className="font-medium">Notes:</span> {documentData.verificationNotes}
                                    </div>
                                )}
                                {documentData.verifiedAt && (
                                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                                        <span className="font-medium">Verified:</span> {new Date(documentData.verifiedAt).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => window.open(documentData.url, '_blank')}
                                    className={`flex-1 ${themeClasses.button.secondary} py-2 px-3 rounded-lg transition-colors text-sm font-medium`}
                                >
                                    <i className="ri-eye-line mr-1"></i>
                                    View
                                </button>
                                
                                {status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => openVerificationModal(documentType, applicationDocuments._id)}
                                            className="flex-1 bg-green-500/20 text-green-400 py-2 px-3 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                                        >
                                            <i className="ri-check-line mr-1"></i>
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => {
                                                openVerificationModal(documentType, applicationDocuments._id);
                                                setVerificationNotes('Document does not meet requirements. Please upload a clear, valid document.');
                                            }}
                                            className="flex-1 bg-red-500/20 text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                                        >
                                            <i className="ri-close-line mr-1"></i>
                                            Reject
                                        </button>
                                    </>
                                )}

                                {status === 'rejected' && (
                                    <button
                                        onClick={() => openVerificationModal(documentType, applicationDocuments._id)}
                                        className="flex-1 bg-green-500/20 text-green-400 py-2 px-3 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                                    >
                                        <i className="ri-check-line mr-1"></i>
                                        Re-verify
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {!isUploaded && (
                        <div className="text-center py-4">
                            <i className={`ri-upload-cloud-line text-3xl ${themeClasses.text.muted} mb-2`}></i>
                            <p className={`${themeClasses.text.secondary} text-sm`}>Document not uploaded</p>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderApplicationsList = () => (
        <div className={`${themeClasses.primaryCard} rounded-2xl shadow-lg border ${themeClasses.border} overflow-hidden`}>
            <div className={`p-6 border-b ${themeClasses.border}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>Document Verification</h3>
                    <div className="flex space-x-2">
                        {['pending', 'verified', 'rejected'].map((statusFilter) => (
                            <button
                                key={statusFilter}
                                onClick={() => setFilter(statusFilter)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === statusFilter
                                        ? themeClasses.button.primary
                                        : `${themeClasses.button.secondary} hover:${themeClasses.surfaceVariant}`
                                }`}
                            >
                                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center">
                    <i className={`ri-loader-4-line animate-spin text-2xl ${themeClasses.text.muted} mb-2`}></i>
                    <p className={themeClasses.text.secondary}>Loading applications...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="p-8 text-center">
                    <i className={`ri-file-list-3-line text-4xl ${themeClasses.text.muted} mb-4`}></i>
                    <p className={`${themeClasses.text.secondary} text-lg font-medium mb-2`}>No applications found</p>
                    <p className={themeClasses.text.muted}>No applications match the selected filter</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={themeClasses.surfaceVariant}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Student</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Application</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Course</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Status</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Submitted</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.text.muted} uppercase tracking-wider`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`${themeClasses.primaryCard} divide-y ${themeClasses.border}`}>
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
                                                {application.personalInfo?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{application.personalInfo?.name}</div>
                                                <div className="text-sm text-gray-500">{application.personalInfo?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{application.applicationNumber}</div>
                                        <div className="text-sm text-gray-500">ID: {application._id.slice(-6)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{application.academicInfo?.course}</div>
                                        <div className="text-sm text-gray-500">{application.academicInfo?.branch}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.verificationStatus || 'pending')}`}>
                                            {(application.verificationStatus || 'pending').charAt(0).toUpperCase() + (application.verificationStatus || 'pending').slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(application.submittedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedApplication(application);
                                                fetchApplicationDocuments(application._id);
                                            }}
                                            className="text-[#3B82F6] hover:text-[#2563EB] p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                            title="Review Documents"
                                        >
                                            <i className="ri-file-list-3-line"></i>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderApplicationDetail = () => {
        if (!applicationDocuments) return null;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{applicationDocuments.personalInfo?.name}</h2>
                                <p className="text-blue-100">Application: {applicationDocuments.applicationNumber}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setViewMode('list');
                                    setApplicationDocuments(null);
                                    setSelectedApplication(null);
                                }}
                                className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Course</label>
                                <p className="text-gray-900 font-medium">{applicationDocuments.academicInfo?.course}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Branch</label>
                                <p className="text-gray-900">{applicationDocuments.academicInfo?.branch}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Submitted</label>
                                <p className="text-gray-900">{new Date(applicationDocuments.submittedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Documents Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(applicationDocuments.documents).map(([documentType, documentData]) =>
                            renderDocumentCard(documentType, documentData)
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
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

            {/* Verification Modal */}
            <AnimatePresence>
                {verificationModal.open && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`${themeClasses.primaryCard} rounded-2xl shadow-2xl max-w-md w-full`}
                        >
                            <div className="p-6">
                                <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-4`}>
                                    Verify {documentDisplayNames[verificationModal.document]}
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                                            Verification Notes
                                        </label>
                                        <textarea
                                            value={verificationNotes}
                                            onChange={(e) => setVerificationNotes(e.target.value)}
                                            rows={4}
                                            className={`w-full p-3 border ${themeClasses.border} ${themeClasses.surface} ${themeClasses.text.primary} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                            placeholder="Add notes about the document verification..."
                                        />
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleVerifyDocument('verified')}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            <i className="ri-check-line mr-2"></i>
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => handleVerifyDocument('rejected')}
                                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            <i className="ri-close-line mr-2"></i>
                                            Reject
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setVerificationModal({ open: false, document: null, application: null });
                                            setVerificationNotes('');
                                        }}
                                        className={`w-full ${themeClasses.button.secondary} py-2 px-4 rounded-lg transition-colors font-medium`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentVerification;