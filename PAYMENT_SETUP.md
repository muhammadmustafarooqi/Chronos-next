# Payment & Email Configuration Guide

This guide walks you through setting up Stripe payments and email services for Chronos.

## 📋 Table of Contents
1. [Email Service Setup](#email-service-setup)
2. [Stripe Payment Setup](#stripe-payment-setup)
3. [Testing Payments](#testing-payments)
4. [Production Deployment](#production-deployment)

---

## Email Service Setup

### Option 1: Gmail SMTP (Recommended for Development)

**Prerequisites:**
- Gmail account
- Less secure app access enabled (OR generate App Password)

**Steps:**

1. **Enable 2-Factor Authentication** (Required for App Passwords)
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to https://support.google.com/accounts/answer/185833
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character app password

3. **Update `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
   SMTP_FROM=Chronos Support <noreply@chronos.luxury>
   ```

4. **Test Email**
   ```bash
   npm run test:email
   ```

---

### Option 2: SendGrid (Recommended for Production)

**Prerequisites:**
- SendGrid account (https://sendgrid.com)
- API key with Mail Send permission

**Steps:**

1. **Create SendGrid Account**
   - Sign up at https://sendgrid.com
   - Verify sender identity (email domain)
   - Create API key under "Settings > API Keys"

2. **Update `.env` file:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.your-api-key-here
   SMTP_FROM=Chronos Support <noreply@chronos.luxury>
   ```

3. **Verify Sender Domain**
   - Go to Sender Authentication
   - Add your domain and verify DNS records

---

### Option 3: Mailgun

**Steps:**

1. **Create Mailgun Account**
   - Sign up at https://www.mailgun.com
   - Add domain
   - Get SMTP credentials

2. **Update `.env` file:**
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASS=your-mailgun-password
   SMTP_FROM=Chronos Support <noreply@chronos.luxury>
   ```

---

## Testing Email Locally

Create a test script:

```javascript
// test-email.js
import { sendEmail } from './server/utils/emailService.js';

await sendEmail({
    to: 'your-email@example.com',
    subject: 'Test Email from Chronos',
    template: 'orderConfirmation.html',
    variables: {
        customerName: 'Test Customer',
        orderId: 'TEST-123-456',
        totalPrice: '$4,999.99',
        itemCount: 1,
        estimatedDelivery: new Date().toLocaleDateString(),
        trackingLink: 'https://chronos.local/orders/123',
    }
});

console.log('Email sent!');
```

Run with: `node test-email.js`

---

## Stripe Payment Setup

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start Now"
3. Fill in business details
4. Verify email
5. Go to Dashboard

### Step 2: Get API Keys

1. From dashboard, go to "Developers" > "API keys"
2. Copy both keys:
   - **Public Key** (Publishable) — Can be exposed to frontend
   - **Secret Key** — Keep secret, only on backend

3. Update `.env` file:
   ```env
   STRIPE_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   ```

### Step 3: Set Up Webhooks

Webhooks allow Stripe to notify your server when payments succeed/fail.

1. Go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Enter endpoint URL:
   - **Development (ngrok tunneling):**
     ```
     https://your-ngrok-url.ngrok.io/api/payments/webhook
     ```
   - **Production:**
     ```
     https://your-domain.com/api/payments/webhook
     ```

4. Select events to subscribe to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

5. Copy the **Signing Secret** and add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Step 4: Test Keys (Optional)

Stripe provides test keys for development:

1. In top-right corner, toggle "Test mode"
2. Use test keys (they start with `pk_test_` and `sk_test_`)
3. Use test card numbers:
   - **Success:** 4242 4242 4242 4242
   - **Decline:** 4000 0000 0000 0002

---

## Testing Payments

### Local Development with ngrok

To test webhooks locally, use ngrok to tunnel:

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel (forwards to port 5000)
ngrok http 5000

# You'll see: https://xxxx-xxxxx-xxxx.ngrok.io
```

Update webhook in Stripe dashboard to use the ngrok URL.

### Manual Payment Flow

1. **Create Payment Intent**
   ```bash
   curl -X POST http://localhost:5000/api/payments/create-intent \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"orderId":"ORDER_ID_HERE"}'
   ```

2. **Frontend**: Use Stripe.js to confirm payment
   ```javascript
   const { error } = await stripe.confirmCardPayment(clientSecret, {
       payment_method: {
           card: elements.getElement(CardElement),
           billing_details: { name: 'Customer Name' }
       }
   });
   ```

3. **Server**: Confirm payment
   ```bash
   curl -X POST http://localhost:5000/api/payments/confirm \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"paymentIntentId":"pi_xxxxx","orderId":"ORDER_ID"}'
   ```

### Check Webhook Events

In Stripe dashboard under "Webhooks," view event logs to confirm webhooks are being delivered.

---

## Production Deployment

### Before Going Live

1. ✅ Switch from test keys to live keys
2. ✅ Test with SendGrid or production email service
3. ✅ Set webhook endpoint to production domain
4. ✅ Update CORS settings to production domain
5. ✅ Set `NODE_ENV=production`

### Environment Variables for Production

```env
# Stripe
STRIPE_PUBLIC_KEY=pk_live_xxxxx  # NOT test keys!
STRIPE_SECRET_KEY=sk_live_xxxxx   # NOT test keys!
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
SMTP_FROM=Chronos Support <support@chronos.luxury>

# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://chronos.luxury
```

### Webhook Endpoint

Ensure webhook endpoint is:
1. Publicly accessible
2. Returns 200 OK
3. Doesn't require authentication (Stripe signs requests)

---

## Email Templates

Email templates are in `/server/templates/emails/`:

- `orderConfirmation.html` — Sent after successful payment
- `paymentConfirmation.html` — Payment receipt
- `serviceReminder.html` — Service notifications
- `vipTierUpgrade.html` — VIP membership upgrades
- `passwordReset.html` — Password reset links
- `shippingUpdate.html` — Shipping status updates
- `dropEarlyAccess.html` — Drop notifications
- `giftRevealLink.html` — Gift reveal emails

### Customizing Templates

1. Open template in `server/templates/emails/`
2. Edit HTML/CSS
3. Template variables use `{{variableName}}` syntax
4. Test by sending email through API

---

## Troubleshooting

### Email not sending

**Check in .env:**
- SMTP credentials are correct
- SMTP_HOST and SMTP_PORT match provider
- App password is 16 characters (for Gmail)
- Sender domain is verified (SendGrid)

**Debug:**
```javascript
// In emailService.js, add logging
console.log('Attempting to send email to:', to);
console.log('From:', process.env.SMTP_FROM);
console.log('Host:', process.env.SMTP_HOST);
```

### Stripe webhook not firing

1. **Check webhook is configured** → Developers > Webhooks
2. **Verify signing secret matches** → `.env` STRIPE_WEBHOOK_SECRET
3. **Check endpoint is accessible** → Test with curl
4. **View event logs** → Webhooks > Event logs (see delivery attempts)

### Payment intent not created

1. Check user is authenticated (JWT token valid)
2. Verify order exists in database
3. Check STRIPE_SECRET_KEY is valid
4. Look for errors in server logs

---

## API Reference

### Create Payment Intent
```
POST /api/payments/create-intent
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234_secret_5678",
    "paymentIntentId": "pi_1234",
    "amount": 4999.99
  }
}
```

### Confirm Payment
```
POST /api/payments/confirm
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "paymentIntentId": "pi_1234",
  "orderId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "data": {
    "message": "Payment confirmed",
    "order": {
      "_id": "507f1f77bcf86cd799439011",
      "status": "Confirmed",
      "paymentStatus": "succeeded",
      "paidAt": "2026-04-15T10:30:00Z"
    }
  }
}
```

### Get Payment Status
```
GET /api/payments/status/{paymentIntentId}
Authorization: Bearer {jwt_token}

Response:
{
  "success": true,
  "data": {
    "status": "succeeded",
    "amount": 4999.99,
    "currency": "usd",
    "created": 1713176400
  }
}
```

---

## Next Steps

1. ✅ Configure email service (Gmail or SendGrid)
2. ✅ Set up Stripe account and keys
3. ✅ Configure webhooks
4. ✅ Test payment flow locally
5. ✅ Deploy to production
6. ✅ Monitor webhook deliveries

---

**Support:** For issues, check server logs at `/server/debug_db.js` or error logs in Stripe dashboard.
