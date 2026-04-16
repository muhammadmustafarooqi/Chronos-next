# Chronos Troubleshooting Guide

**Common issues, error messages, and solutions**

---

## Table of Contents

1. [Installation & Setup Issues](#installation--setup-issues)
2. [Backend Errors](#backend-errors)
3. [Frontend Errors](#frontend-errors)
4. [Database Issues](#database-issues)
5. [Email & Notifications](#email--notifications)
6. [Payment & Checkout](#payment--checkout)
7. [Performance Issues](#performance-issues)
8. [PWA & Push Notifications](#pwa--push-notifications)
9. [Getting Help](#getting-help)

---

## Installation & Setup Issues

### Issue: "npm: command not found"

**Error:**
```
bash: npm: command not found
```

**Cause:** Node.js not installed or not in system PATH

**Solution:**
1. Install Node.js from https://nodejs.org
2. Choose LTS version (v18+)
3. Verify installation:
```bash
node --version
npm --version
```
4. Restart terminal/computer
5. Try `npm install` again

---

### Issue: "Cannot find module 'next'"

**Error:**
```
Error: Cannot find module 'next'
```

**Cause:** Dependencies not installed

**Solution:**
```bash
# From root directory (where package.json is)
npm install

# If that fails, try:
rm -rf node_modules package-lock.json
npm install

# For specific package:
npm install next
```

---

### Issue: Port already in use

**Error:**
```
Error: listen EADDRINUSE :::5000
```

**Cause:** Another process using port 5000 or 3000

**Solution:**

**Windows (PowerShell):**
```powershell
# Find process using port 5000
Get-Process | Where-Object {$_.Handles -match "5000"}

# Or kill by port
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 [PID]

# Or change port in .env
PORT=5001
```

**Visual Studio Code:**
- Close all terminals
- Restart VS Code
- Try different port

---

## Backend Errors

### Issue: "MongoDB connection failed"

**Error:**
```
Error: Cannot connect to MongoDB at mongodb://localhost:27017
```

**Cause:** MongoDB not running or connection string incorrect

**Solution:**

**Check if MongoDB is running:**

**Windows:**
```bash
# MongoDB should run automatically as service
# Check Services: Ctrl+R → services.msc → Find "MongoDB Server"

# If not running, start MongoDB manually:
mongod

# For Windows with MongoDB installed:
net start MongoDB
```

**Mac:**
```bash
# If installed via Homebrew:
brew services start mongodb-community

# Or manually:
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

**Test connection:**
```bash
mongosh  # Opens MongoDB shell

# If successful, shows:
# >  # Prompt
```

**For MongoDB Atlas (Cloud):**
1. Check connection string in `.env`
2. Verify IP whitelist allows your IP
3. Test URL in MongoDB Compass (free GUI)
4. Check username/password (special characters need URL encoding)

---

### Issue: "JWT token verification failed"

**Error:**
```
Error: invalid token
UnauthorizedError: jwt malformed
```

**Cause:** Invalid JWT_SECRET or token corrupted

**Solution:**
```bash
# Check .env has valid JWT_SECRET
cat server/.env | grep JWT_SECRET

# If missing or empty, generate new:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update server/.env with output
# Then restart server
npm run dev
```

---

### Issue: "CORS error - blocked by CORS policy"

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/products' 
from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Cause:** CORS misconfiguration

**Solution:**

**Check CORS settings:**
- File: `server/server.js`
- Find: `cors()` configuration
- Should have:
```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})
```

**Verify FRONTEND_URL in server/.env:**
```bash
FRONTEND_URL=http://localhost:3000
```

**Check frontend API_URL:**
- File: `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### Issue: "413 Payload Too Large"

**Error:**
```
413 Payload Too Large
```

**Cause:** Request body exceeds size limit

**Solution:**

**File:** `server/server.js`

Find Express configuration and increase limit:
```javascript
app.use(express.json({ limit: '10mb' }));  // Increase from default 100kb
app.use(express.urlencoded({ limit: '10mb' }));
```

---

### Issue: "ANTHROPIC_API_KEY not found"

**Error:**
```
Error: ANTHROPIC_API_KEY is required
```

**Cause:** Claude API key not configured

**Solution:**
1. Get API key: https://console.anthropic.com
2. Add to `server/.env`:
```env
ANTHROPIC_API_KEY=sk-ant-v7-xxxxx
```
3. Restart server

**If you don't want AI features:**
- Leave ANTHROPIC_API_KEY empty
- AI features will gracefully disable with message: "AI feature unavailable"

---

## Frontend Errors

### Issue: "useSearchParams() may be used only in the context of <Router>"

**Error:**
```
Error: useSearchParams() may be used only in the context of a <Router> component
```

**Status:** ✅ FIXED in latest version

**If you encounter this:**
- File: `src/app/(storefront)/shop/page.jsx`
- Should have:
```jsx
import { Suspense } from 'react';

function ShopContent() {
  // Component using useSearchParams
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
```

---

### Issue: "Image optimization error"

**Error:**
```
Error: "url" is required
```

**Cause:** Next.js Image component without src

**Solution:**

**Find problematic Image tag:**
```jsx
// ❌ Wrong:
<Image src={undefined} alt="Product" />

// ✅ Correct:
<Image 
  src={product.image || '/placeholder.png'}  // Fallback
  alt={product.name}
  width={400}
  height={400}
/>
```

---

### Issue: "Cannot find component"

**Error:**
```
Module not found: Can't resolve '@/components/ProductCard'
```

**Cause:** Wrong import path or file doesn't exist

**Solution:**

**Check file exists:**
```bash
ls src/components/ProductCard.jsx
```

**Fix import path:**
```jsx
// Check for typos
import ProductCard from '@/components/ProductCard';  // ✓ Correct path

// Make sure file is at:
src/components/ProductCard.jsx
```

**Check alias in jsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Database Issues

### Issue: "Duplicate key error 11000"

**Error:**
```
E11000 duplicate key error collection
```

**Cause:** Trying to create document with duplicate unique field (e.g., email)

**Solution:**

**Check which field is duplicate:**
- Error shows `{ email: 1 }` or similar
- Delete duplicate or use different value

**For testing - reset database:**
```bash
# Clear all data (WARNING: DESTRUCTIVE)
cd server
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chronos');
mongoose.connection.on('connected', async () => {
  await mongoose.connection.db.dropDatabase();
  console.log('Database cleared');
  process.exit(0);
});
"

# Then reseed:
npm run seed
```

---

### Issue: "Cast to ObjectId failed"

**Error:**
```
Cast to ObjectId failed for value "invalid-id" at path "_id"
```

**Cause:** Invalid MongoDB ObjectId format

**Solution:**

**Check ID format:**
```javascript
// MongoDB IDs are 24-character hex strings
// Valid: 507f1f77bcf86cd799439011
// Invalid: 123, abc, user-id-123

// In code, validate before querying:
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ error: 'Invalid ID format' });
}
```

---

## Email & Notifications

### Issue: "Gmail SMTP authentication failed"

**Error:**
```
Error: Invalid login: 535 5.7.8 Username and password not accepted
```

**Cause:** Wrong Gmail password or 2FA not set up

**Solution:**

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - After 2FA enabled, go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google generates 16-character password
   - Copy and paste into `server/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # The generated app password
```

3. **Restart server:**
```bash
npm run dev
```

---

### Issue: "Email not sending"

**Error:**
```
Error: send ENOTFOUND
```

**Cause:** Invalid SMTP server or network issue

**Solution:**

**Verify email configuration:**
```bash
# Check .env file
cat server/.env | grep SMTP
```

**Test SMTP connection manually:**
```bash
# Using telnet (if available):
telnet smtp.gmail.com 587

# Should connect successfully
```

**Check if email service requires:**
- Less secure apps (Gmail): https://support.google.com/accounts/answer/6010255
- API keys instead
- Firewall rules

---

### Issue: "Push notifications not working"

**Error:**
```
Error: Invalid VAPID keys
```

**Cause:** VAPID keys not configured

**Solution:**

1. **Generate VAPID keys:**
```bash
cd server
npx web-push generate-vapid-keys
```

2. **Output will be:**
```
Public Key: B...
Private Key: ...
```

3. **Add to server/.env:**
```env
VAPID_PUBLIC_KEY=B...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=your-email@yourstore.com
```

4. **Add public key to frontend (.env.local):**
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=B...
```

5. **Restart both frontend and backend**

---

## Payment & Checkout

### Issue: "Payment failed"

**Error:**
```
Error: Payment intent failed
```

**Cause:** Various payment processor issues

**Solution:**

**Check payment method is valid:**
- Card not expired
- CVV correct
- Billing address matches

**Check amount calculation:**
- Review order total breakdown
- Ensure no negative amounts
- Tax calculated correctly

**Check payment keys:**
- Verify API keys in environment variables
- Make sure you're using test keys in development
- Production keys only on production

---

## Performance Issues

### Issue: "Website loading slowly"

**Cause:** Various performance issues

**Solution:**

**Frontend optimization:**
```bash
# Check bundle size:
npm run build

# Analyze:
npm install -g webpack-bundle-analyzer
```

**Backend optimization:**
```bash
# Profile API endpoints
# Add logging to identify slow queries
```

**Common slowdowns:**
- Large unoptimized images
- Missing database indexes
- Too many API calls
- Uncompressed responses
- Missing caching

---

### Issue: "High memory usage"

**Cause:** Memory leak or resource not released

**Solution:**

**Identify leak:**
```bash
# Monitor memory usage:
node --inspect server/server.js

# Open chrome://inspect in Chrome
# Take heap snapshots
# Compare snapshots to find leaks
```

**Common issues:**
- Connections not closed
- Large arrays growing indefinitely
- Event listeners not removed

---

## PWA & Push Notifications

### Issue: "Service worker not registering"

**Error:**
```
Failed to register service worker
```

**Cause:** Service worker file not found or HTTPS required

**Solution:**

**Check file exists:**
```bash
ls public/sw.js
```

**Check manifest:**
- File: `public/manifest.json`
- Should exist and be valid JSON

**HTTPS requirement:**
- Push notifs only work on HTTPS (or localhost)
- Production must use HTTPS
- Test locally on http://localhost:3000 (works)

---

### Issue: "Install prompt not showing"

**Cause:** Browser doesn't detect PWA criteria

**Solution:**

**Check manifest is valid:**
```bash
# Open DevTools → Application → Manifest
# Should show: ✓ Identity ✓ Icons ✓ Display ✓ Screenshots
```

**Check requirements:**
- ✅ HTTPS (or localhost)
- ✅ Service worker registered
- ✅ Manifest with icons
- ✅ 2 screens minimum (install button only on desktop)

**Manually test install:**
1. Open DevTools → Application → Manifest
2. Click "Install" button
3. Or: Menu → "Install [App Name]"

---

## Getting Help

### Debug Checklist

Before seeking support:

**Backend issues:**
- [ ] Check `server/.env` is configured correctly
- [ ] MongoDB running? (`npm run seed` succeeds)
- [ ] All dependencies installed? (`npm install`)
- [ ] Server runs without errors? (`npm run dev` starts successfully)
- [ ] Correct ports (5000 for backend)?
- [ ] No firewall blocking ports?

**Frontend issues:**
- [ ] Check `.env.local` is configured
- [ ] All dependencies installed? (`npm install` from root)
- [ ] Correct API URL pointing to backend?
- [ ] Browser console has no errors? (F12 → Console tab)
- [ ] Cache cleared? (Ctrl+Shift+R to hard refresh)

**Email issues:**
- [ ] Gmail 2FA enabled & app password generated?
- [ ] SMTP credentials correct in `.env`?
- [ ] Server restarted after changing `.env`?

**Database issues:**
- [ ] MongoDB running (not just installed)?
- [ ] Connection string correct?
- [ ] Database accessible (test with MongoDB Compass)?

### Common Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
npm run seed

# Generate VAPID keys
npx web-push generate-vapid-keys

# Check what's running on port
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process on port
kill -9 [PID]  # Mac/Linux
taskkill /PID [PID] /F  # Windows

# Clear browser cache
# Chrome: Ctrl+Shift+Delete → Clear all time → Clear data
```

### Logs to Check

**Backend log file:**
```bash
tail -f server.log  # If logging to file
# Or check console output during `npm run dev`
```

**Browser console:**
- Open DevTools: F12 or Ctrl+Shift+I
- Go to "Console" tab
- Look for red errors

**Network tab:**
- Go to "Network" tab in DevTools
- Reload page
- Look for failed requests (red, 4xx, 5xx status)

### Report Issues

If you find a bug:

1. **Document the issue:**
   - What were you doing?
   - What error did you see?
   - What did you expect to happen?

2. **Provide system info:**
   - OS (Windows/Mac/Linux)
   - Node version (`node --version`)
   - npm version (`npm --version`)

3. **Provide logs:**
   - Console error messages
   - Backend terminal output
   - Network tab errors

4. **Create minimal reproduction:**
   - Steps to reproduce
   - Fresh database or existing?
   - Does it happen every time?

---

For more detailed help:
- Check **SETUP.md** for installation help
- Check **DEPLOYMENT_DETAILED.md** for production issues
- Review backend logs carefully
- Check browser DevTools console
