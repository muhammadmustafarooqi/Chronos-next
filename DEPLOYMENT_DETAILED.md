# Chronos Deployment Guide

**Step-by-step production deployment across Vercel (Frontend), Railway/Render (Backend), and MongoDB Atlas (Database)**

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
3. [Backend Deployment (Railway or Render)](#backend-deployment-railway-or-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [SSL/HTTPS Setup](#ssltls-setup)
7. [Custom Domain](#custom-domain)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring & Debugging](#monitoring--debugging)
10. [Scaling & Performance](#scaling--performance)

---

## Pre-Deployment Checklist

```
Before deploying to production:

SECURITY:
□ All hardcoded credentials removed
□ .env files NOT committed to git
□ .gitignore includes: .env, node_modules, .next
□ API keys stored as environment variables only
□ JWT_SECRET is strong (32+ characters)
□ CORS configured for production domain only
□ Rate limiting enabled
□ Input sanitization enabled

CODE QUALITY:
□ All tests passing locally
□ No console.errors or warnings
□ No commented-out debug code
□ Production build completes without errors
□ Database indexes created for frequently queried fields

DATABASE:
□ Backup complete before changing
□ Migration tested on backup database
□ Seed data prepared for production
□ Admin account credentials saved securely

CONFIG:
□ All URLs updated to production domain
□ Email service configured (SMTP settings tested)
□ Payment processor configured with prod keys
□ API rate limits configured
□ Logging configured

DEPLOYMENT TOOLS:
□ Git repository created
□ Vercel account created (for frontend)
□ Railway or Render account created (for backend)
□ MongoDB Atlas account created (for database)
□ DNS provider access ready (for custom domain)
```

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account (or sign in with GitHub)
4. Complete verification email

### Step 2: Create Cluster

1. After login, click "Create a deployment"
2. Choose "M0 Free Tier" (sufficient for most stores)
3. Select region close to your users
4. Cloud provider: AWS or Google Cloud (doesn't matter for free tier)
5. Cluster name: "Production" (or similar)
6. Click "Create Cluster" (takes 2-3 minutes)

### Step 3: Create Database User

1. Click "Security" → "Quick Start"
2. Create username: `admin` (or custom)
3. Generate strong password (auto-generated is fine)
   - **SAVE THIS PASSWORD** - you'll need it
4. IP Whitelist:
   - Click "Add My Current IP" (for development)
   - Or add `0.0.0.0/0` (allow all - less secure but simpler)
5. Click "Create User"

### Step 4: Get Connection String

1. Click "Databases" → Your cluster
2. Click "Connect"
3. Choose "Drivers" → "Node.js"
4. Copy connection string:
```
mongodb+srv://admin:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

5. Replace:
   - `admin` → your username
   - `password` → your password
   - Keep rest of URL same

6. **IMPORTANT:** URL must end with database name:
```
mongodb+srv://admin:password@cluster.mongodb.net/chronos?retryWrites=true&w=majority
```

### Step 5: Save Connection String

This is your `MONGODB_URI` for environment variables:
```env
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/chronos?retryWrites=true&w=majority
MONGODB_DB_NAME=chronos
```

---

## Backend Deployment (Railway or Render)

### Option A: Deploy to Railway

#### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Create account (GitHub recommended)
3. Create new project

#### Step 2: Connect GitHub Repository

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Authorize Railway to access GitHub
4. Select your Chronos repository

#### Step 3: Configure Environment Variables

1. Railway auto-detects `server/` directory
2. Click on service → "Variables"
3. Add all variables from `server/.env.example`:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=chronos
JWT_SECRET=(generate strong key)
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
ANTHROPIC_API_KEY=sk-ant-...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=(gmail app password)
SMTP_FROM=Your Store <noreply@yourstore.com>
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=your-email@yourstore.com
LOG_LEVEL=info
```

#### Step 4: Deploy

1. Railway auto-deploys on push to main branch
2. Or click "Deploy" manually
3. Watch logs for build success
4. Once deployed, Railway generates URL: `https://xxx.railway.app`

#### Step 5: Get Backend URL

- Your backend API is now at: `https://xxx.railway.app/api`
- Save this for frontend configuration

---

### Option B: Deploy to Render

#### Step 1: Create Render Account

1. Go to: https://render.com
2. Create account (GitHub recommended)
3. Create new project

#### Step 2: Connect GitHub Repository

1. Click "New +"
2. Select "Web Service"
3. Connect GitHub account
4. Select your Chronos repository
5. Branch: `main`

#### Step 3: Configure Service

1. Name: "chronos-api" (or similar)
2. Runtime: "Node"
3. Build command: `npm install && cd server && npm install`
4. Start command: `node server/server.js`
5. Environment: Production

#### Step 4: Add Environment Variables

1. Click "Environment"
2. Add all variables from `server/.env.example`
3. Same variables as Railway (see above)

#### Step 5: Deploy

1. Click "Create Web Service"
2. Render builds and deploys automatically
3. Once deployed, you get URL: `https://xxx.onrender.com`

#### Step 6: Get Backend URL

- Your backend API is at: `https://xxx.onrender.com/api`
- Save this for frontend configuration

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Use GitHub (recommended)
4. Authorize Vercel

### Step 2: Import Project

1. Click "Add New..."
2. Select "Project"
3. Click "Import Git Repository"
4. Select your Chronos repository
from GitHub
5. Click "Import"

### Step 3: Configure Environment Variables

1. Vercel auto-detects it's a Next.js project
2. Click "Environment Variables"
3. Add:

```env
NEXT_PUBLIC_API_URL=https://xxx.railway.app  # Your backend URL
NEXT_PUBLIC_APP_URL=https://your-domain.com  # Your domain
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...             # From server/.env
```

4. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Vercel builds and deploys (takes 2-3 min)
3. Once complete, you get URL: `https://xxx.vercel.app`
4. OR create production custom domain (see next section)

### Step 5: Enable Automatic Deployments

1. Settings → "Git"
2. "Production Branch": `main`
3. "Deploy on every push": Enabled (automatic)
4. FYI: Pushing to main branch now auto-deploys to production

---

## Environment Variables

### Complete Environment Variable Reference

#### Backend (server/.env)

```env
# Database
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/chronos?retryWrites=true&w=majority
MONGODB_DB_NAME=chronos

# Authentication
JWT_SECRET=(32+ character random string, generate with Node)
JWT_EXPIRES_IN=7d

# Admin Account (seeded on first run)
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=SecurePassword123!

# Email Service (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=(16-char app password from Gmail)
SMTP_FROM=Your Store Name <noreply@yourstore.com>

# AI Features (Claude)
ANTHROPIC_API_KEY=sk-ant-v7-xxxxx

# Push Notifications
VAPID_PUBLIC_KEY=BKxxx...
VAPID_PRIVATE_KEY=xxx...
VAPID_EMAIL=your-email@yourstore.com

# Server Config
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
LOG_LEVEL=info

# Optional Services
STRIPE_SECRET_KEY=sk_live_xxxxx  # If using Stripe
STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

#### Frontend (.env.local or via Vercel)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=(same as server VAPID_PUBLIC_KEY)
```

### Generate Strong JWT Secret

```bash
# Using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Copy this and paste into JWT_SECRET
```

---

## SSL/HTTPS Setup

### Vercel (Frontend)

- ✅ Automatic SSL
- ✅ Free HTTPS certificate included
- ✅ Auto-renews
- ✅ Works immediately

### Railway/Render (Backend)

- ✅ Automatic SSL
- ✅ Free HTTPS included (xxx.railway.app or xxx.onrender.com)
- ✅ Certificates auto-managed

### Custom Domain SSL

If you use custom domain:

**On Vercel:**
1. Settings → "Domains"
2. Add your domain
3. Vercel auto-configures SSL (Let's Encrypt)
4. Usually takes 5-15 minutes

**On Railway/Render:**
1. Settings → "Custom Domain"
2. Add your domain
3. Service auto-generates SSL certificate
4. Takes a few minutes

---

## Custom Domain

### Step 1: Buy Domain

1. Go to domain registrar:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Etc.
2. Search and buy domain: `yourdomain.com`
3. Note registrar & login credentials

### Step 2: Point Domain to Vercel (Frontend)

1. Go to Vercel → Settings → "Domains"
2. Add domain: `yourdomain.com` and `www.yourdomain.com`
3. Vercel shows DNS records needed:
   - Usually CNAME records
4. In your domain registrar:
   - Go to DNS settings
   - Add CNAME record pointing to Vercel
   - Example: `yourdomain.com` → `cname.vercel-dns.com`
5. Wait 24-48 hours for DNS propagation
6. Vercel shows green checkmark when ready

### Step 3: Point Subdomain to Railway/Render (Backend)

If you want backend on subdomain (e.g., `api.yourdomain.com`):

1. Railway/Render → Settings → "Custom Domain"
2. Add subdomain: `api.yourdomain.com`
3. Service shows DNS record needed
4. In domain registrar:
   - Add CNAME record: `api` → `xxx.railway.app`
5. Wait 24-48 hours for propagation

### Step 4: Update Environment Variables

Once domain is active:

**Frontend (.env.local in Vercel):**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Backend (in Railway/Render environment):**
```env
FRONTEND_URL=https://yourdomain.com
```

**Redeploy both** after changing URLs.

---

## Post-Deployment Verification

### Step 1: Test Frontend

1. Visit your domain: `https://yourdomain.com`
2. Homepage should load
3. Pages should load without errors
4. Check browser console (F12) for errors

### Step 2: Test Backend Connection

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Navigate to product page
4. Look for `/api/products` request
5. Should return 200 status (success)

### Step 3: Test Authentication

1. Sign up with test account
2. Should receive verification email
3. Login should work
4. See user profile

### Step 4: Test Critical Features

```
□ Browse products
□ Add to cart
□ Proceed to checkout
□ Complete test order (use Stripe test card: 4242424242424242)
□ View order confirmation email
□ Check admin dashboard
```

### Step 5: Monitor Logs

**Backend logs:**
- Railway: Dashboard → "Logs" tab
- Render: Dashboard → "Logs" tab
- Check for errors: 500 status, exceptions, crashes

**Frontend logs:**
- Vercel: Dashboard → "Deployment" → "Build Logs"
- Check for build errors or warnings

---

## Monitoring & Debugging

### View Live Logs

**Railway Backend Logs:**
```bash
# Via Railway CLI (install: npm install -g railway)
railway logs -s backend

# Or view in web dashboard:
# Dashboard → Select service → Logs
```

**Vercel Frontend Logs:**
```bash
# Via Vercel CLI (install: npm install -g vercel)
vercel logs

# Or view in web dashboard:
# Project → Deployments → Click deployment → View Logs
```

### Monitor Performance

**Vercel Performance:**
- Dashboard → "Analytics"
- Shows: Performance, error rate, traffic

**Railway/Render Performance:**
- Dashboard → "Metrics"
- Shows: CPU, memory, disk usage

### Error Tracking

**Common Production Errors:**

```bash
# 502 Bad Gateway
├─ Backend crashed or not responding
├─ Check backend logs
└─ Restart service

# 504 Gateway Timeout
├─ Request took too long
├─ Database query slow
├─ Third-party API slow (Claude, email)
└─ Increase timeout limits

# CORS errors in browser
├─ Origin not whitelisted
├─ Check FRONTEND_URL matches deployed frontend
└─ Redeploy backend with correct FRONTEND_URL
```

### Database Debugging

**Connect to production database:**

```bash
# Using MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. New Connection → Paste your MONGODB_URI
3. Browse data visually

# Using mongosh (CLI)
1. Install: npm install -g mongosh
2. mongosh "your-mongo-uri"
3. View collections and documents
```

---

## Scaling & Performance

### As User Load Increases

**Monitor metrics:**
- CPU usage > 80% → Upgrade server
- Memory usage > 85% → Upgrade RAM
- Response time > 500ms → Optimize database/code
- Error rate > 1% → Investigate errors

### Database Optimization

**Add indexes for frequently queried fields:**

```javascript
// server/models/Product.js
productSchema.index({ name: 'text' });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

// Or in MongoDB Compass:
// Right-click collection → "Indexes" → Add indexes
```

### Cache Strategy

**Redis Cache (if needed for scaling):**

```javascript
// Add Redis to backend
npm install redis

// In server.js:
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});
```

### Database Sharding

If you exceed MongoDB Atlas free tier:
- M0 Cluster (512MB free) → M2 (2GB paid) → Higher tiers
- MongoDB handles sharding automatically
- Upgrade from MongoDB Atlas dashboard

---

## Pre-Production Checklist

```
BEFORE GOING LIVE:

□ All environment variables set correctly
□ Admin account created and test logged in
□ Seed data loaded
□ Initial products added
□ Payment processor configured (if applicable)
□ Email service tested (order confirmation received)
□ SSL/HTTPS working (green lock icon)
□ Custom domain configured
□ Backups scheduled
□ Monitoring enabled
□ Error tracking configured
□ Analytics configured
□ Rate limiting enabled
□ CORS properly configured
□ Database backed up
□ Admin credentials saved securely
□ Support email working
□ All URLs updated to production domain
□ Terms & Privacy pages created
□ Contact information correct
□ Return policy documented
```

---

## Troubleshooting Post-Deployment

### Issue: Frontend can't connect to backend

**Check:**
1. Backend URL in `.env.local` (Vercel)
   - Should be: `https://api.yourdomain.com` or `https://xxx.railway.app`
2. CORS configuration in backend
   - `FRONTEND_URL` must match frontend domain
3. Both services running (check provider logs)

### Issue: Email not sending

**Check:**
1. SMTP credentials correct in backend `.env`
2. Email service account active (Gmail: 2FA + app password)
3. Check backend logs for email errors
4. Test email manually in admin dashboard

### Issue: Database connection slow

**Check:**
1. MongoDB Atlas IP whitelist includes railway/render IPs
   - Solution: Allow `0.0.0.0/0` or add specific IPs
2. Database connection pooling configured
3. Indexes created for common queries

### Issue: High latency/slow response

**Optimize:**
1. Add database indexes (see above)
2. Enable caching (Redis)
3. Upgrade server tier
4. Use CDN for static assets (Vercel does this automatically)

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check performance metrics

**Weekly:**
- Review analytics
- Check for failed payments/orders
- Monitor customer support

**Monthly:**
- Database backup verification
- Performance optimization review
- Update dependencies (`npm update`)

**Quarterly:**
- Security audit
- Performance analysis
- Capacity planning

### Backups

**MongoDB Atlas automatically backs up:**
- Manual backup: Available in MongoDB Atlas dashboard
- Automated backups: Every 6 hours (free tier has 7-day retention)

**To restore from backup:**
1. MongoDB Atlas → Your cluster → "Backup" tab
2. Select backup point
3. Click "Restore"

---

## Getting Help

**Deployment resources:**
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs
- MongoDB Atlas docs: https://docs.atlas.mongodb.com

**Common issues:**
- See **TROUBLESHOOTING.md** section "Deployment Issues"

**Need support:**
- Check service provider status pages
- Review logs carefully
- Check environment variables
- Restart services

---

## Success Checklist

```
✅ You have successfully deployed when:

□ Frontend loads on custom domain (HTTPS)
□ Backend API responds to requests
□ Database connected and data visible
□ Users can register and login
□ Orders can be placed and confirmed
□ Emails send successfully
□ Admin dashboard accessible
□ All 15 features working:
  □ AI concierge working
  □ AR try-on accessible
  □ Configurator functional
  □ VIP system active
  □ Auctions accessible
  □ Drops working
  □ Rentals functional
  □ Warranty auto-generated
  □ Marketplace functional
  □ Visual search working
  □ Push notifications enabled
  □ Analytics tracking
□ All environment variables correct
□ SSL certificate valid
□ Monitoring active
□ Backups working
□ Admin trained on using dashboard

🎉 Congratulations! Your Chronos store is live!
```

---

For detailed help:
- See **SETUP.md** for local development
- See **TROUBLESHOOTING.md** for error solutions
- See **ADMIN_GUIDE.md** for production management
