# 🎯 PAYMENT & EMAIL SETUP COMPLETION CHECKLIST

**Status:** Ready for Configuration  
**Estimated Setup Time:** 45-60 minutes  
**Last Updated:** April 15, 2026

---

## Phase 1: Initial Verification ✅ COMPLETED

- [x] Stripe package added to dependencies
- [x] Payment routes created and integrated
- [x] Webhook handler configured
- [x] Order model updated with payment fields
- [x] Email templates created
- [x] Configuration documentation written

---

## Phase 2: Email Service Setup (Choose One)

### Option A: Gmail (Recommended for Development)
- [ ] Go to https://myaccount.google.com/security
- [ ] Enable "2-Step Verification"
- [ ] Go to https://support.google.com/accounts/answer/185833
- [ ] Generate app-specific password (16 characters)
- [ ] Update `.env`:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=xxxx xxxx xxxx xxxx
  SMTP_FROM=Chronos Support <noreply@chronos.luxury>
  ```
- [ ] Test: `node verify-payment-email.js`

### Option B: SendGrid (Recommended for Production)
- [ ] Sign up at https://sendgrid.com
- [ ] Create API key under Settings > API Keys
- [ ] Verify sender domain
- [ ] Update `.env`:
  ```env
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASS=SG.your-api-key
  SMTP_FROM=Chronos Support <noreply@chronos.luxury>
  ```
- [ ] Test: `node verify-payment-email.js`

### Option C: Mailgun (Alternative)
- [ ] Sign up at https://www.mailgun.com
- [ ] Add and verify domain
- [ ] Get SMTP credentials
- [ ] Update `.env`:
  ```env
  SMTP_HOST=smtp.mailgun.org
  SMTP_PORT=587
  SMTP_USER=postmaster@your-domain.mailgun.org
  SMTP_PASS=your-mailgun-password
  SMTP_FROM=Chronos Support <noreply@chronos.luxury>
  ```
- [ ] Test: `node verify-payment-email.js`

---

## Phase 3: Stripe Account Setup

### Create Stripe Account
- [ ] Go to https://stripe.com
- [ ] Click "Start Now"
- [ ] Complete verification
- [ ] Access Dashboard

### Get API Keys
- [ ] Go to Developers > API keys
- [ ] Copy **Publishable Key** (pk_live_xxxxx)
- [ ] Copy **Secret Key** (sk_live_xxxxx)
- [ ] **FOR DEVELOPMENT:** Toggle to "Test mode" and use test keys (pk_test_, sk_test_)

### Update Environment
- [ ] Add to `.env`:
  ```env
  STRIPE_PUBLIC_KEY=pk_live_xxxxx  # or pk_test_ for development
  STRIPE_SECRET_KEY=sk_live_xxxxx  # or sk_test_ for development
  ```

---

## Phase 4: Webhook Configuration

### Production Deployment
- [ ] Deploy backend to Vercel/Railway/Render
- [ ] Note your API domain (e.g., `https://chronos-api.vercel.app`)

### Local Development (Ngrok Tunneling)
- [ ] Install ngrok: `npm install -g ngrok`
- [ ] Run tunnel: `ngrok http 5000`
- [ ] Copy forwarding URL: `https://xxxx-xxxxx-xxxx.ngrok.io`
- [ ] Go to Stripe Dashboard > Developers > Webhooks

### Set Up Webhook Endpoint
- [ ] Click "Add endpoint"
- [ ] Enter endpoint URL: `{your-domain}/api/payments/webhook`
- [ ] Select events to subscribe to:
  - [x] `payment_intent.succeeded`
  - [x] `payment_intent.payment_failed`
  - [x] `charge.refunded`
- [ ] Click "Create endpoint"
- [ ] Copy **Signing Secret** (whsec_xxxxx)
- [ ] Add to `.env`:
  ```env
  STRIPE_WEBHOOK_SECRET=whsec_xxxxx
  ```

---

## Phase 5: Local Testing

### Install Dependencies
```bash
cd server
npm install
npm run dev
```

### Verification Script
```bash
node ../verify-payment-email.js
```

✅ Should show:
- [x] SMTP Host configured
- [x] SMTP Port configured
- [x] SMTP connection successful
- [x] Stripe Public Key valid
- [x] Stripe Secret Key valid
- [x] Stripe Webhook Secret valid
- [x] Stripe connection successful

### Test Email Service
1. **Create test endpoint** (`test-email.js`):
   ```javascript
   import { sendEmail } from './utils/emailService.js';
   
   await sendEmail({
       to: 'your-test-email@example.com',
       subject: 'Test Email from Chronos',
       template: 'orderConfirmation.html',
       variables: {
           customerName: 'Test Customer',
           orderId: 'TEST-123-456',
           totalPrice: '$4,999.99',
           itemCount: 1,
           estimatedDelivery: new Date().toLocaleDateString(),
           trackingLink: 'https://chronos.local/orders/123',
       },
   });
   console.log('✓ Email sent!');
   ```

2. **Run test**: `node test-email.js`
3. **Verify**: Check your email inbox

