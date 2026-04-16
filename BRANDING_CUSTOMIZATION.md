# 🎨 CHRONOS BRANDING CUSTOMIZATION GUIDE

**Status:** Ready for Customization  
**Last Updated:** April 16, 2026  
**Customization Level:** Advanced (CSS variables, Next.js config, component props)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Logo & Branding](#logo--branding)
5. [Store Configuration](#store-configuration)
6. [Theme Customization](#theme-customization)
7. [Advanced Css](#advanced-css)
8. [Email Branding](#email-branding)
9. [Components](#components)

---

## Quick Start

**Estimated Time:** 30 minutes for basic branding
**Files to Modify:** 5-7 files
**No Code Knowledge Needed** for basic customization

### Fastest Path to Branded Store

1. **Replace Logo** — 2 minutes
2. **Update Colors** — 5 minutes
3. **Store Name** — 2 minutes
4. **Homepage Content** — 10 minutes
5. **Logo Favicon** — 2 minutes
6. **Test** — 5 minutes

---

## Color System

### Primary Colors

**Location:** `src/app/globals.css`

```css
@layer base {
  :root {
    /* #1: Brand Primary Color */
    --color-primary: #d4af37;        /* Gold accent */
    
    /* #2: Luxury Dark Base */
    --color-dark: #0a0a0a;          /* Pure black */
    
    /* #3: Accent / Secondary */
    --color-accent: #d4af37;        /* Matches primary */
    
    /* #4: Text Colors */
    --color-text-primary: #ffffff;  /* White on dark */
    --color-text-secondary: #b0b0b0; /* Gray accent text */
    
    /* #5: Background Shades */
    --bg-primary: #0a0a0a;          /* Darkest */
    --bg-secondary: #1a1a1a;        /* Dark gray */
    --bg-tertiary: #2a2a2a;         /* Medium dark */
    
    /* #6: Border Colors */
    --border-color: #3a3a3a;        /* Subtle borders */
  }
}
```

### How to Customize

**Change from Gold to Your Brand Color:**

```css
/* BEFORE */
--color-primary: #d4af37;  /* Gold */

/* AFTER - Examples */
--color-primary: #c0272d;  /* Red */
--color-primary: #0066cc;  /* Blue */
--color-primary: #2ecc71;  /* Green */
--color-primary: #9b59b6;  /* Purple */
```

### Tailwind CSS Colors

**Location:** `src/app/(storefront)/page.jsx` and component files

```jsx
// Current: Gold theme
<div className="text-luxury-gold">  {/* Gold */}
<button className="bg-luxury-gold hover:bg-luxury-gold-dark"> {/* Gold button */}

// Change to your color
<div className="text-[#c0272d]">  {/* Your custom color */}
```

---

## Typography

### Font Configuration

**Location:** `src/app/layout.js`

```javascript
import { Geist, Geist_Mono } from "next/font/google";

// Current fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// To change:
// 1. Go to https://fonts.google.com/
// 2. Browse font families
// 3. Import here
// Example:
import { Playfair_Display, Montserrat } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
```

### Font Sizes

**Location:** `src/app/globals.css`

```css
/* Heading sizes */
.heading-1 { @apply text-5xl font-bold; }   /* 48px - Page titles */
.heading-2 { @apply text-4xl font-bold; }   /* 36px - Section titles */
.heading-3 { @apply text-3xl font-semibold; } /* 30px - Subsections */
.body-text { @apply text-lg leading-relaxed; } /* 18px - Body copy */
.small-text { @apply text-sm text-gray-400; }  /* 14px - Captions */
```

---

## Logo & Branding

### Step 1: Replace Logo

**Location:** `public/logo.png` and `public/logo-white.png`

```bash
# Replace these files with your logo:
# 1. public/logo.png           (512x512, your main logo)
# 2. public/logo-white.png     (512x512, white version for dark bg)
```

### Step 2: Update Favicon

**Location:** `public/favicon.png`

```bash
# Favicon (16x16, 32x32, 64x64)
# Replace: public/favicon.png
```

### Step 3: Update Logo References

**Location:** `src/components/Navbar.jsx`

```jsx
// BEFORE
<img src="/logo.png" alt="Chronos" className="h-8 w-auto" />

// AFTER - Add your store name
<img src="/logo.png" alt="Your Store Name" className="h-8 w-auto" />
```

**Location:** `src/components/Footer.jsx`

```jsx
// BEFORE
<p className="text-sm text-gray-400">© 2026 Chronos. All rights reserved.</p>

// AFTER
<p className="text-sm text-gray-400">© 2026 {YOUR_STORE_NAME}. All rights reserved.</p>
```

### Step 3: Update Metadata

**Location:** `src/app/layout.js`

```jsx
export const metadata = {
  title: "Your Store - Luxury Timepieces",  // CHANGE THIS
  description: "Your tagline here.",        // CHANGE THIS
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};
```

---

## Store Configuration

### Store Name & Details

**Location:** `server/config/store.js` (Create this file)

```javascript
export const STORE_CONFIG = {
  name: "Your Store Name",
  tagline: "Your brand tagline",
  email: "support@yourstore.com",
  phone: "+1 (555) 123-4567",
  address: "123 Luxury Ave, City, State 12345",
  
  // Social Media
  social: {
    instagram: "https://instagram.com/yourstore",
    facebook: "https://facebook.com/yourstore",
    twitter: "https://twitter.com/yourstore",
  },
  
  // Brand Colors (RGB for consistency)
  colors: {
    primary: "#c0272d",     // Your primary color
    secondary: "#1a1a1a",   // Secondary color
    accent: "#d4af37",      // Accent color
  },
  
  // Policies
  policies: {
    shipping: "Free shipping on orders over $5,000",
    returns: "30-day return policy",
    warranty: "2-year warranty on all watches",
  }
};
```

### Email Branding

**Location:** `server/templates/emails/` — All HTML templates

```html
<!-- Update in all email templates -->

<!-- BEFORE -->
<p>© 2026 Chronos Luxury Watches. All rights reserved.</p>

<!-- AFTER -->
<p>© 2026 Your Store Name. All rights reserved.</p>
```

---

## Theme Customization

### Dark Mode (Default)

The template uses dark mode by default. To customize:

**Location:** `src/app/globals.css`

```css
/* Option 1: Keep dark, change accent colors */
:root {
  --color-primary: #your-brand-color;
}

/* Option 2: Create light theme variant */
.light-theme {
  --bg-primary: #ffffff;
  --color-text-primary: #1a1a1a;
}
```

### Component Styling

**Location:** `src/components/ProductCard.jsx`

```jsx
// Customize card appearance
<div className="bg-luxury-black border border-luxury-gold rounded-lg p-6">
  {/* Change these classes to match your brand */}
  {/* luxury-black → your-bg-color */}
  {/* luxury-gold → your-primary-color */}
</div>
```

---

## Advanced CSS

### Tailwind Configuration

**Location:** `tailwind.config.js`

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Update to your brand colors
        'luxury-black': '#0a0a0a',
        'luxury-gold': '#d4af37',
        'luxury-dark': '#1a1a1a',
        
        // Add your brand colors
        'brand-primary': '#c0272d',
        'brand-secondary': '#1a1a1a',
        'brand-accent': '#d4af37',
      },
      fontFamily: {
        // Custom fonts
        sans: ['Geist', 'system-ui'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
};
```

### CSS Variables

**Location:** `src/app/globals.css`

```css
/* Color variables */
:root {
  --primary: #d4af37;
  --secondary: #0a0a0a;
  --accent: #d4af37;
  --text: #ffffff;
  --border: #3a3a3a;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.7);
}

/* Use in CSS */
.card {
  background-color: var(--secondary);
  border-color: var(--border);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}
```

---

## Email Branding

### Email Templates

**Location:** `server/templates/emails/`

**Files to Update:**

1. `orderConfirmation.html`
2. `paymentConfirmation.html`
3. `vipTierUpgrade.html`
4. `shippingUpdate.html`
5. `serviceReminder.html`
6. `passwordReset.html`
7. `dropEarlyAccess.html`
8. `giftRevealLink.html`

### Email Header Customization

**In each template:**

```html
<!-- BEFORE -->
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <h1>Payment Confirmed! 🎉</h1>
</div>

<!-- AFTER - Your brand colors -->
<div style="background: linear-gradient(135deg, #c0272d 0%, #8B1A1F 100%);">
    <h1 style="color: #ffffff;">Payment Confirmed! 🎉</h1>
</div>
```

### Email Logo

```html
<!-- In emails, update logo -->
<img src="https://yourdomain.com/logo-white.png" alt="Your Store" style="max-width: 200px;" />
```

---

## Components

### Homepage Hero Section

**Location:** `src/components/Hero.jsx`

```jsx
export default function Hero() {
  return (
    <div className="hero-section">
      {/* Update headline */}
      <h1 className="text-6xl font-bold">
        Your Store Name
      </h1>
      
      {/* Update tagline */}
      <p className="text-xl text-gray-400">
        Your brand tagline here
      </p>
      
      {/* Update CTA button color */}
      <button className="bg-your-brand-color hover:bg-brand-darker">
        Shop Now
      </button>
    </div>
  );
}
```

### Navigation Bar

**Location:** `src/components/Navbar.jsx`

```jsx
<nav className="navbar">
  {/* Logo */}
  <img src="/logo.png" alt="Your Store" />
  
  {/* Store name */}
  <span className="brand-name">Your Store Name</span>
  
  {/* Navigation links */}
  <ul>
    <li><a href="/shop">Shop</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

### Footer Content

**Location:** `src/components/Footer.jsx`

```jsx
<footer className="footer">
  <div className="footer-content">
    {/* Store info */}
    <h3>Your Store Name</h3>
    <p>Your tagline</p>
    <p>Email: support@yourstore.com</p>
    <p>Phone: +1 (555) 123-4567</p>
    
    {/* Social links */}
    <div className="social-links">
      <a href="https://instagram.com/yourstore">Instagram</a>
      <a href="https://facebook.com/yourstore">Facebook</a>
    </div>
  </div>
</footer>
```

---

## Implementation Checklist

### Phase 1: Core Branding (15 minutes)
- [ ] Replace `public/logo.png`
- [ ] Replace `public/favicon.png`
- [ ] Update `src/app/layout.js` metadata
- [ ] Change primary color in `globals.css`

### Phase 2: Content (15 minutes)
- [ ] Update homepage hero text
- [ ] Update footer company info
- [ ] Update navbar brand name
- [ ] Update email sender name

### Phase 3: Advanced (20 minutes)
- [ ] Create `server/config/store.js`
- [ ] Update Tailwind color variables
- [ ] Customize email templates
- [ ] Test all pages for consistency

### Phase 4: Testing (10 minutes)
- [ ] Check logo appears correctly
- [ ] Verify colors match brand
- [ ] Test email templates
- [ ] Test on mobile devices

---

## Examples: Pre-Made Color Schemes

### Luxury Red
```css
--color-primary: #c0272d;
--color-dark: #0a0a0a;
--color-accent: #d4af37;
```

### Ocean Blue
```css
--color-primary: #0066cc;
--color-dark: #0a0e27;
--color-accent: #00a3cc;
```

### Emerald Green
```css
--color-primary: #2ecc71;
--color-dark: #0a1505;
--color-accent: #1abc9c;
```

### Mirror Black & Silver
```css
--color-primary: #c0c0c0;
--color-dark: #0a0a0a;
--color-accent: #e8e8e8;
```

---

## Testing Your Branding

### Browser Testing
```bash
# Start development server
npm run dev

# Open http://localhost:3000
# Check:
# 1. Logo appears correctly
# 2. Colors are consistent
# 3. Text is readable
# 4. Mobile responsive
```

### Mobile Responsiveness
- iPhone 12/13/14
- Samsung Galaxy S21
- iPad Air
- Desktop (1920x1080)

### Email Testing
```bash
# Send test email
node test-email.js

# Check:
# 1. Logo displays
# 2. Colors render
# 3. Links work
# 4. Mobile readable
```

---

## Troubleshooting

### Logo Not Showing
1. Check file exists: `public/logo.png`
2. Verify file size < 5MB
3. Use PNG with transparency
4. Clear browser cache (Ctrl+Shift+R)

### Colors Incorrect
1. Check CSS variable values
2. Clear Tailwind cache: `rm -rf .next`
3. Rebuild: `npm run build`
4. Verify hex colors are valid

### Email Layout Broken
1. Test in different email clients
2. Check inline CSS is valid
3. Verify image URLs are absolute
4. Test with email preview tools

---

## Advanced Customization

### Custom Google Fonts
```bash
# 1. Go to https://fonts.google.com
# 2. Select fonts for display + body
# 3. Copy import code
# 4. Add to src/app/layout.js
```

### Custom Domain Email
```bash
# Your email from setup
SMTP_FROM=support@yourdomain.com

# Test with:
node server/test-stripe-email.js
```

---

## Next Steps

1. ✅ Customize colors to match your brand
2. ✅ Replace logo and favicon
3. ✅ Update all text (store name, tagline, etc.)
4. ✅ Test on all devices
5. ✅ Update email templates
6. ✅ Deploy to production

**Ready to customize?** Follow Phase 1 above (15 minutes), then test!

---

**Need Help?** All customization can be done without touching backend code. Focus on CSS and content only!
