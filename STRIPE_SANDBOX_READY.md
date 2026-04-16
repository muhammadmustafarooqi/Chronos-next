# 🎯 STRIPE SANDBOX VERIFIED & EMAIL SETUP GUIDE

**Status:** April 16, 2026  
**Stripe:** ✅ **WORKING** (Test credentials verified)  
**Email:** ⚠ **REQUIRES GMAIL APP PASSWORD**

---

## ✅ STRIPE SANDBOX VERIFICATION COMPLETE

```
✓ Stripe Public Key: VERIFIED
✓ Stripe Secret Key: VERIFIED
✓ Account Connected: muhammadmustafafarooqi.296@gmail.com
✓ Test Payment Intent Created: pi_3TMYhrE5y72NecjM04JMPPSa
✓ Status: READY FOR TESTING
```

**Note:** Your account shows "Charges Enabled: NO" — This is normal for new accounts. Once you complete verification, it will enable automatically.

---

## 📧 GMAIL APP PASSWORD SETUP (REQUIRED)

For Gmail to work with your app, you need an **App Password** (NOT your regular Gmail password):

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. In "Signing in to Google," select "2-Step Verification"
3. Follow prompts (may require phone verification)
4. ✓ Enable it

### Step 2: Generate App Password
1. Go to: https://support.google.com/accounts/answer/185833
2. **App:** Select "Mail"
3. **Device:** Select "Windows Computer"
4. Click "Generate"
5. **Copy the 16-character password** (example: `xxxx xxxx xxxx xxxx`)

### Step 3: Update `.env` File
```bash
# server/.env
SMTP_USER=jackcartersmith1@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Your 16-char app password
```

### Step 4: Verify
```bash
cd server
node test-stripe-email.js
```

---

## 🧪 TESTING STRIPE PAYMENT FLOW

### Test Card Credentials (Sandbox Only)
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** `12/25`
- **CVC:** `123`
- **Billing Zip:** `12345` (any 5 digits)

### Manual Payment Test
1. **Start Server:** `npm run dev` (in server directory)
2. **Create Order via API**
3. **Create Payment Intent:** 
   ```bash
   curl -X POST http://localhost:5000/api/payments/create-intent \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"orderId":"TEST-001"}'
   ```
4. **Confirm Payment:** Use Stripe.js in frontend with test card

### View in Stripe Dashboard
1. Go to: https://dashboard.stripe.com
2. **Toggle to TEST MODE** (top-right corner)
3. Go to **Payments**
4. You should see payment intent: `pi_3TMYhrE5y72NecjM04JMPPSa`

---

## ✨ AFTER EMAIL SETUP COMPLETE

Once you've set the Gmail app password and re-run `test-stripe-email.js`, you'll have:

✅ Stripe Sandbox: READY  
✅ Gmail Email: READY  
✅ Full Payment Testing: READY  
✅ Backend Server: READY

---

## 🚀 THEN: SENDGRID PRODUCTION SETUP

After testing with Gmail, we'll configure **SendGrid** for production:

1. Create SendGrid account: https://sendgrid.com
2. Verify sender email/domain
3. Generate API key
4. Update `.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.your-sendgrid-api-key
   ```

---

## 📋 QUICK CHECKLIST

- [ ] Gmail account: `jackcartersmith1@gmail.com` ✓
- [ ] 2FA enabled on Google account
- [ ] Gmail app password generated (16 characters)
- [ ] Updated `.env` with app password
- [ ] Run `node test-stripe-email.js` again
- [ ] Both show ✓ READY
- [ ] Start server: `npm run dev`
- [ ] Test payment with Stripe test card

---

## 🔧 TROUBLESHOOTING

### "Gmail connection failed"
- [ ] Check app password is 16 characters
- [ ] Verify 2-Step Verification is enabled
- [ ] Try generating a new app password
- [ ] Ensure email address is correct: `jackcartersmith1@gmail.com`

### "Stripe connection failed"
- [ ] Verify keys start with `pk_test_` and `sk_test_`
- [ ] Check internet connection
- [ ] Keys are copied correctly (no extra spaces)

### "Payment intent fails"
- [ ] Test keys must be in sandbox mode
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Check order exists in database
- [ ] Verify JWT token is valid

---

## 📞 NEXT CALL

Once Gmail is set up and both tests pass:
1. ✅ Start payment testing
2. ✅ Test email sending
3. ⏭️ Then set up SendGrid for production

---

**Ready to set up Gmail app password?** 👉 Follow steps above and let me know when done!
