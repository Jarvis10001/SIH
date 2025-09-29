# Payment System Setup Guide

## Overview
This guide will help you set up the Razorpay payment integration for the AcademiX system admission fee collection.

## Prerequisites
1. Razorpay account (sign up at https://razorpay.com)
2. Backend and frontend environments configured
3. MongoDB database connected

## Setup Steps

### 1. Razorpay Account Setup

1. **Create Razorpay Account:**
   - Visit https://razorpay.com and sign up
   - Complete KYC verification (required for live payments)
   - Navigate to Dashboard after verification

2. **Get API Keys:**
   - Go to Settings > API Keys
   - Generate Test Keys for development
   - Generate Live Keys for production (after KYC)
   - You'll get:
     - Key ID (starts with `rzp_test_` for test mode)
     - Key Secret (keep this secure)

### 2. Backend Configuration

1. **Environment Variables:**
   Update `backend/.env` file:
   ```env
   # Razorpay Configuration
   RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
   RAZORPAY_KEY_SECRET=your_actual_key_secret_here
   ```

2. **Install Dependencies:**
   ```bash
   cd backend
   npm install razorpay
   ```

3. **Verify Routes:**
   - Payment routes are already created in `routes/payment.js`
   - Routes are integrated in `server.js`
   - Payment model is created in `models/Payment.js`

### 3. Frontend Configuration

1. **Environment Variables:**
   Update `front/.env` file:
   ```env
   # Razorpay configuration
   VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
   ```

2. **Component Integration:**
   - PaymentPage component is created
   - Route is added to Dashboard
   - Sidebar navigation includes payment link

### 4. Database Schema Updates

The Admission model has been updated with payment-related fields:
- `paymentStatus`: pending, completed, failed, refunded
- `admissionStatus`: submitted, under_review, approved, rejected, confirmed
- `feeAmount`: default fee amount

### 5. Testing the Payment System

#### Test Mode Setup:

1. **Use Test Keys:**
   - Key ID: `rzp_test_xxxxxxxxxxxxxxx`
   - Use test key in both backend and frontend

2. **Test Payment Methods:**
   
   **For Indian Domestic Cards (Recommended):**
   - Card Number: 5267 3181 8797 5449 (Mastercard)
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)
   - Name: Any name
   
   **Alternative Indian Test Cards:**
   - Visa: 4847 1234 5678 9012
   - Rupay: 6521 1234 5678 9012
   - Mastercard: 5267 3181 8797 5449
   
   **For UPI Testing:**
   - UPI ID: success@razorpay (auto-success)
   - UPI ID: failure@razorpay (auto-failure)

3. **Test Flow:**
   1. Complete admission form
   2. Navigate to payment page
   3. Click "Pay Now"
   4. Complete test payment
   5. Verify payment status updates

#### Production Setup:

1. **KYC Completion:**
   - Complete full KYC on Razorpay
   - Get live keys approved

2. **Update Environment:**
   ```env
   # Use live keys (no _test_ prefix)
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=live_secret_key_here
   ```

### 6. API Endpoints

#### Payment Endpoints:
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/status` - Get payment status
- `GET /api/payment/history` - Get payment history
- `POST /api/payment/refund/:paymentId` - Process refund (admin)

#### Admission Integration:
- `GET /api/admission/status` - Check admission form status

### 7. Security Considerations

1. **Environment Variables:**
   - Never commit actual keys to version control
   - Use different keys for development/production
   - Keep secret keys secure

2. **Payment Verification:**
   - Always verify payments on backend
   - Use signature verification for security
   - Store payment details securely

3. **Error Handling:**
   - Handle payment failures gracefully
   - Provide clear error messages
   - Log payment attempts for debugging

### 8. Customization Options

#### Fee Structure:
Update in `PaymentPage.jsx`:
```javascript
const [fees, setFees] = useState({
    admissionFee: 5000,       // Test amount: ₹5,000
    registrationFee: 500,     // Test amount: ₹500  
    securityDeposit: 1000,    // Test amount: ₹1,000
    total: 6500               // Total test amount: ₹6,500
});
```

**Important Notes:**
- Test mode has a maximum payment limit of ₹50,000
- For testing, use smaller amounts (₹100 - ₹10,000)
- Production amounts can be higher after KYC completion
    registrationFee: 5000,
    securityDeposit: 10000,
    total: 65000
});
```

#### Payment Methods:
Configure in Razorpay dashboard:
- Cards (Visa, Mastercard, Rupay)
- Net Banking
- UPI
- Wallets
- EMI options

### 9. Webhook Setup (Optional)

For production environments, set up webhooks for payment notifications:

1. **Razorpay Dashboard:**
   - Go to Settings > Webhooks
   - Add endpoint: `https://yourdomain.com/api/payment/webhook`
   - Select events: payment.captured, payment.failed

2. **Backend Handler:**
   Create webhook handler in payment routes for automatic payment updates.

### 10. Troubleshooting

#### Common Issues:

1. **Invalid Key Error:**
   - Verify key format (test keys have `rzp_test_` prefix)
   - Check environment variable names

2. **Payment Verification Failed:**
   - Ensure secret key matches the key ID
   - Check signature generation logic

3. **CORS Issues:**
   - Ensure CORS is properly configured for Razorpay domain
   - Check frontend-backend URL configuration

3. **"Amount exceeds maximum allowed" Error:**
   - Razorpay test mode has a limit of ₹50,000 per transaction
   - Reduce payment amount for testing (use ₹100 - ₹10,000)
   - Current test amount is set to ₹6,500 which is within limits
   - For higher amounts, complete KYC and use live mode

#### Debug Mode:
Enable detailed logging by setting:
```env
VITE_DEBUG_MODE=true
```

### 11. Go-Live Checklist

Before going live:
- [ ] KYC completed on Razorpay
- [ ] Live API keys generated
- [ ] Test payments working in test mode
- [ ] Environment variables updated for production
- [ ] SSL certificate installed (HTTPS required)
- [ ] Webhook endpoints configured
- [ ] Error handling tested
- [ ] Payment flow tested end-to-end

### 12. Support

For technical issues:
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Test payment details: https://razorpay.com/docs/payments/test-payments/

## Quick Start Commands

```bash
# Backend setup
cd backend
npm install razorpay
# Update .env with your keys
npm start

# Frontend setup  
cd front
# Update .env with your key ID
npm run dev

# Test the payment flow
# 1. Navigate to http://localhost:5173
# 2. Login/signup
# 3. Complete admission form
# 4. Go to payment page
# 5. Use test payment details
```

Your payment system is now ready for testing and deployment!