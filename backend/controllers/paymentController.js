const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Admission = require('../models/Admission');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create payment order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        const userId = req.user.id;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Check if user has submitted admission form
        const admission = await Admission.findOne({ userId });
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission form not found. Please submit admission form first.'
            });
        }

        // Check if payment already exists for this admission
        const existingPayment = await Payment.findOne({ 
            userId, 
            admissionId: admission._id,
            status: 'completed'
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed for this admission'
            });
        }

        // Create Razorpay order
        const shortReceipt = receipt || `adm_${admission._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`;
        const orderOptions = {
            amount: amount * 100, // Convert to paisa
            currency,
            receipt: shortReceipt.substring(0, 40), // Ensure max 40 characters
            notes: {
                userId: userId.toString(),
                admissionId: admission._id.toString(),
                purpose: 'admission_fee'
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        // Create payment record in database with comprehensive tracking
        const payment = new Payment({
            userId,
            admissionId: admission._id,
            orderId: order.id,
            amount: amount,
            currency,
            status: 'pending',
            paymentGateway: 'razorpay',
            receipt: order.receipt,
            notes: {
                userId: userId.toString(),
                admissionId: admission._id.toString(),
                purpose: 'admission_fee'
            }
        });

        // Update order creation details
        await payment.updateOrderCreation({
            razorpayOrderId: order.id,
            orderAmount: order.amount,
            orderCurrency: order.currency,
            orderStatus: order.status,
            orderReceipt: order.receipt
        });

        // Capture session information if available from request
        const sessionInfo = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date()
        };
        await payment.setSessionInfo(sessionInfo);

        res.json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt
            },
            paymentId: payment._id
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment verification data'
            });
        }

        // Create signature verification string
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        // Verify signature
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Find payment record
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        // Store complete payment completion details
        const completionData = {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            verificationStatus: 'verified',
            finalAmount: payment.amount
        };

        // Complete the payment with full transaction details
        await payment.completePayment(completionData);

        // Store the complete Razorpay response for audit
        payment.razorpayResponse = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            verification_timestamp: new Date(),
            verification_success: true
        };

        // Update payment fields
        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;

        await payment.save();

        // Update admission status
        await Admission.findByIdAndUpdate(
            payment.admissionId,
            { 
                paymentStatus: 'completed',
                paymentDate: new Date()
            }
        );

        res.json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
                id: payment._id,
                amount: payment.amount,
                status: payment.status,
                paidAt: payment.paidAt
            }
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// @desc    Get payment details
// @route   GET /api/payment/:id
// @access  Private
const getPaymentDetails = async (req, res) => {
    try {
        const paymentId = req.params.id;
        const userId = req.user.id;

        const payment = await Payment.findOne({ 
            _id: paymentId, 
            userId 
        }).populate('admissionId', 'personalInfo courseDetails');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            payment
        });

    } catch (error) {
        console.error('Get payment details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details',
            error: error.message
        });
    }
};

// @desc    Get payment status for current user
// @route   GET /api/payment/status  
// @access  Private
const getPaymentStatus = async (req, res) => {
    try {
        const userId = req.user.id;

        // Check if user has submitted admission form
        const admission = await Admission.findOne({ userId });
        if (!admission) {
            return res.status(404).json({
                success: false,
                message: 'Admission form not found'
            });
        }

        // Find the latest payment for this user's admission
        const payment = await Payment.findOne({ 
            userId, 
            admissionId: admission._id
        }).sort({ createdAt: -1 });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'No payment found'
            });
        }

        res.json({
            success: true,
            payment: {
                id: payment._id,
                status: payment.status,
                amount: payment.amount,
                currency: payment.currency,
                paymentId: payment.paymentId,
                orderId: payment.orderId,
                paidAt: payment.paidAt,
                createdAt: payment.createdAt
            }
        });

    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment status',
            error: error.message
        });
    }
};

