import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { themeClasses, iconClasses } from '../../styles/theme';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [admissionData, setAdmissionData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState(null);
    const [fees, setFees] = useState({
        admissionFee: 5000,
        registrationFee: 500,
        securityDeposit: 1000,
        total: 6500
    });

    const inputClasses = `
        w-full p-3 rounded-xl 
        bg-gray-700 border-2 border-slate-600
        focus:border-indigo-500
        focus:ring-4 focus:ring-indigo-500/10 
        focus:bg-gray-600
        hover:border-indigo-500/30
        transition-all duration-300 ease-in-out
        text-white placeholder-slate-400
        focus:placeholder-indigo-400/70
        focus:shadow-lg focus:shadow-indigo-500/5
        outline-none
    `;

    // Check payment status and admission data on component mount
    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                setUser(userData);

                // Check if admission form is submitted
                const admissionResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admission/form`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (!admissionResponse.data.success) {
                    // Redirect to admission form if not submitted
                    navigate('/dashboard/admission');
                    return;
                }

                setAdmissionData(admissionResponse.data.admission);

                // Check payment status
                try {
                    const paymentResponse = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/payment/status`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    if (paymentResponse.data.success) {
                        setPaymentStatus(paymentResponse.data.payment);
                    }
                } catch (error) {
                    // No payment found yet, that's fine
                    if (error.response?.status !== 404) {
                        console.error('Error checking payment status:', error);
                    }
                }

            } catch (error) {
                console.error('Error in payment status check:', error);
                if (error.response?.status === 404) {
                    // No admission found, redirect to admission form
                    navigate('/dashboard/admission');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkPaymentStatus();
    }, [navigate]);

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (paymentLoading) return;
        
        setPaymentLoading(true);
        setError(null);

        try {
            // Validate required data
            if (!admissionData) {
                throw new Error('Admission data not found. Please refresh the page.');
            }

            if (!user) {
                throw new Error('User data not found. Please login again.');
            }

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load payment gateway. Please check your internet connection and try again.');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found. Please login again.');
            }

            // Create payment order
            const shortAdmissionId = admissionData._id.slice(-8);
            const shortTimestamp = Date.now().toString().slice(-6);
            const orderResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
                {
                    amount: fees.total,
                    currency: 'INR',
                    receipt: `adm_${shortAdmissionId}_${shortTimestamp}`
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message || 'Failed to create payment order');
            }

            const { order } = orderResponse.data;

            // Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'College ERP',
                description: 'Admission Fee Payment',
                image: '/logo.png',
                order_id: order.id,
                prefill: {
                    name: user?.name || admissionData?.personalInfo?.name,
                    email: user?.email || admissionData?.personalInfo?.email,
                    contact: admissionData?.personalInfo?.mobileNo
                },
                theme: {
                    color: '#3B82F6'
                },
                config: {
                    display: {
                        language: 'en'
                    }
                },
                method: {
                    card: true,
                    netbanking: true,
                    wallet: true,
                    upi: true,
                    paylater: true,
                    emi: true
                },
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyResponse = await axios.post(
                            `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            },
                            {
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );

                        if (verifyResponse.data.success) {
                            setPaymentStatus({
                                status: 'completed',
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                amount: fees.total,
                                paidAt: new Date().toISOString()
                            });
                            
                            // Show success notification
                            const successMessage = 'Payment successful! Your admission is confirmed.';
                            alert(successMessage);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        const errorMessage = error.response?.data?.message || 'Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id;
                        alert(errorMessage);
                        setError(errorMessage);
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log('Payment modal closed by user');
                        setPaymentLoading(false);
                    }
                }
            };

            // Validate Razorpay key
            if (!options.key) {
                throw new Error('Payment gateway configuration error. Please contact support.');
            }

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
            setPaymentLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`${themeClasses.pageBackground} flex items-center justify-center min-h-screen`}>
                <div className={themeClasses.loadingSpinner}></div>
            </div>
        );
    }

    if (paymentStatus && paymentStatus.status === 'completed') {
        return (
            <div className={`${themeClasses.pageBackground} min-h-screen py-10`}>
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${themeClasses.primaryCard} rounded-2xl shadow-xl border ${themeClasses.border} overflow-hidden`}
                    >
                        {/* Success Header */}
                        <div className="relative h-32 bg-gradient-to-r from-indigo-600/30 to-indigo-700/30">
                            <div className="absolute inset-0 px-8 py-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className={`text-2xl font-bold ${themeClasses.text.primary} mb-1`}>
                                            Payment Successful!
                                        </h2>
                                        <p className={`${themeClasses.text.secondary} text-sm`}>
                                            Your admission fee has been paid successfully
                                        </p>
                                    </div>
                                    <div className={`h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center`}>
                                        <i className={`ri-check-line text-2xl ${themeClasses.text.success}`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className={`w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <i className={`ri-check-line text-3xl ${themeClasses.text.success}`}></i>
                                </div>
                                <h3 className={`text-2xl font-bold ${themeClasses.text.primary} mb-2`}>Admission Confirmed!</h3>
                                <p className={themeClasses.text.secondary}>
                                    Your payment has been processed and your admission is now confirmed.
                                </p>
                            </div>

                            {/* Payment Details */}
                            <div className={`${themeClasses.surface} rounded-xl p-6 mb-6`}>
                                <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Payment Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className={`text-sm ${themeClasses.text.muted}`}>Payment ID</p>
                                        <p className={`font-medium ${themeClasses.text.primary}`}>{paymentStatus.paymentId}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${themeClasses.text.muted}`}>Order ID</p>
                                        <p className={`font-medium ${themeClasses.text.primary}`}>{paymentStatus.orderId}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${themeClasses.text.muted}`}>Amount Paid</p>
                                        <p className={`font-medium ${themeClasses.text.primary}`}>₹{paymentStatus.amount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className={`text-sm ${themeClasses.text.muted}`}>Payment Date</p>
                                        <p className={`font-medium ${themeClasses.text.primary}`}>
                                            {new Date(paymentStatus.paidAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Student Details */}
                                <div className={`mt-6 pt-6 border-t ${themeClasses.border}`}>
                                    <h5 className={`text-md font-semibold ${themeClasses.text.primary} mb-3`}>Student Details</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-sm ${themeClasses.text.muted}`}>Student Name</p>
                                            <p className={`font-medium ${themeClasses.text.primary}`}>{admissionData?.personalInfo?.name}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${themeClasses.text.muted}`}>Course</p>
                                            <p className={`font-medium ${themeClasses.text.primary}`}>{admissionData?.academicInfo?.course}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${themeClasses.text.muted}`}>Branch</p>
                                            <p className={`font-medium ${themeClasses.text.primary}`}>{admissionData?.academicInfo?.branch}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${themeClasses.text.muted}`}>Application Number</p>
                                            <p className={`font-medium ${themeClasses.text.primary}`}>{admissionData?.applicationNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className={`flex-1 ${themeClasses.button.primary} px-6 py-3 rounded-xl font-semibold transition-colors`}
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className={`px-6 py-3 ${themeClasses.button.secondary} rounded-xl font-semibold transition-colors`}
                                >
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${themeClasses.pageBackground} min-h-screen py-10`}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Error banner */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <i className={`ri-error-warning-line text-xl ${iconClasses.danger}`}></i>
                            </div>
                            <div>
                                <h4 className="text-red-300 font-medium">Payment Error</h4>
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-400 hover:text-red-300"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Notification banner */}
                <div className="mb-6 bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <i className={`ri-information-line text-xl ${iconClasses.primary}`}></i>
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Admission Fee Payment</h4>
                            <p className="text-slate-300 text-sm">
                                Complete your admission by paying the required fees. Your admission will be confirmed after successful payment.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700/30 overflow-hidden">
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-indigo-600/30 to-indigo-700/30">
                        <div className="absolute inset-0 px-8 py-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        Payment Portal
                                    </h2>
                                    <p className="text-slate-300 text-sm">
                                        Secure payment for your college admission
                                    </p>
                                </div>
                                <div className="h-12 w-12 bg-indigo-500/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                    <i className={`ri-bank-card-line text-2xl ${iconClasses.primary}`}></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Student Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm border border-slate-600/30 shadow-sm mb-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <i className={`ri-user-line text-xl ${iconClasses.primary}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-white">Student Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-slate-300 font-medium block mb-1">Student Name</label>
                                    <input
                                        type="text"
                                        value={admissionData?.personalInfo?.name || ''}
                                        className={inputClasses}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-300 font-medium block mb-1">Application ID</label>
                                    <input
                                        type="text"
                                        value={admissionData?.applicationNumber || 'N/A'}
                                        className={inputClasses}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-300 font-medium block mb-1">Course</label>
                                    <input
                                        type="text"
                                        value={admissionData?.academicInfo?.course || ''}
                                        className={inputClasses}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-300 font-medium block mb-1">Branch</label>
                                    <input
                                        type="text"
                                        value={admissionData?.academicInfo?.branch || ''}
                                        className={inputClasses}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Fee Structure */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm border border-slate-600/30 shadow-sm mb-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <i className={`ri-money-rupee-circle-line text-xl ${iconClasses.primary}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-white">Fee Structure</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-slate-600/30">
                                    <span className="text-slate-300 font-medium">Admission Fee</span>
                                    <span className="text-white font-semibold">₹{fees.admissionFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-600/30">
                                    <span className="text-slate-300 font-medium">Registration Fee</span>
                                    <span className="text-white font-semibold">₹{fees.registrationFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-600/30">
                                    <span className="text-slate-300 font-medium">Security Deposit</span>
                                    <span className="text-white font-semibold">₹{fees.securityDeposit.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 bg-indigo-500/20 rounded-lg px-4">
                                    <span className="text-white font-bold text-lg">Total Amount</span>
                                    <span className={`${iconClasses.primary} font-bold text-xl`}>₹{fees.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm border border-slate-600/30 shadow-sm mb-8"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                    <i className={`ri-secure-payment-line text-xl ${iconClasses.primary}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-white">Secure Payment</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center justify-center p-4 bg-gray-600/50 rounded-lg border border-slate-600/30">
                                    <span className="text-slate-300 text-sm font-medium">Visa</span>
                                </div>
                                <div className="flex items-center justify-center p-4 bg-gray-600/50 rounded-lg border border-slate-600/30">
                                    <span className="text-slate-300 text-sm font-medium">Mastercard</span>
                                </div>
                                <div className="flex items-center justify-center p-4 bg-gray-600/50 rounded-lg border border-slate-600/30">
                                    <span className="text-slate-300 text-sm font-medium">UPI</span>
                                </div>
                                <div className="flex items-center justify-center p-4 bg-gray-600/50 rounded-lg border border-slate-600/30">
                                    <span className="text-slate-300 text-sm font-medium">Net Banking</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-slate-400 mb-4">
                                    <i className={`ri-shield-check-line ${iconClasses.primary} mr-1`}></i>
                                    Payments are secured by SSL encryption and processed through Razorpay
                                </p>
                            </div>
                        </motion.div>

                        {/* Payment Button */}
                        <div className="pt-6 border-t border-slate-700/30">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className={`${themeClasses.primaryButton} w-full p-4 rounded-xl ${paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {paymentLoading ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin"></i>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-secure-payment-line"></i>
                                        Pay ₹{fees.total.toLocaleString()} - Secure Payment
                                    </>
                                )}
                            </span>
                        </motion.button>
                        
                        <p className="text-center mt-4 text-sm text-slate-400">
                            By proceeding with payment, you agree to our{' '}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">
                                Terms and Conditions
                            </a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">
                                Refund Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default PaymentPage;