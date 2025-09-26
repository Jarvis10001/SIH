import React from 'react';
import { motion } from 'framer-motion';

const PaymentReceipt = ({ payment, admission, onClose, onPrint }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Receipt Header */}
                <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Payment Receipt</h2>
                            <p className="text-white/90">College ERP System</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-1">
                                <span className="text-sm font-medium">Receipt #</span>
                                <div className="font-mono text-lg">{payment.id?.slice(-8).toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Payment Status */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="ri-check-line text-green-600"></i>
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-800">Payment Successful</h3>
                            <p className="text-green-600 text-sm">Your admission fee has been processed successfully</p>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Student Details</h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-500">Name:</span>
                                    <p className="font-medium">{admission?.personalInfo?.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Email:</span>
                                    <p className="font-medium">{admission?.personalInfo?.email}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Mobile:</span>
                                    <p className="font-medium">{admission?.personalInfo?.mobileNo}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Application Number:</span>
                                    <p className="font-medium">{admission?.applicationNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">Course Details</h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-500">Course:</span>
                                    <p className="font-medium">{admission?.academicInfo?.course}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Branch:</span>
                                    <p className="font-medium">{admission?.academicInfo?.branch}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500">Session:</span>
                                    <p className="font-medium">2024-25</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border border-gray-200 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Payment Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-500">Payment ID:</span>
                                <p className="font-mono text-sm">{payment.paymentId}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Order ID:</span>
                                <p className="font-mono text-sm">{payment.orderId}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Payment Method:</span>
                                <p className="font-medium capitalize">{payment.paymentMethod || 'Card/UPI'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Payment Date:</span>
                                <p className="font-medium">{formatDate(payment.paidAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="border border-gray-200 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Fee Breakdown</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span>Admission Fee</span>
                                <span>₹50,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Registration Fee</span>
                                <span>₹5,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Security Deposit</span>
                                <span>₹10,000</span>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount Paid</span>
                                <span className="text-[#4CAF50]">₹{payment.amount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• This receipt serves as proof of payment for your college admission</li>
                            <li>• Security deposit will be refunded at the time of course completion</li>
                            <li>• Please keep this receipt for your records</li>
                            <li>• For any queries, contact the admission office</li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                        <p>This is a computer-generated receipt and does not require a physical signature.</p>
                        <p className="mt-1">Generated on {formatDate(new Date())}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
                    <button
                        onClick={onPrint}
                        className="flex-1 px-4 py-2 bg-[#4CAF50] text-white rounded-xl font-semibold hover:bg-[#45a049] transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="ri-printer-line"></i>
                        Print Receipt
                    </button>
                    <button
                        onClick={() => window.navigator.share?.({
                            title: 'Payment Receipt - College ERP',
                            text: `Payment successful for ₹${payment.amount?.toLocaleString()}`,
                            url: window.location.href
                        })}
                        className="px-4 py-2 border-2 border-[#4CAF50] text-[#4CAF50] rounded-xl font-semibold hover:bg-[#4CAF50]/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="ri-share-line"></i>
                        Share
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PaymentReceipt;