### Test Payment Flow
1. **Create Payment Intent**:
   ```bash
   curl -X POST http://localhost:5000/api/payments/create-intent \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"orderId":"ORDER_ID_HERE"}'
   ```
   
2. **Frontend**: Use Stripe.js to confirm with test card:
   ```javascript
   const { error } = await stripe.confirmCardPayment(clientSecret, {
       payment_method: {
           card: { number: '4242424242424242', exp_month: 12, exp_year: 25, cvc: '123' },
       }
   });
   ```

3. **Confirm Payment**:
   ```bash
   curl -X POST http://localhost:5000/api/payments/confirm \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"paymentIntentId":"pi_xxxxx","orderId":"ORDER_ID"}'
   ```

4. **Check Webhook**: Stripe Dashboard > Webhooks > Events

---

## Phase 6: Production Deployment

### Pre-Launch Checklist
- [ ] Switch to **LIVE Stripe keys** (pk_live_, sk_live_)
- [ ] Update email service to production (SendGrid recommended)
- [ ] Update webhook endpoint to production domain
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS to production domain
- [ ] Test payment flow with test keys once more
- [ ] Get SSL certificate (auto with Vercel/Railway)

### Deploy to Production
- [ ] **Frontend**: Deploy to Vercel
- [ ] **Backend**: Deploy to Railway/Render
- [ ] **Database**: Configure MongoDB Atlas
- [ ] **Stripe**: Update webhook endpoint to production
- [ ] **DNS**: Point domain to Vercel

### Post-Deployment Verification
- [ ] Test payment with test card (production still works with test keys)
- [ ] Confirm emails sending
- [ ] Check webhook deliveries in Stripe dashboard
- [ ] Monitor error logs for first 24 hours

---

## Phase 7: FAQ & Troubleshooting

### "Email not sending"
1. Check SMTP credentials in `.env`
2. Verify sender email is verified (SendGrid)
3. Check Gmail: Enable "Less secure app access" OR use app password
4. Run `node verify-payment-email.js` to test connection
5. Check server logs for SMTP errors

### "Stripe webhook not firing"
1. Verify webhook endpoint is publicly accessible
2. Check signing secret matches `STRIPE_WEBHOOK_SECRET`
3. View webhook event logs in Stripe Dashboard
4. For local: Ensure ngrok tunnel is running and forwarding correctly

### "Payment intent not created"
1. Verify user has valid JWT token
2. Check order exists in MongoDB
3. Verify `STRIPE_SECRET_KEY` is correct
4. Check server logs for errors

### "403 Forbidden on payment/confirm"
1. Order doesn't belong to authenticated user
2. User must be original order creator or admin
3. Verify JWT token is valid

---

## Phase 8: Monitoring & Maintenance

### Daily Checks
- [ ] Check Stripe Dashboard for failed payments
- [ ] Review email delivery reports (SendGrid)
- [ ] Monitor server logs for payment errors

### Weekly Checks
- [ ] Test payment flow manually
- [ ] Check webhook delivery success rate
- [ ] Review failed orders in database
- [ ] Check SMTP connection stability

### Monthly Checks
- [ ] Review payment analytics
- [ ] Check for any declined transactions
- [ ] Update email templates if needed
- [ ] Review Stripe billing

---

## API Endpoints Reference

### Payment Management
```
POST   /api/payments/create-intent       Create Stripe Payment Intent
POST   /api/payments/confirm             Confirm payment after auth
GET    /api/payments/status/:intentId    Check payment status
POST   /api/payments/webhook             Stripe webhook handler
```

### Protected Routes (Require JWT Token)
- POST `/api/payments/create-intent`
- POST `/api/payments/confirm`
- GET `/api/payments/status/:intentId`

### Unprotected Routes
- POST `/api/payments/webhook` (Protected by Stripe signature)

---

## Environment Variables Summary

```env
# Email (Required)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Chronos Support <noreply@chronos.luxury>

# Stripe (Required)
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Optional
ANTHROPIC_API_KEY=sk-ant-xxxxx
VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx
```

---

## Support & Next Steps

### After Setup Complete ✅
1. Merchants can place orders
2. Payment processing via Stripe
3. Automatic order confirmation emails
4. Webhook-driven order status updates
5. Full audit trail in Stripe Dashboard

### Features Now Available
- ✅ One-time purchases with Stripe
- ✅ Automatic email confirmations
- ✅ Webhook-driven operations
- ✅ Payment status tracking
- ✅ Refund support
- ✅ Email templates (8 types)

### Optional Enhancements
- [ ] Stripe subscription setup
- [ ] Recurring billing for rentals
- [ ] Payment method tokenization
- [ ] Advanced fraud detection
- [ ] Email template customization

---

**Status:** Ready for Buyer Configuration  
**Documentation:** Complete  
**Testing Tools:** Provided  
**Next Phase:** Start email & payment setup per instructions above

**Questions?** Refer to:
- PAYMENT_SETUP.md (detailed setup guide)
- verify-payment-email.js (configuration validator)
- server/routes/payments.js (endpoint implementation)
