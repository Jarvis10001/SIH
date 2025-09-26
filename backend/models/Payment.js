const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    admissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admission',
        required: true,
        index: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    paymentId: {
        type: String,
        index: true
    },
    signature: {
        type: String
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'INR',
        enum: ['INR', 'USD', 'EUR']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending',
        index: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'upi', 'emi']
    },
    paymentGateway: {
        type: String,
        required: true,
        default: 'razorpay'
    },
    paidAt: {
        type: Date
    },
    razorpayResponse: {
        type: mongoose.Schema.Types.Mixed // Store complete Razorpay response
    },
    
    // Complete transaction details for audit and retrieval
    transactionDetails: {
        // Original order creation details
        orderCreation: {
            timestamp: { type: Date },
            razorpayOrderId: { type: String },
            orderAmount: { type: Number },
            orderCurrency: { type: String },
            orderStatus: { type: String },
            orderReceipt: { type: String }
        },
        
        // Payment gateway interaction details
        paymentAttempts: [{
            attemptNumber: { type: Number },
            timestamp: { type: Date },
            paymentId: { type: String },
            method: { type: String }, // card, netbanking, upi, etc.
            bank: { type: String },
            wallet: { type: String },
            vpa: { type: String }, // for UPI
            cardType: { type: String }, // credit, debit
            cardNetwork: { type: String }, // visa, mastercard, etc.
            status: { type: String }, // attempted, failed, success
            errorCode: { type: String },
            errorDescription: { type: String },
            gatewayResponse: { type: mongoose.Schema.Types.Mixed }
        }],
        
        // Payment completion details
        paymentCompletion: {
            timestamp: { type: Date },
            razorpayPaymentId: { type: String },
            razorpaySignature: { type: String },
            verificationStatus: { type: String },
            verificationTimestamp: { type: Date },
            finalAmount: { type: Number },
            fees: { type: Number }, // gateway fees
            tax: { type: Number }, // tax on fees
            settlementCurrency: { type: String },
            settlementAmount: { type: Number }
        }
    },
    
    // Device and session information for security
    sessionInfo: {
        ipAddress: { type: String },
        userAgent: { type: String },
        deviceType: { type: String }, // mobile, desktop, tablet
        browser: { type: String },
        platform: { type: String }, // windows, android, ios, etc.
        screenResolution: { type: String },
        timezone: { type: String },
        language: { type: String }
    },
    
    // Status change audit trail
    statusHistory: [{
        status: { type: String },
        timestamp: { type: Date },
        reason: { type: String },
        changedBy: { type: String }, // system, admin, user
        metadata: { type: mongoose.Schema.Types.Mixed }
    }],
    
    // Fee breakdown
    feeBreakdown: {
        admissionFee: {
            type: Number,
            default: 0
        },
        registrationFee: {
            type: Number,
            default: 0
        },
        securityDeposit: {
            type: Number,
            default: 0
        },
        otherFees: {
            type: Number,
            default: 0
        }
    },

    // Refund information
    refundId: {
        type: String
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundStatus: {
        type: String,
        enum: ['none', 'pending', 'processed', 'failed'],
        default: 'none'
    },
    refundReason: {
        type: String
    },
    refundedAt: {
        type: Date
    },

    // Additional metadata
    receipt: {
        type: String
    },
    notes: {
        type: mongoose.Schema.Types.Mixed
    },
    
    // Audit fields
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ admissionId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ paidAt: -1 });

// Add pagination plugin
paymentSchema.plugin(mongoosePaginate);

// Virtual for net amount (after refund)
paymentSchema.virtual('netAmount').get(function() {
    return this.amount - this.refundAmount;
});

// Virtual for payment receipt URL
paymentSchema.virtual('receiptUrl').get(function() {
    if (this.paymentId && this.status === 'completed') {
        return `/api/payment/receipt/${this._id}`;
    }
    return null;
});

