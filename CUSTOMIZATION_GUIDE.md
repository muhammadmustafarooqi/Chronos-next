# Chronos Customization Guide

**Complete guide to customize Chronos for your brand**

---

## Table of Contents

1. [Brand & Visual Customization](#brand--visual-customization)
2. [Content Customization](#content-customization)
3. [Store Configuration](#store-configuration)
4. [Feature Customization](#feature-customization)
5. [Color & Theme System](#color--theme-system)
6. [Email Template Customization](#email-template-customization)
7. [Advanced Customization](#advanced-customization)

---

## Brand & Visual Customization

### Store Name & Title

**Frontend:**
- File: `src/app/layout.js`
- Find: `<title>Chronos`
- Change to: `<title>Your Store Name`

**Navbar:**
- File: `src/components/Navbar.jsx`
- Find: `brandName="Chronos"`
- Change to: `brandName="Your Store Name"`

**Metadata (for SEO):**
- File: `next.config.mjs`
- Update metadata:
```javascript
export const metadata = {
  title: "Your Store Name - Luxury Watches",
  description: "Your custom description here",
}
```

### Logo

**Replace Default Logo:**

1. **Prepare your logo**
   - Format: PNG (transparent background recommended) or SVG
   - Size: At least 200x50px (width x height)
   - Placement: Create file

2. **Upload logo**
   - Save as: `public/logo.png` (or `.svg`)

3. **Update references**
   - File: `src/components/Navbar.jsx`
   - Find: `src="/logo.png"`
   - Update path if different name

4. **Logo on different pages**
   - Admin dashboard: `src/app/(admin)/layout.js`
   - Auth pages: `src/app/auth/layout.js`
   - Footer: `src/components/Footer.jsx`
   - Update all references

**PWA Icon:**
- File: `public/manifest.json`
- Update icons array:
```json
"icons": [
  { "src": "/your-logo-192.png", "sizes": "192x192" },
  { "src": "/your-logo-512.png", "sizes": "512x512" }
]
```

### Favicon

**Update Favicon:**
1. Create favicon: `public/favicon.ico` (32x32 or 64x64)
2. Also create PNG versions:
   - `public/favicon-16x16.png`
   - `public/favicon-32x32.png`
3. Update: `src/app/layout.js`
```jsx
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/favicon-192x192.png" />
```

### Store Name Throughout App

**Find & replace all instances:**
```bash
# In terminal, from project root:
grep -r "Chronos" src/  # Find all mentions
grep -r "chronos" src/  # Find all lowercase mentions
```

**Key files to update:**
- `README.md` - Change description
- `src/app/layout.js` - Title & meta
- `src/components/Footer.jsx` - Footer copyright
- `src/app/(storefront)/contact/page.jsx` - Contact page
- `server/scripts/seed.js` - Product descriptions (optional)

---

## Content Customization

### Homepage Content

**Hero Section:**
- File: `src/components/Hero.jsx`
- Update: `title`, `subtitle`, `cta` text

**Featured Products:**
- File: `src/components/FeaturedProducts.jsx`
- Products automatically pulled from database (marked as "featured")
- Admin can toggle featured status

**How to add featured products:**
1. Go to Admin → Products
2. Edit product
3. Check "Is featured" box
4. Save
5. Product appears on homepage

### Collections/Categories Page

**Update Category Names:**
- File: `src/data/categories.json` (if exists) or
- File: `src/app/(storefront)/shop/page.jsx`
- Find category names, update to your categories

**Product Filters:**
- File: `src/components/ProductFilters.jsx`
- Update filter options (brands, price ranges, styles)

### About Page

**Create/Update About:**
- File: `src/app/(storefront)/about/page.jsx`

Example content structure:
```jsx
export default function About() {
  return (
    <div>
      <h1>About [Your Store]</h1>
      <p>Your story here...</p>
      
      <section>
        <h2>Our Mission</h2>
        <p>What you stand for...</p>
      </section>
      
      <section>
        <h2>Why Choose Us</h2>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      </section>
    </div>
  )
}
```

### Contact Information

**Update Contact Details:**
- File: `src/app/(storefront)/contact/page.jsx`

Current placeholders:
- Email: `support@yourstore.com`
- Phone: Add your number
- Social media links

---

## Store Configuration

### Site URLs

**Frontend URL (Client-side):**
- File: `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Change to production backend
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your domain
```

**Backend URL (Server-side):**
- File: `server/.env`
```env
FRONTEND_URL=http://localhost:3000  # Change to your domain
```

### Business Information

**Email Configuration:**
- File: `server/.env`
```env
SMTP_FROM="Your Store Name <noreply@yourstore.com>"
SMTP_HOST=smtp.gmail.com  # Or your email provider
SMTP_PORT=587
SMTP_USER=your-email@yourstore.com
SMTP_PASS=your-app-password  # Generate from Gmail
```

**Contact Emails:**
- File: `src/app/(storefront)/contact/page.jsx`
- Update `concierge@yourstore.com`
- Update `support@yourstore.com`

**Admin Email:**
- File: `server/.env`
```env
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### Shipping Configuration

**Shipping Rates:**
- File: `server/routes/orders.js` (search for shipping constants)
- Update default shipping cost
- Or configure in Admin → Settings

**Tax Rate:**
- File: `server/.env` (if configurable) or
- File: `server/routes/orders.js`
- Update TAX_RATE constant

---

## Color & Theme System

### Tailwind Color Customization

**File:** `tailwind.config.js`

**Current theme colors:**
```javascript
colors: {
  chronos: '#D4AF37',      // Gold accent - CHANGE THIS
  'dark-bg': '#0a0a0a',   // Background
  'light-text': '#F5F5F5' // Text
}
```

**Change primary color (Gold → Your color):**

1. Find `#D4AF37` (gold) in `tailwind.config.js`
2. Replace with your color hex code
3. Or use Tailwind built-in colors:
```javascript
colors: {
  // Replace gold with your brand color
  ui: {
    gold: '#D4AF37',      // Change this hex value
    dark: '#0a0a0a',
    light: '#F5F5F5'
  }
}
```

**Full Theme Colors:**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // Brand colors
      brand: {
        primary: '#D4AF37',    // Your primary color
        secondary: '#C9A961',  // Your secondary color
        dark: '#0a0a0a',       // Background
        light: '#F5F5F5'       // Text
      },
      
      // Status colors
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      }
    }
  }
}
```

### CSS Variables

**File:** `src/app/globals.css`

Update CSS custom properties:
```css
:root {
  --color-primary: #D4AF37;      /* Your primary color */
  --color-secondary: #C9A961;    /* Your secondary color */
  --color-dark: #0a0a0a;         /* Background */
  --color-light: #F5F5F5;        /* Text */
  
  /* Spacing */
  --spacing-unit: 4px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Dark Mode Toggle

**File:** `src/context/ThemeContext.jsx`

Current setup: Always dark mode (luxury aesthetic)

To allow theme toggle:
```jsx
const [isDarkMode, setIsDarkMode] = useState(true);

// Add toggle function
const toggleTheme = () => {
  setIsDarkMode(!isDarkMode);
  localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
}
```

### Font Customization

**File:** `src/app/layout.js`

Update font imports:
```jsx
import { Playfair_Display, Lato } from 'next/font/google'

// Change to your fonts:
const playfair = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ weight: '400', subsets: ['latin'] })
```

---

## Store Configuration Files

### VIP Tier Customization

**File:** `server/routes/orders.js`

Find TIER_THRESHOLDS:
```javascript
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 20000
}
```

**Change tier thresholds:**
```javascript
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,        // Changed from 1000
  gold: 3000,         // Changed from 5000
  platinum: 10000     // Changed from 20000
}
```

**Update tier perks:**
```javascript
const TIER_PERKS = {
  bronze: { perks: ['Access to catalog'] },
  silver: { perks: ['Free shipping', 'Early drop access'] },
  gold: { perks: ['Free shipping', 'Early drop access', 'Dedicated concierge'] },
  platinum: { perks: ['Free shipping', 'Early drop access', 'White-glove service', 'Private events'] }
}
```

### Rental Configuration

**File:** `server/routes/rentals.js`

```javascript
const RENTAL_CONFIG = {
  dailyRate: 0.015,           // 1.5% of price per day - CHANGE THIS
  depositRate: 0.20,          // 20% security deposit - CHANGE THIS
  availablePeriods: [7, 14, 30], // Days - ADD/REMOVE OPTIONS
  discounts: {
    7: 1.0,    // No discount
    14: 0.9,   // 10% discount
    30: 0.7    // 30% discount
  }
}
```

### Auction Configuration

**File:** `server/routes/auctions.js`

```javascript
const AUCTION_CONFIG = {
  antiSnipingThreshold: 120000,  // milliseconds (2 minutes)
  antiSnipingExtension: 120000   // How much to extend on last-minute bids
}
```

---

## Email Template Customization

### Email

 Templates Location

**Path:** `server/templates/emails/`

Files:
- `orderConfirmation.html`
- `shippingUpdate.html`
- `vipUpgrade.html`
- `passwordReset.html`
- `waitlistNotification.html`

### Customize Email Templates

**Example: Order Confirmation Email**

Open: `server/templates/emails/orderConfirmation.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .header { background-color: #D4AF37; color: #000; padding: 20px; }
      .logo { font-size: 24px; font-weight: bold; }
      /* CUSTOMIZE COLORS HERE */
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">Your Store Name</div>  <!-- CHANGE THIS -->
    </div>
    
    <div class="content">
      <h1>Thank you for your order!</h1>  <!-- CUSTOMIZE TEXT -->
      <p>Order #{{orderId}}</p>
      <p>Total: ${{total}}</p>
      <!-- ADD YOUR CUSTOM MESSAGE HERE -->
    </div>
    
    <div class="footer">
      <p>&copy; 2026 Your Store Name. All rights reserved.</p>  <!-- CHANGE THIS -->
      <p><a href="{{supportUrl}}">Contact Support</a></p>
    </div>
  </body>
</html>
```

**Template Variables Available:**
```
{{orderId}} - Order ID
{{customerName}} - Customer name
{{total}} - Order total
{{itemList}} - Product list
{{trackingNumber}} - Shipping tracking
{{supportEmail}} - Support email
{{storeName}} - Store name
{{storeUrl}} - Store URL
```

### Email Service Setup

**File:** `server/utils/emailService.js`

Update email sender:
```javascript
export const sendOrderConfirmation = async (email, orderData) => {
  const template = fs.readFileSync(
    path.join(__dirname, '../templates/emails/orderConfirmation.html'),
    'utf-8'
  );
  
  const html = template
    .replace('{{storeName}}', 'Your Store Name')  // CHANGE THIS
    .replace('{{orderId}}', orderData.orderId)
    // ... more replacements
  
  return await transporter.sendMail({
    from: process.env.SMTP_FROM,  // "Your Store Name <noreply@yourstore.com>"
    to: email,
    subject: 'Order Confirmed - Your Store Name',  // CUSTOMIZE
    html: html
  });
}
```

---

## Feature Customization

### Disable Features

**Disable AI Concierge:**
- If `ANTHROPIC_API_KEY` not set, feature auto-disables
- Or comment out in `src/components/WatchConcierge.jsx`

**Disable Visual Search:**
- Remove component from product page
- File: `src/app/(storefront)/product/[id]/page.jsx`
- Find: `<VisualSearch />`
- Delete or comment out

**Disable AR Try-On:**
- File: `src/app/(storefront)/product/[id]/page.jsx`
- Remove: `<ARTryOn />`

**Disable Rentals:**
- File: `src/app/(storefront)/product/[id]/page.jsx`
- Remove: `<RentalOption />`

**Disable Auctions:**
- File: `src/app/(storefront)/layout.js`
- Delete auctions route from navbar
- Or disable route: rename `/auctions` to `/auctions.bak`

### Customize Featured Products Count

**File:** `src/components/FeaturedProducts.jsx`

```javascript
// Find:
const featuredWatches = watches.slice(0, 3);  // Shows 3

// Change to:
const featuredWatches = watches.slice(0, 6);  // Shows 6
```

### Customize Product Grid

**File:** `src/components/ProductGrid.jsx`

```javascript
// Grid columns
const gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';  // 4 columns

// Change to:
const gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';  // 3 columns
```

---

## Advanced Customization

### Custom Product Fields

**Add new field to Product model:**
- File: `server/models/Product.js`

```javascript
productSchema.add({
  // New field
  movementType: String,  // mechanical, automatic, quartz
  waterResistance: Number,
  caseSize: String,
  // ... more fields
});
```

Then:
1. Update database
2. Update admin product form
3. Update product display pages

### Custom Pages

**Add new storefront page:**

1. Create file: `src/app/(storefront)/your-page/page.jsx`
2. Add to navbar: `src/components/Navbar.jsx`
3. Add route

Example:
```jsx
// src/app/(storefront)/collections/page.jsx
export default function Collections() {
  return (
    <div>
      <h1>Our Collections</h1>
      <p>Browse our curated collections...</p>
    </div>
  )
}
```

### Custom Integrations

**Add new third-party service:**

1. Get API key
2. Add to `.env`:
```env
CUSTOM_SERVICE_API_KEY=xxxxx
```
3. Create service file: `server/utils/customService.js`
4. Import and use in routes

Example:
```javascript
// server/utils/analytics.js
export const trackCompletion = async (event) => {
  // Send to Google Analytics, Mixpanel, etc.
  await fetch('https://analytics-api.com/track', {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      'Authorization': `Bearer ${process.env.ANALYTICS_KEY}`
    }
  });
}
```

---

## Best Practices

### Before Going Live

- ✅ Update all store names & branding
- ✅ Replace logo & favicon
- ✅ Configure email service (Gmail, SendGrid, etc.)
- ✅ Set correct environment variables
- ✅ Update contact information
- ✅ Customize email templates
- ✅ Seed initial products
- ✅ Test all features
- ✅ Configure payment processor
- ✅ Set up analytics tracking
- ✅ Update terms & privacy pages
- ✅ Test on mobile devices

### After Launch

- ✅ Monitor email delivery
- ✅ Track analytics
- ✅ Gather customer feedback
- ✅ Iterate on design & features
- ✅ Add more products regularly
- ✅ Create marketing campaigns

---

For more information:
- See **FEATURE_GUIDE.md** for feature details
- See **ADMIN_GUIDE.md** for admin panel management
