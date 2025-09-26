const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
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
} = require('../controllers/paymentController');

const router = express.Router();

// @route   POST /api/payment/create-order
// @desc    Create payment order
// @access  Private
router.post('/create-order', authenticate, createOrder);

// @route   POST /api/payment/verify
// @desc    Verify payment
// @access  Private
router.post('/verify', authenticate, verifyPayment);

// @route   GET /api/payment/status
// @desc    Get payment status for current user
// @access  Private
router.get('/status', authenticate, getPaymentStatus);

// @route   GET /api/payment/history
// @desc    Get user payment history
// @access  Private
router.get('/history', authenticate, getPaymentHistory);

// @route   GET /api/payment/transactions
// @desc    Get all transactions (admin only)
// @access  Private
router.get('/transactions', authenticate, getAllTransactions);

// @route   GET /api/payment/analytics
// @desc    Get payment analytics (admin only)
// @access  Private
router.get('/analytics', authenticate, getPaymentAnalytics);

// @route   GET /api/payment/transaction/:id
// @desc    Get detailed transaction information
// @access  Private
router.get('/transaction/:id', authenticate, getTransactionDetails);

// @route   GET /api/payment/summary/:id
// @desc    Get transaction summary
// @access  Private
router.get('/summary/:id', authenticate, getTransactionSummary);

// @route   GET /api/payment/:id
// @desc    Get payment details
// @access  Private
router.get('/:id', authenticate, getPaymentDetails);

// @route   POST /api/payment/webhook
// @desc    Handle payment webhook
// @access  Public (Webhook)
router.post('/webhook', handleWebhook);

module.exports = router;