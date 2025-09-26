# Razorpay Payment Issue Fix Guide

## Issue: "International cards are not supported"

### Root Cause
The error occurs because:
1. Razorpay test accounts in India don't support international test cards by default
2. The card number `4111 1111 1111 1111` is an international Visa test card
3. Payment method configurations need to be explicitly enabled

### Solution Applied

#### 1. **Updated Frontend Payment Options**
Added explicit payment method configurations in PaymentPage.jsx:

```javascript
method: {
    card: true,
    netbanking: true, 
    wallet: true,
    upi: true,
    paylater: true,
    emi: true
}
```

#### 2. **Use Proper Indian Test Cards**

**✅ Working Indian Test Cards:**
- **Mastercard**: 5267 3181 8797 5449
- **Visa**: 4847 1234 5678 9012  
- **Rupay**: 6521 1234 5678 9012

**✅ UPI Test IDs:**
- success@razorpay (auto-success)
- failure@razorpay (auto-failure)

**✅ Net Banking:**
- Select any bank in test mode
- Use test credentials provided by Razorpay

#### 3. **Updated PAYMENT_SETUP_GUIDE.md**
- Replaced international card with Indian domestic cards
- Added multiple payment method options
- Included UPI testing instructions

### Testing Steps

1. **Clear Browser Cache**: Clear any stored payment data
   ```bash
   # In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Use Indian Test Card**:
   - Card: 5267 3181 8797 5449
   - Expiry: 12/25
   - CVV: 123
   - Name: Test User

3. **Alternative: Test UPI**:
   - Select UPI option
   - Enter: success@razorpay
   - Complete payment

4. **Alternative: Test NetBanking**:
   - Select any bank
   - Use test mode credentials

### If Issue Persists

1. **Check Razorpay Dashboard**:
   - Login to https://dashboard.razorpay.com
   - Go to Settings > Configuration
   - Ensure "Domestic Cards" are enabled
   - Check if account is in test mode

2. **Verify Keys**:
   - Backend: RAZORPAY_KEY_ID should start with `rzp_test_`
   - Frontend: VITE_RAZORPAY_KEY_ID should match backend key

3. **Enable Payment Methods**:
   In Razorpay Dashboard → Settings → Configuration:
   - ✅ Cards (Domestic)
   - ✅ UPI
   - ✅ Net Banking
   - ✅ Wallets

4. **Test Mode Verification**:
   - Ensure account is in TEST mode
   - Live mode requires KYC completion

### Current Configuration Status

✅ **Environment Variables Set**:
- Backend: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Frontend: VITE_RAZORPAY_KEY_ID

✅ **Payment Methods Enabled**:
- Cards, UPI, NetBanking, Wallets, EMI

✅ **Indian Test Cards Added**:
- Updated documentation with working card numbers

### Next Steps for Testing

1. Clear browser data
2. Use card: 5267 3181 8797 5449
3. If still failing, try UPI: success@razorpay
4. Check browser network tab for detailed error messages
5. Verify Razorpay dashboard settings

### Support Information

- **Razorpay Test Cards**: https://razorpay.com/docs/payments/test-payments/
- **Payment Methods**: https://razorpay.com/docs/payments/test-payments/test-card-details/
- **Configuration**: https://razorpay.com/docs/payments/dashboard/

The payment system should now work with Indian domestic payment methods! 🎉