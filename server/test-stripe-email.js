#!/usr/bin/env node
/**
 * STRIPE SANDBOX & EMAIL TESTING SCRIPT
 * Tests Stripe setup and email configuration
 */

import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m',
};

function log(status, message) {
    const symbol = status === 'pass' ? '✓' : status === 'fail' ? '✗' : status === 'info' ? 'ℹ' : '⚠';
    const color = status === 'pass' ? COLORS.green : status === 'fail' ? COLORS.red : status === 'info' ? COLORS.blue : COLORS.yellow;
    console.log(`${color}${symbol}${COLORS.reset} ${message}`);
}

async function testStripeConnection() {
    console.log(`\n${COLORS.bold}${COLORS.blue}=== STRIPE SANDBOX CONNECTION TEST ===${COLORS.reset}\n`);

    // Check for credentials
    const publicKey = process.env.STRIPE_PUBLIC_KEY;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!publicKey || !secretKey) {
        log('fail', 'Stripe keys not configured in .env');
        return false;
    }

    // Verify they are test keys
    if (!publicKey.startsWith('pk_test_')) {
        log('fail', 'STRIPE_PUBLIC_KEY is not a test key (should start with pk_test_)');
        return false;
    }

    if (!secretKey.startsWith('sk_test_')) {
        log('fail', 'STRIPE_SECRET_KEY is not a test key (should start with sk_test_)');
        return false;
    }

    log('pass', `Public Key: ${publicKey.substring(0, 20)}...`);
    log('pass', `Secret Key: ${secretKey.substring(0, 20)}...`);

    // Test connection
    try {
        const stripe = new Stripe(secretKey);

        // Retrieve account to test connection
        const account = await stripe.account.retrieve();

        log('pass', '✨ Connected to Stripe!');
        log('info', `Account Email: ${account.email}`);
        log('info', `Charges Enabled: ${account.charges_enabled ? 'YES' : 'NO'}`);
        log('info', `Account Status: ${account.charges_enabled ? 'READY' : 'SETUP INCOMPLETE'}`);

        // Create a test payment intent
        console.log(`\n${COLORS.bold}${COLORS.blue}=== Creating Test Payment Intent ===${COLORS.reset}\n`);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 999, // $9.99
            currency: 'usd',
            description: 'Chronos Test Payment',
            metadata: {
                orderId: 'TEST-001',
                customerName: 'Test User',
            },
        });

        log('pass', 'Test Payment Intent Created!');
        log('info', `Intent ID: ${paymentIntent.id}`);
        log('info', `Amount: $${(paymentIntent.amount / 100).toFixed(2)}`);
        log('info', `Client Secret: ${paymentIntent.client_secret.substring(0, 30)}...`);
        log('info', `Status: ${paymentIntent.status}`);

        console.log(`\n${COLORS.bold}${COLORS.yellow}NEXT STEPS:${COLORS.reset}`);
        console.log(`1. Go to Stripe Dashboard: https://dashboard.stripe.com`);
        console.log(`2. Toggle to TEST MODE (top-right corner)`);
        console.log(`3. Go to Payments section`);
        console.log(`4. You should see the payment intent: ${paymentIntent.id}`);
        console.log(`5. To complete payment, use test card:`);
        console.log(`   Card Number: 4242 4242 4242 4242`);
        console.log(`   Expiry: 12/25`);
        console.log(`   CVC: 123`);
        console.log(`   Billing Zip: 12345\n`);

        return true;
    } catch (error) {
        log('fail', `Stripe Error: ${error.message}`);
        if (error.message.includes('API key')) {
            log('fail', 'Invalid Stripe API key - check your .env file');
        }
        return false;
    }
}

async function checkEmailConfig() {
    console.log(`\n${COLORS.bold}${COLORS.blue}=== EMAIL CONFIGURATION ===${COLORS.reset}\n`);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser) {
        log('fail', 'SMTP_USER not configured');
        return false;
    }

    log('pass', `Gmail Account: ${smtpUser}`);

    if (smtpPass === 'your-app-password' || !smtpPass) {
        log('fail', 'SMTP Password not configured - using placeholder');
        console.log(`\n${COLORS.bold}${COLORS.yellow}TO GET GMAIL APP PASSWORD:${COLORS.reset}`);
        console.log(`1. Go to: https://myaccount.google.com/security`);
        console.log(`2. Ensure "2-Step Verification" is ENABLED`);
        console.log(`3. Go to: https://support.google.com/accounts/answer/185833`);
        console.log(`4. Select App: Mail, Device: Windows Computer`);
        console.log(`5. Copy the 16-character app password`);
        console.log(`6. Update .env file: SMTP_PASS=xxxx xxxx xxxx xxxx`);
        console.log(`7. Re-run this script once password is set\n`);
        return false;
    }

    log('pass', `SMTP Password: ${smtpPass.substring(0, 4)}...`);
    log('pass', 'Email credentials configured!');
    return true;
}

async function runAll() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║     STRIPE SANDBOX & EMAIL CONFIGURATION VERIFICATION      ║
║                    Test Mode - April 16, 2026              ║
╚════════════════════════════════════════════════════════════╝
`);

    const stripeOk = await testStripeConnection();
    const emailOk = await checkEmailConfig();

    console.log(`\n${COLORS.bold}${COLORS.blue}=== SUMMARY ===${COLORS.reset}\n`);

    if (stripeOk) {
        log('pass', 'Stripe Sandbox: ✓ READY');
    } else {
        log('fail', 'Stripe Sandbox: ✗ CHECK CONFIGURATION');
    }

    if (emailOk) {
        log('pass', 'Gmail Setup: ✓ READY');
    } else {
        log('fail', 'Gmail Setup: ⚠ REQUIRES APP PASSWORD');
    }

    if (stripeOk && emailOk) {
        console.log(`\n${COLORS.green}${COLORS.bold}✨ All systems ready for testing!${COLORS.reset}`);
        console.log(`\nTo start the server: npm run dev`);
        console.log(`Then test at: http://localhost:5000/api/health\n`);
    } else if (stripeOk) {
        console.log(`\n${COLORS.yellow}⚠ Stripe is ready, but Gmail needs attention${COLORS.reset}\n`);
    }
}

runAll().catch((err) => {
    log('fail', `Unexpected error: ${err.message}`);
    process.exit(1);
});
