# Chronos Setup Guide

**Complete setup instructions for the Chronos luxury watch e-commerce template**

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** v18+ ([Download](https://nodejs.org))
- **npm** v9+ (comes with Node.js)
- **MongoDB** v8.2+ ([Download](https://www.mongodb.com/try/download/community)) *OR* MongoDB Atlas account (free tier available)
- **Git** (optional, for cloning the repository)

**Check your versions:**
```bash
node --version      # Should be v18+
npm --version       # Should be v9+
```

---

## Step 1: Clone the Repository

### Option A: Using Git
```bash
git clone https://github.com/yourusername/chronos.git
cd chronos
```

### Option B: Download as ZIP
1. Download the repository as a ZIP file
2. Extract it to your preferred location
3. `cd` into the extracted folder

---

## Step 2: Configure Environment Variables

### Backend Setup (server/.env)

Navigate to the `server/` directory and create or update `.env` file with the following variables:

```bash
cd server
cp .env.example .env  # Copy the template (if it exists)
```

Edit `server/.env` and configure each variable:

```env
# ===== DATABASE =====
# For local development:
MONGODB_URI=mongodb://localhost:27017/chronos

# For MongoDB Atlas (production recommended):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chronosdb?retryWrites=true&w=majority
MONGODB_DB_NAME=chronos

# ===== AUTHENTICATION =====
# Generate a strong JWT secret (min 32 characters):
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_long_random_secret_key_here_at_least_32_chars

# Token expiration (how long login sessions last):
JWT_EXPIRES_IN=7d

# ===== EMAIL SERVICE (Optional but recommended) =====
# For Gmail: Use an App Password, not your main password
# How to get Gmail App Password: https://support.google.com/accounts/answer/185833
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Email sender display name - change this to your store name:
SMTP_FROM="Your Store Name <noreply@yourstore.com>"

# ===== AI CONCIERGE (Optional but recommended) =====
# Get your API key: https://console.anthropic.com
# Required for: AI watch recommendations and visual search features
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===== PUSH NOTIFICATIONS (Optional) =====
# Generate VAPID keys (see "Generating VAPID Keys" section below):
VAPID_PUBLIC_KEY=your_vapid_public_key_here
VAPID_PRIVATE_KEY=your_vapid_private_key_here

# Your email for push notifications:
VAPID_EMAIL=your-email@yourstore.com

# ===== APPLICATION SETTINGS =====
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Log level: debug, info, warn, error
LOG_LEVEL=debug
```

### Frontend Setup (.env.local)

In the root directory (next to `package.json`), create `.env.local`:

```env
# API endpoint for the frontend to communicate with your backend:
NEXT_PUBLIC_API_URL=http://localhost:5000

# Your frontend URL (for cookies and CORS):
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 3: Get Your API Keys

### 3.1 Anthropic API Key (For AI Features)

**Required for:**
- AI Watch Concierge (product recommendations)
- Visual Search (image-to-product matching)

**Steps:**
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up / Log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy it and paste into `server/.env` as `ANTHROPIC_API_KEY`

**Can I skip this?** Yes, but AI features will be disabled. See FAQ below.

### 3.2 Gmail App Password (For Email Delivery)

**Required for:**
- Order confirmations
- Shipping updates
- Password reset emails
- VIP tier notifications

**Steps:**
1. Enable 2-Factor Authentication on your Gmail account: [myaccount.google.com/security](https://myaccount.google.com/security)
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Copy it and paste into `server/.env` as `SMTP_PASS`
6. Use your Gmail address for `SMTP_USER`

**Using a different email provider?** Configure your SMTP settings in `server/.env`:
- **SendGrid:** [sendgrid.com](https://sendgrid.com) → Settings → API Keys
- **Mailgun:** [mailgun.com](https://mailgun.com) → API → SMTP
- **AWS SES:** [console.aws.amazon.com](https://console.aws.amazon.com) → SES → SMTP

### 3.3 VAPID Keys for Push Notifications (Optional)

**Required for:**
- Desktop push notifications
- Mobile PWA notifications

**Generate VAPID keys:**

Run this in the `server/` directory:

```bash
npm install -g web-push

web-push generate-vapid-keys
```

This will output:
```
Public Key: BK...
Private Key: AJ...
```

Copy these into `server/.env` as:
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

---

## Step 4: Seed the Database & Create Admin Account

### 4.1 Start MongoDB (Local Development)

In a **new terminal**, start MongoDB:

```bash
# On Windows:
mongod

# On macOS (if installed via Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

### 4.2 Install Dependencies

```bash
cd server
npm install
```

### 4.3 Seed the Database

```bash
npm run seed
```

This will:
- Create your MongoDB database
- Add sample watches to the catalog
- Create an **admin user account**

**Admin Credentials (after seeding):**
- Email: `admin@chronos.com` (as defined in `server/scripts/seed.js`)
- Password: `Admin123@` (change this immediately after logging in!)

**To customize the admin account:**

Edit `server/scripts/seed.js` and find the admin user section:

```javascript
{
    firstName: 'Admin',
    email: 'admin@chronos.com',
    password: 'Admin123@',
    role: 'admin',
}
```

Change the email and password, then re-run `npm run seed`.

---

## Step 5: Run Locally

### Terminal 1: Start the Backend

```bash
cd server
npm run dev
```

You should see:
```
✅ Server running on http://localhost:5000
✅ Connected to MongoDB
```

### Terminal 2: Start the Frontend

```bash
npm install
npm run dev
```

You should see:
```
▲ Next.js 15.x.x (ready)
- Local:        http://localhost:3000
```

### Access the Application

- **Storefront:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **API:** http://localhost:5000/api

---

## Step 6: Deploy to Production

### Database: MongoDB Atlas (Recommended)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free M0 tier for testing)
3. Create a database user
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/chronos`
5. Copy this into `server/.env` as `MONGODB_URI`

### Backend: Railway or Render

**Option A: Railway** (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create an account and new project
3. Connect your GitHub repository
4. Add environment variables from `server/.env`
5. Deploy

Railway will give you a public URL like `https://chronos-api.railway.app`

**Option B: Render**

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect GitHub / upload code
4. Set build command: `cd server && npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

After deploying, update `FRONTEND_URL` in backend `.env` to your actual frontend URL.

### Frontend: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Vercel detects Next.js automatically
5. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`
6. Click "Deploy"

Vercel will give you a public URL like `https://chronos.vercel.app`

---

## Branding & Customization

### Change Store Name

1. **In code:** Update `src/app/layout.js` (page titles)
2. **In emails:** Update `SMTP_FROM` in `server/.env`
3. **In contact page:** Edit `src/app/(storefront)/contact/page.jsx`
4. **In pages:** Search for "Chronos" and replace with your store name

### Change Logo & Colors

1. **Replace logo:** Put your image at `public/logo.png`
2. **Update favicon:** Replace `public/favicon.ico`
3. **Update theme colors:**
   - Edit `tailwind.config.js`
   - Update color names (search for `luxury-black`, `luxury-gold`, etc.)
   - Or define your own palette in `src/app/globals.css`

### Customize Products

Edit `server/scripts/seed.js` and modify the `watchProducts` array, then re-run:

```bash
npm run seed
```

Or use the admin dashboard:
1. Log in as admin
2. Go to Admin → Products
3. Add/edit/delete products

---

## Frequently Asked Questions

### Q: Do I need an Anthropic API key?

**A:** Only if you want the AI features:
- **With API key:** AI Concierge recommends watches, Visual Search works
- **Without API key:** These features are disabled, but the store still works fine

To disable AI features without an API key, comment out the AI routes in `server/routes/concierge.js` and `server/routes/visualSearch.js`.

### Q: Can I use this without the AI features?

**A:** Yes. The AI features are optional. Everything else (shopping, auctions, rentals, warranty, marketplace) works without API keys.

### Q: What email provider should I use?

**A:** 
- **Beginners:** Gmail App Passwords (easiest to set up)
- **Production:** SendGrid, Mailgun, or AWS SES (more reliable)
- **Development:** Use any SMTP provider that supports `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### Q: I'm getting MongoDB connection errors

**A:** Make sure:
1. MongoDB is running: `mongod` in a terminal
2. The URI is correct in `server/.env`
3. If using MongoDB Atlas, whitelist your IP address in the security settings

### Q: How do I change the admin password?

**A:** 
1. Log in as admin at http://localhost:3000/admin
2. Go to Account Settings
3. Change password

Or edit `server/scripts/seed.js` and set a new password, then re-run `npm run seed`.

### Q: Can I run this without a frontend?

**A:** Yes, the backend is a standalone Express API. You can use it with:
- Postman (API testing)
- Custom frontend (React, Vue, Flutter, etc.)
- Mobile app

See `DOCUMENTATION.md` for API endpoints.

### Q: How do I backup my database?

**A:** 

For MongoDB Atlas (cloud):
- Data is automatically backed up daily
- You can also manually export via the Atlas dashboard

For local MongoDB:
```bash
mongodump --uri="mongodb://localhost:27017/chronos" --out=./backup
```

---

## Troubleshooting

### Port 5000 or 3000 already in use

**Backend (Port 5000):**
```bash
npm run dev -- --port 5001  # Use a different port
```

Then update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` accordingly.

### "Module not found" errors

```bash
cd server && npm install
npm install
```

Clear cache and reinstall all dependencies.

### Database won't connect

```bash
# Check if MongoDB is running
mongod

# Or test your MongoDB Atlas connection string
# Make sure IP is whitelisted in Atlas security settings
```

### Email not sending

1. Check `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in `server/.env`
2. If using Gmail: Confirm App Password is correct (not your main password)
3. Look for errors in backend logs: `npm run dev` output

---

## Next Steps

1. ✅ Complete setup above
2. 📖 Read [README.md](./README.md) for feature overview
3. 📄 Read [DOCUMENTATION.md](./DOCUMENTATION.md) for API details
4. 🎨 Customize branding and products
5. 🚀 Deploy to production
6. 📝 Read [LICENSE.md](./LICENSE.md) to understand your rights

---

**Need help?** Check [DOCUMENTATION.md](./DOCUMENTATION.md) or the code comments in `/server` and `/src`.