// @desc    Get all transactions (admin access)
// @route   GET /api/payment/transactions
// @access  Private (Admin)
const getAllTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            paymentMethod,
            dateFrom,
            dateTo,
            search
        } = req.query;

        // Build filter query
        const filter = {};
        
        if (status) filter.status = status;
        if (paymentMethod) filter.paymentMethod = paymentMethod;
        
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
        }

        // Search functionality
        if (search) {
            filter.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { paymentId: { $regex: search, $options: 'i' } },
                { receipt: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                {
                    path: 'userId',
                    select: 'name email'
                },
                {
                    path: 'admissionId',
                    select: 'personalInfo.name applicationNumber academicInfo.course'
                }
            ]
        };

        const payments = await Payment.paginate(filter, options);

        // Transform data for response
        const transactions = payments.docs.map(payment => ({
            id: payment._id,
            orderId: payment.orderId,
            paymentId: payment.paymentId,
            amount: payment.amount,
            status: payment.status,
            paymentMethod: payment.paymentMethod,
            gateway: payment.paymentGateway,
            createdAt: payment.createdAt,
            paidAt: payment.paidAt,
            user: payment.userId,
            admission: payment.admissionId,
            attempts: payment.transactionDetails?.paymentAttempts?.length || 0,
            lastStatusChange: payment.statusHistory?.slice(-1)[0] || null
        }));

        res.json({
            success: true,
            transactions,
            pagination: {
                currentPage: payments.page,
                totalPages: payments.totalPages,
                totalTransactions: payments.totalDocs,
                hasNext: payments.hasNextPage,
                hasPrev: payments.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Get all transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions',
            error: error.message
        });
    }
};

// @desc    Get detailed transaction information
// @route   GET /api/payment/transaction/:id
// @access  Private
const getTransactionDetails = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.user.id;

        // Find payment with full details
        const payment = await Payment.findById(transactionId)
            .populate('userId', 'name email')
            .populate('admissionId', 'personalInfo applicationNumber academicInfo');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Check if user has access to this transaction
        if (payment.userId._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Return comprehensive transaction details
        const transactionDetails = {
            id: payment._id,
            orderId: payment.orderId,
            paymentId: payment.paymentId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            paymentMethod: payment.paymentMethod,
            paymentGateway: payment.paymentGateway,
            receipt: payment.receipt,
            createdAt: payment.createdAt,
            paidAt: payment.paidAt,
            
            // User and admission info
            user: payment.userId,
            admission: payment.admissionId,
            
            // Fee breakdown
            feeBreakdown: payment.feeBreakdown,
            
            // Complete transaction trail
            transactionDetails: payment.transactionDetails,
            statusHistory: payment.statusHistory,
            sessionInfo: payment.sessionInfo,
            
            // Refund information
            refundInfo: {
                refundId: payment.refundId,
                refundAmount: payment.refundAmount,
                refundStatus: payment.refundStatus,
                refundReason: payment.refundReason,
                refundedAt: payment.refundedAt
            },
            
            // Gateway response
            razorpayResponse: payment.razorpayResponse,
            
            // Calculated fields
            netAmount: payment.netAmount,
            isCompleted: payment.isCompleted(),
            canRefund: payment.canRefund()
        };

        res.json({
            success: true,
            transaction: transactionDetails
        });

    } catch (error) {
        console.error('Get transaction details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction details',
            error: error.message
        });
    }
};

// @desc    Get transaction summary
// @route   GET /api/payment/summary/:id
// @access  Private
const getTransactionSummary = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const userId = req.user.id;

        const payment = await Payment.findById(transactionId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        // Check access
        if (payment.userId.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const summary = payment.getTransactionSummary();

        res.json({
            success: true,
            summary
        });

    } catch (error) {
        console.error('Get transaction summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction summary',
            error: error.message
        });
    }
};

// @desc    Get payment analytics
// @route   GET /api/payment/analytics
// @access  Private (Admin)
const getPaymentAnalytics = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;
        
        // Build date filter
        const dateFilter = {};
        if (dateFrom || dateTo) {
            dateFilter.createdAt = {};
            if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
        }

        // Get overall statistics
        const totalStats = await Payment.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    completedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    completedAmount: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] }
                    },
                    failedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                    },
                    pendingTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    averageAmount: { $avg: '$amount' }
                }
            }
        ]);

        // Get status breakdown
        const statusBreakdown = await Payment.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        // Get payment method breakdown
        const methodBreakdown = await Payment.aggregate([
            { $match: { ...dateFilter, status: 'completed' } },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        // Get daily transaction trends
        const dailyTrends = await Payment.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    transactions: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    completedTransactions: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Calculate success rate
        const stats = totalStats[0] || {
            totalTransactions: 0,
            totalAmount: 0,
            completedTransactions: 0,
            completedAmount: 0,
            failedTransactions: 0,
            pendingTransactions: 0,
            averageAmount: 0
        };

        const successRate = stats.totalTransactions > 0 
            ? (stats.completedTransactions / stats.totalTransactions * 100).toFixed(2)
            : 0;

        res.json({
            success: true,
            analytics: {
                summary: {
                    ...stats,
                    successRate: parseFloat(successRate)
                },
                statusBreakdown,
                methodBreakdown,
                dailyTrends,
                dateRange: {
                    from: dateFrom || 'All time',
                    to: dateTo || 'Present'
                }
            }
        });

    } catch (error) {
        console.error('Get payment analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment analytics',
            error: error.message
        });
    }
};

