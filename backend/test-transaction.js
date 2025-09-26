const mongoose = require('mongoose');
const Payment = require('./models/Payment');
require('dotenv').config();

// Test transaction storage functionality
async function testTransactionStorage() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create a test payment
        const testPayment = new Payment({
            userId: new mongoose.Types.ObjectId(),
            admissionId: new mongoose.Types.ObjectId(),
            orderId: 'test_order_' + Date.now(),
            amount: 65000,
            currency: 'INR',
            status: 'pending',
            paymentGateway: 'razorpay',
            receipt: 'test_receipt_123'
        });

        console.log('Creating test payment...');
        await testPayment.save();
        console.log('✅ Payment created with ID:', testPayment._id);

        // Test order creation update
        console.log('Testing order creation update...');
        await testPayment.updateOrderCreation({
            razorpayOrderId: 'order_test_123',
            orderAmount: 65000,
            orderCurrency: 'INR',
            orderStatus: 'created'
        });
        console.log('✅ Order creation details updated');

        // Test session info update
        console.log('Testing session info update...');
        await testPayment.setSessionInfo({
            ipAddress: '192.168.1.1',
            userAgent: 'Test User Agent',
            deviceType: 'desktop',
            browser: 'Chrome',
            platform: 'Windows'
        });
        console.log('✅ Session info updated');

        // Test payment attempt
        console.log('Testing payment attempt logging...');
        await testPayment.addPaymentAttempt({
            paymentId: 'pay_test_123',
            method: 'card',
            bank: 'HDFC',
            cardType: 'credit',
            cardNetwork: 'visa',
            status: 'success'
        });
        console.log('✅ Payment attempt logged');

        // Test payment completion
        console.log('Testing payment completion...');
        await testPayment.completePayment({
            razorpayPaymentId: 'pay_test_123',
            razorpaySignature: 'signature_test_123',
            verificationStatus: 'verified',
            finalAmount: 65000
        });
        console.log('✅ Payment completed');

        // Test status change
        console.log('Testing status change...');
        await testPayment.changeStatus('completed', 'Payment successful', 'system', { test: true });
        console.log('✅ Status changed');

        // Retrieve and display the payment with all details
        const fullPayment = await Payment.findById(testPayment._id);
        console.log('\n📊 Transaction Summary:');
        console.log('ID:', fullPayment._id);
        console.log('Status:', fullPayment.status);
        console.log('Amount:', fullPayment.amount);
        console.log('Status History Length:', fullPayment.statusHistory?.length || 0);
        console.log('Payment Attempts:', fullPayment.transactionDetails?.paymentAttempts?.length || 0);
        console.log('Session Info Present:', !!fullPayment.sessionInfo);
        console.log('Order Creation Present:', !!fullPayment.transactionDetails?.orderCreation);
        console.log('Payment Completion Present:', !!fullPayment.transactionDetails?.paymentCompletion);

        // Test transaction summary method
        const summary = fullPayment.getTransactionSummary();
        console.log('\n📋 Transaction Summary Method:');
        console.log(JSON.stringify(summary, null, 2));

        // Clean up test data
        console.log('\n🧹 Cleaning up test data...');
        await Payment.findByIdAndDelete(testPayment._id);
        console.log('✅ Test payment deleted');

        console.log('\n🎉 All transaction storage tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the test
testTransactionStorage();