// Pre-save middleware
paymentSchema.pre('save', function(next) {
    // Track status changes in history
    if (this.isModified('status')) {
        if (!this.statusHistory) {
            this.statusHistory = [];
        }
        
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
            reason: this.statusChangeReason || 'Status updated',
            changedBy: this.statusChangedBy || 'system',
            metadata: this.statusChangeMetadata || {}
        });
    }
    
    // Auto-calculate fee breakdown if not provided
    if (this.isNew && !this.feeBreakdown.admissionFee && this.amount) {
        // Default breakdown if not specified
        this.feeBreakdown = {
            admissionFee: Math.floor(this.amount * 0.77), // 77%
            registrationFee: Math.floor(this.amount * 0.08), // 8%
            securityDeposit: Math.floor(this.amount * 0.15), // 15%
            otherFees: 0
        };
    }
    
    // Initialize transaction details if new
    if (this.isNew) {
        this.transactionDetails = {
            orderCreation: {
                timestamp: new Date(),
                orderAmount: this.amount,
                orderCurrency: this.currency || 'INR'
            },
            paymentAttempts: [],
            paymentCompletion: {}
        };
        
        // Initialize status history for new payments
        if (!this.statusHistory) {
            this.statusHistory = [{
                status: this.status,
                timestamp: new Date(),
                reason: 'Payment record created',
                changedBy: 'system',
                metadata: { created: true }
            }];
        }
    }
    
    next();
});

// Instance methods
paymentSchema.methods.isCompleted = function() {
    return this.status === 'completed' && this.paymentId;
};

paymentSchema.methods.canRefund = function() {
    return this.status === 'completed' && 
           this.refundStatus === 'none' && 
           this.amount > this.refundAmount;
};

paymentSchema.methods.addPaymentAttempt = function(attemptData) {
    if (!this.transactionDetails.paymentAttempts) {
        this.transactionDetails.paymentAttempts = [];
    }
    
    const attemptNumber = this.transactionDetails.paymentAttempts.length + 1;
    this.transactionDetails.paymentAttempts.push({
        attemptNumber,
        timestamp: new Date(),
        ...attemptData
    });
    
    return this.save();
};

paymentSchema.methods.updateOrderCreation = function(orderData) {
    this.transactionDetails.orderCreation = {
        ...this.transactionDetails.orderCreation,
        timestamp: new Date(),
        ...orderData
    };
    return this.save();
};

paymentSchema.methods.completePayment = function(completionData) {
    this.transactionDetails.paymentCompletion = {
        timestamp: new Date(),
        verificationTimestamp: new Date(),
        ...completionData
    };
    
    this.status = 'completed';
    this.paidAt = new Date();
    this.statusChangeReason = 'Payment completed successfully';
    this.statusChangedBy = 'system';
    
    return this.save();
};

paymentSchema.methods.setSessionInfo = function(sessionData) {
    this.sessionInfo = {
        ...this.sessionInfo,
        ...sessionData,
        timestamp: new Date()
    };
    return this.save();
};

paymentSchema.methods.changeStatus = function(newStatus, reason, changedBy = 'system', metadata = {}) {
    this.status = newStatus;
    this.statusChangeReason = reason;
    this.statusChangedBy = changedBy;
    this.statusChangeMetadata = metadata;
    return this.save();
};

paymentSchema.methods.getReceiptData = function() {
    return {
        id: this._id,
        orderId: this.orderId,
        paymentId: this.paymentId,
        amount: this.amount,
        currency: this.currency,
        status: this.status,
        paidAt: this.paidAt,
        feeBreakdown: this.feeBreakdown,
        refundAmount: this.refundAmount,
        netAmount: this.netAmount,
        transactionDetails: this.transactionDetails,
        statusHistory: this.statusHistory
    };
};

paymentSchema.methods.getTransactionSummary = function() {
    return {
        paymentId: this._id,
        orderId: this.orderId,
        razorpayPaymentId: this.paymentId,
        amount: this.amount,
        status: this.status,
        paymentMethod: this.transactionDetails?.paymentCompletion?.method || 'unknown',
        createdAt: this.createdAt,
        completedAt: this.paidAt,
        attempts: this.transactionDetails?.paymentAttempts?.length || 0,
        lastAttempt: this.transactionDetails?.paymentAttempts?.slice(-1)[0] || null
    };
};

// Static methods
paymentSchema.statics.findByUserId = function(userId, options = {}) {
    const query = this.find({ userId });
    
    if (options.status) {
        query.where('status', options.status);
    }
    
    if (options.populate) {
        query.populate(options.populate);
    }
    
    return query.sort({ createdAt: -1 });
};

paymentSchema.statics.getPaymentStats = async function(userId) {
    const stats = await this.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$amount' }
            }
        }
    ]);
    
    return stats.reduce((acc, stat) => {
        acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount
        };
        return acc;
    }, {});
};

module.exports = mongoose.model('Payment', paymentSchema);