// @desc    Get user payment history
// @route   GET /api/payment/history
// @access  Private
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const payments = await Payment.find({ userId })
            .populate('admissionId', 'personalInfo courseDetails')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
};

// @desc    Handle payment webhook
// @route   POST /api/payment/webhook
// @access  Public (Webhook)
const handleWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const receivedSignature = req.headers['x-razorpay-signature'];

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (receivedSignature !== expectedSignature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid webhook signature'
            });
        }

        const { event, payload } = req.body;

        // Handle different webhook events
        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured(payload.payment.entity);
                break;
            case 'payment.failed':
                await handlePaymentFailed(payload.payment.entity);
                break;
            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        res.json({
            success: true,
            message: 'Webhook processed successfully'
        });

    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook processing failed',
            error: error.message
        });
    }
};

// Helper function to handle payment captured
const handlePaymentCaptured = async (paymentEntity) => {
    try {
        const payment = await Payment.findOne({ 
            paymentId: paymentEntity.id 
        });

        if (payment && payment.status !== 'completed') {
            // Add payment attempt details
            const attemptData = {
                paymentId: paymentEntity.id,
                method: paymentEntity.method,
                bank: paymentEntity.bank,
                wallet: paymentEntity.wallet,
                vpa: paymentEntity.vpa,
                cardType: paymentEntity.card?.type,
                cardNetwork: paymentEntity.card?.network,
                status: 'success',
                gatewayResponse: paymentEntity
            };
            
            await payment.addPaymentAttempt(attemptData);
            
            // Complete payment with full details
            const completionData = {
                razorpayPaymentId: paymentEntity.id,
                verificationStatus: 'webhook_confirmed',
                finalAmount: paymentEntity.amount / 100, // Convert from paisa
                fees: paymentEntity.fee / 100,
                tax: paymentEntity.tax / 100,
                settlementCurrency: paymentEntity.currency,
                settlementAmount: (paymentEntity.amount - paymentEntity.fee) / 100
            };
            
            await payment.completePayment(completionData);

            // Update admission status
            await Admission.findByIdAndUpdate(
                payment.admissionId,
                { 
                    paymentStatus: 'completed',
                    paymentDate: payment.paidAt
                }
            );
            
            console.log(`Payment ${payment._id} captured successfully via webhook`);
        }
    } catch (error) {
        console.error('Handle payment captured error:', error);
    }
};

// Helper function to handle payment failed
const handlePaymentFailed = async (paymentEntity) => {
    try {
        const payment = await Payment.findOne({ 
            paymentId: paymentEntity.id 
        });

        if (payment) {
            // Add failed payment attempt
            const attemptData = {
                paymentId: paymentEntity.id,
                method: paymentEntity.method,
                bank: paymentEntity.bank,
                status: 'failed',
                errorCode: paymentEntity.error_code,
                errorDescription: paymentEntity.error_description,
                gatewayResponse: paymentEntity
            };
            
            await payment.addPaymentAttempt(attemptData);
            
            // Update payment status
            await payment.changeStatus(
                'failed', 
                `Payment failed: ${paymentEntity.error_description}`,
                'webhook',
                { errorCode: paymentEntity.error_code }
            );
            
            console.log(`Payment ${payment._id} failed via webhook: ${paymentEntity.error_description}`);
        }
    } catch (error) {
        console.error('Handle payment failed error:', error);
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentDetails,
    getPaymentHistory,
    getPaymentStatus,
    getAllTransactions,
    getTransactionDetails,
    getTransactionSummary,
    getPaymentAnalytics,
    handleWebhook
};