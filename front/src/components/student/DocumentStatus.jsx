import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DocumentStatus = () => {
    const [documentStatus, setDocumentStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [reuploadModal, setReuploadModal] = useState({ open: false, documentType: null });
    const [uploadingDocument, setUploadingDocument] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

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
        fetchDocumentStatus();
    }, []);

    const fetchDocumentStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admission/document-status`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setDocumentStatus(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching document status:', error);
            setError('Failed to fetch document verification status');
        } finally {
            setLoading(false);
        }
    };

    const handleReuploadDocument = async () => {
        if (!selectedFile || !reuploadModal.documentType) return;

        setUploadingDocument(reuploadModal.documentType);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append(reuploadModal.documentType, selectedFile);

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admission/reupload-document/${reuploadModal.documentType}`,
                formData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                // Refresh document status
                await fetchDocumentStatus();
                setReuploadModal({ open: false, documentType: null });
                setSelectedFile(null);
                // Show success message
                setError('');
            }
        } catch (error) {
            console.error('Error reuploading document:', error);
            setError('Failed to reupload document. Please try again.');
        } finally {
            setUploadingDocument(null);
        }
    };

    const openReuploadModal = (documentType) => {
        setReuploadModal({ open: true, documentType });
        setSelectedFile(null);
        setError('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'verified':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'not_uploaded':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    const getProgressBarColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const renderDocumentCard = (documentType, documentData) => {
        const isUploaded = documentData.uploaded;
        const status = documentData.verificationStatus || 'not_uploaded';

        return (
            <motion.div
                key={documentType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => isUploaded && setSelectedDocument({ type: documentType, data: documentData })}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(status)}`}>
                                <i className={`${getStatusIcon(status)} text-lg`}></i>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{documentDisplayNames[documentType]}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
                                    {status === 'not_uploaded' ? 'Not Uploaded' : status.charAt(0).toUpperCase() + status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isUploaded && (
                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">File:</span> {documentData.originalName}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Uploaded:</span> {new Date(documentData.uploadedAt).toLocaleDateString()}
                            </div>
                            {documentData.verifiedAt && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Verified:</span> {new Date(documentData.verifiedAt).toLocaleDateString()}
                                </div>
                            )}
                            {documentData.verificationNotes && (
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span> {documentData.verificationNotes}
                                </div>
                            )}
                        </div>
                    )}

                    {!isUploaded && (
                        <div className="text-center py-2">
                            <p className="text-gray-500 text-sm">Document not uploaded</p>
                        </div>
                    )}

                    {/* Reupload button for rejected documents */}
                    {isUploaded && status === 'rejected' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => openReuploadModal(documentType)}
                                disabled={uploadingDocument === documentType}
                                className="w-full bg-[#4CAF50] text-white py-2 px-4 rounded-lg hover:bg-[#45a049] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadingDocument === documentType ? (
                                    <div className="flex items-center justify-center">
                                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                                        Uploading...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <i className="ri-upload-line mr-2"></i>
                                        Reupload Document
                                    </div>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <i className="ri-loader-4-line animate-spin text-2xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600">Loading document status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
                >
                    <div className="flex items-center gap-2">
                        <i className="ri-error-warning-line"></i>
                        {error}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!documentStatus) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                    <i className="ri-file-list-3-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-600 text-lg font-medium mb-2">No application found</p>
                    <p className="text-gray-500">Please submit your admission application first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Document Verification Status</h1>
                            <p className="text-green-100">Application: {documentStatus.applicationNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-green-100">Submitted</p>
                            <p className="text-white font-semibold">{new Date(documentStatus.submittedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Student Name</label>
                            <p className="text-gray-900 font-medium">{documentStatus.personalInfo?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Course</label>
                            <p className="text-gray-900">{documentStatus.academicInfo?.course}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Branch</label>
                            <p className="text-gray-900">{documentStatus.academicInfo?.branch}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Progress */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Progress</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{documentStatus.verificationSummary.uploaded}</div>
                        <div className="text-sm text-gray-600">Uploaded</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{documentStatus.verificationSummary.verified}</div>
                        <div className="text-sm text-gray-600">Verified</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{documentStatus.verificationSummary.rejected}</div>
                        <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{documentStatus.verificationSummary.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                        <span className="text-sm font-medium text-gray-700">{documentStatus.verificationSummary.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${documentStatus.verificationSummary.completionPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-3 rounded-full ${getProgressBarColor(documentStatus.verificationSummary.completionPercentage)}`}
                        ></motion.div>
                    </div>
                </div>

                {/* Overall Status */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-medium text-gray-700">Overall Status:</span>
                            <span className={`ml-2 inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(documentStatus.verificationSummary.overallStatus)}`}>
                                {documentStatus.verificationSummary.overallStatus.charAt(0).toUpperCase() + documentStatus.verificationSummary.overallStatus.slice(1)}
                            </span>
                        </div>
                    </div>
                    {documentStatus.verificationSummary.overallNotes && (
                        <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Notes:</span>
                            <p className="text-sm text-gray-600 mt-1">{documentStatus.verificationSummary.overallNotes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Documents Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Document Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(documentStatus.documents).map(([documentType, documentData]) =>
                        renderDocumentCard(documentType, documentData)
                    )}
                </div>
            </div>

            {/* Document Detail Modal */}
            <AnimatePresence>
                {selectedDocument && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {documentDisplayNames[selectedDocument.type]}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedDocument(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedDocument.data.verificationStatus)}`}>
                                            <i className={`${getStatusIcon(selectedDocument.data.verificationStatus)} mr-1`}></i>
                                            {selectedDocument.data.verificationStatus.charAt(0).toUpperCase() + selectedDocument.data.verificationStatus.slice(1)}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">File Name:</span>
                                            <p className="text-sm text-gray-600">{selectedDocument.data.originalName}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">Uploaded:</span>
                                            <p className="text-sm text-gray-600">{new Date(selectedDocument.data.uploadedAt).toLocaleString()}</p>
                                        </div>
                                        {selectedDocument.data.verifiedAt && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Verified:</span>
                                                <p className="text-sm text-gray-600">{new Date(selectedDocument.data.verifiedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                        {selectedDocument.data.verifiedBy && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">Verified By:</span>
                                                <p className="text-sm text-gray-600">{selectedDocument.data.verifiedBy.name} ({selectedDocument.data.verifiedBy.employeeId})</p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedDocument.data.verificationNotes && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-700">Verification Notes:</span>
                                            <p className="text-sm text-gray-600 mt-1">{selectedDocument.data.verificationNotes}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setSelectedDocument(null)}
                                        className="w-full bg-[#4CAF50] text-white py-2 px-4 rounded-lg hover:bg-[#45a049] transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reupload Modal */}
            <AnimatePresence>
                {reuploadModal.open && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Reupload {documentDisplayNames[reuploadModal.documentType]}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setReuploadModal({ open: false, documentType: null });
                                            setSelectedFile(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-start">
                                            <i className="ri-error-warning-line text-red-500 mt-0.5 mr-2"></i>
                                            <div>
                                                <p className="text-sm font-medium text-red-800">Document was rejected</p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Please review the feedback and upload a corrected document.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select New Document
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4CAF50] transition-colors cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supported formats: PDF, JPG, PNG (Max 10MB)
                                        </p>
                                    </div>

                                    {selectedFile && (
                                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center">
                                                <i className="ri-file-line text-green-600 mr-2"></i>
                                                <div>
                                                    <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                                                    <p className="text-xs text-green-600">
                                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleReuploadDocument}
                                            disabled={!selectedFile || uploadingDocument}
                                            className="flex-1 bg-[#4CAF50] text-white py-2 px-4 rounded-lg hover:bg-[#45a049] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploadingDocument ? (
                                                <div className="flex items-center justify-center">
                                                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                                                    Uploading...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <i className="ri-upload-line mr-2"></i>
                                                    Upload
                                                </div>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setReuploadModal({ open: false, documentType: null });
                                                setSelectedFile(null);
                                            }}
                                            disabled={uploadingDocument}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentStatus;