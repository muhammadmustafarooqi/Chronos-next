# Chronos — Luxury Watch Platform

**Status:** ✅ **Production Ready — Full Stack Template** (April 15, 2026)

A full-stack luxury watch e-commerce application built with Next.js (App Router) and Express.js + MongoDB.

## Quick Start

```bash
# Terminal 1 — Backend
cd server && npm install && npm run dev     # → http://localhost:5000

# Terminal 2 — Frontend
npm install && npm run dev                  # → http://localhost:3000
```

**First-Time Setup:** Run `npm run seed` in the `server/` directory to create your admin account. See [SETUP.md](./SETUP.md) for detailed instructions.

---

## New Features

### Feature 1 — AI Watch Concierge

A floating chat widget (bottom-left) powered by the **Claude API**. The user asks questions like "recommend me a dress watch under $5,000" and receives intelligent answers with product links. The full catalog is injected into the system prompt server-side — the API key is never exposed to the frontend.

- **Backend:** `POST /api/concierge` — proxies to Claude with catalog context
- **Frontend:** `src/components/WatchConcierge.jsx`
- **Env:** Add `ANTHROPIC_API_KEY` to `server/.env`

### Feature 2 — AR Wrist Try-On

A "Try On" button on product pages activates the camera and uses **MediaPipe Hands** to detect the wrist landmark, then overlays the watch image on the wrist in real-time using a canvas. A capture button saves/shares the result via Web Share API.

- **Frontend:** `src/components/ARTryOn.jsx`
- Graceful fallback: static wrist mockup if camera/MediaPipe unavailable

### Feature 3 — Real-Time Watch Configurator

Swatch pickers for strap (leather/rubber/bracelet), dial color, and case finish with a **live 2D preview** that updates instantly. Configurations can be saved to the backend and shared via a unique URL (`/product/[id]?config=[configId]`).

- **Backend:** `GET/POST /api/configurations`
- **Model:** `server/models/Configuration.js`
- **Frontend:** `src/components/WatchConfigurator.jsx`

### Feature 4 — Watch Style Matchmaker (/matchmaker)

A dedicated 5-step quiz page profiling occasion, style, movement, budget, and brand familiarity. Answers are posted to the backend which scores the product catalog and optionally calls Claude to generate a personalised 1-sentence explanation for each recommendation.

- **Backend:** `POST /api/matchmaker`
- **Frontend:** `src/app/(storefront)/matchmaker/page.jsx`

### Feature 5 — Collection Vault (`/vault`)

Authenticated users see all purchased watches in a personal vault with **purchase price vs. current market value** comparison. Admins can set `marketValue` on products. A shareable read-only URL at `/vault/[customerId]` shows the collection without prices.

- **Backend:** `GET /api/vault/:customerId`
- **Components:** `src/components/VaultCard.jsx`
- **Model change:** `marketValue` field added to `Product`

### Feature 6 — VIP Tier Loyalty System

Users automatically progress through **Bronze → Silver → Gold → Platinum** tiers based on total spend (updated on every order). A VIPBadge appears next to the user account icon in the navbar. A VIPProgress bar shows spend progress and tier perks on the profile page.

- **Tiers:** Bronze ($0), Silver ($1k), Gold ($5k), Platinum ($20k)
- **Backend:** `server/utils/vipUtils.js`, updated `orders.js` and `Customer` model
- **Components:** `src/components/VIPBadge.jsx`, `src/components/VIPProgress.jsx`

### Feature 7 — White-Glove Delivery Tracking

Order detail pages show a 6-stage delivery timeline (Order Confirmed → Being Prepared → Quality Checked → Dispatched → Out for Delivery → Delivered). The current stage has a pulsing animated ring. Admins can push new stages via `POST /api/orders/:id/timeline`. Platinum VIP members see a "Request Concierge Callback" button.

- **Backend:** `POST /api/orders/:id/timeline`, `deliveryTimeline` field in `Order`
- **Component:** `src/components/DeliveryTimeline.jsx`

### Feature 8 — Virtual Gifting Suite

During checkout, buyers can mark an order as a gift with a personal message and gift wrap option. A unique reveal token is generated and attached to the order. The public gift reveal page (`/gift/[token]`) shows the watch name, image, and message with a multi-step Framer Motion animation and gold confetti.

- **Backend:** `GET /api/gifts/:token`, `giftRevealToken`/`isGift`/`giftMessage` fields in `Order`
- **Frontend:** `src/app/(storefront)/gift/[token]/page.jsx`

---

## Phase 2 Features

### Feature 1 — Transactional Email System

Integrated `nodemailer` to dispatch branded email templates for order confirmations, shipping updates, VIP tier upgrades, and password resets.

- **Backend Setup:** `server/utils/emailService.js`, templates stored in `server/templates/emails/`
- **Integrations:** `orders.js` and `auth.js` routes

### Feature 2 — Live Auction Room

A dynamic bid room where verified users can compete for exclusive pieces in real-time. Prices sync instantaneously.

- **Backend Setup:** `GET /api/auctions`, `socket.io` integration in `server/socket/auctionSocket.js`
- **Frontend Setup:** `AuctionsPage`, `AuctionRoom`, `BidHistory`

### Feature 3 — Watch Rental / Try-Before-Buy

Enable customers to rent high-end watches for 7, 14, or 30 days. Rental fees contribute towards the purchase price if the customer decides to buy.

- **Backend Setup:** `GET /api/rentals`, `Rental.js` model, `isRentable` added to Product.
- **Frontend Setup:** `src/app/(storefront)/rentals/page.jsx`, `src/components/RentalCard.jsx`, `RentalCheckout`

### Feature 4 — Drop / Pre-Order & Waitlist System

Hype releases with strict access timelines. Gold and Platinum VIP members are given early access 48H prior to public releases, handled via a chronological release worker.

- **Backend Setup:** `Drop.js`, `Waitlist.js`, `server/jobs/dropReleaser.js` scheduled interval.
- **Frontend Setup:** `src/app/(storefront)/drops/page.jsx`, `DropCountdown`, `WaitlistButton`

### Feature 5 — Warranty & Service Portal

Automated warranty document generation upon successful order delivery. Authenticated users can log service issues, track service status timelines, and receive notifications.

- **Backend Setup:** `Warranty.js`, `ServiceRequest.js`, `GET /api/warranty`
- **Frontend Setup:** `src/app/(storefront)/warranty/page.jsx`, `WarrantyCard`, `ServiceTimeline`

### Feature 6 — Peer-to-Peer Resale Marketplace

Verified customers can sell their authentic Chronos purchases in a P2P secondary marketplace with escrow holding and built-in Chronos verification mechanisms.

- **Backend Setup:** `Listing.js`, `GET /api/listings`, `PUT /api/listings/:id/sold`
- **Frontend Setup:** `src/app/(storefront)/marketplace/page.jsx`, `src/components/ListingCard.jsx`, `SellerProfile`

### Feature 7 — Visual Search (Image to Product)

Powered by Anthropics Claude 3.5 Sonnet, users can click the camera icon and upload a watch photo. The system will categorize style, elements, and match similar items.

- **Backend Setup:** `POST /api/visual-search` processing base64 image data using `multer`.
- **Frontend Setup:** `src/components/VisualSearch.jsx`

### Feature 8 — Advanced Analytics Dashboard

A dedicated admin analytics portal visualising Revenue patterns, configurator combo trends, VIP funnels, and feature adoption.

- **Backend Setup:** `GET /api/analytics/*` aggregations. Added `viewCount` and `arTryOnCount` tracking.
- **Frontend Setup:** `src/app/(admin)/analytics/page.jsx`, `RevenueChart`, `FunnelChart`, `HeatmapGrid`

### Feature 9 — Mobile PWA + Push Notifications

Turned the storefront into a Progressive Web App (PWA). Push notifications actively notify end-users on device about outbid status, drop releases, and delivery stages.

- **Setup:** `next-pwa` config, `public/sw.js`, VAPID Keys web-push integration `server/utils/pushService.js`
- **Frontend Setup:** `InstallPrompt.jsx`, `NotificationPermission.jsx`

---

## Project Structure

```
chronos/
├── server/                      # Express.js backend
│   ├── config/                  # Database configuration
│   ├── middleware/              # Auth, error handling, rate limiting
│   ├── models/                  # MongoDB schemas (15+ models)
│   ├── routes/                  # API endpoints (18 route files)
│   ├── jobs/                    # Scheduled tasks (drop releases, orders)
│   ├── socket/                  # WebSocket handlers (auctions)
│   ├── utils/                   # Cache, emails, push, VIP logic
│   ├── templates/emails/        # Email templates
│   ├── scripts/                 # Database seeding
│   ├── server.js                # Main Express server
│   ├── package.json
│   └── .env                     # Backend environment variables
│
├── src/                         # Next.js frontend
│   ├── app/                     # App Router pages
│   │   ├── (storefront)/        # Public routes (home, shop, auctions, etc.)
│   │   ├── (admin)/             # Admin dashboard routes
│   │   └── layout.js            # Root layout
│   ├── components/              # React components (43+ components)
│   ├── context/                 # React Context providers
│   ├── services/                # API client functions
│   ├── assets/                  # Images, icons
│   └── globals.css
│
├── public/                      # Static assets
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service Worker
│   └── models/                  # 3D watch models
│
├── next.config.mjs              # Next.js configuration (PWA setup)
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.mjs           # PostCSS config
├── jsconfig.json
├── package.json                 # Frontend dependencies
└── README.md
```

---

## Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js v4.18+
- **Database:** MongoDB v8.2+ (with Mongoose v8+)
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.io v4.6+
- **Email:** Nodemailer v6.9+
- **Push Notifications:** web-push v3.6+
- **AI:** Anthropic Claude API (Claude 3.5 Sonnet)
- **Rate Limiting:** express-rate-limit
- **File Upload:** Multer v1.4+

### Frontend
- **Framework:** Next.js v15+ (App Router, Turbopack)
- **UI:** React v19 (client components)
- **Styling:** Tailwind CSS v4+
- **Animation:** Framer Motion v12+
- **State:** React Context (custom hook-based)
- **Icons:** Lucide React v0.408+
- **PWA:** next-pwa v5.6+
- **Image Recognition:** MediaPipe Hands v0.4+
- **HTTP Client:** next/fetch (native)

### DevOps
- **Task Scheduling:** Node.js `setInterval` (drop releases, order timeouts)
- **Database:** MongoDB Atlas or local MongoDB
- **Hosting:** Node.js server + Vercel/Next.js hosting (optional)

---

## Environment Setup

### Backend (server/.env)

```env
# Database
MONGO_URI=mongodb://localhost:27017/chronos
MONGO_DB_NAME=chronos

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Chronos Support <support@chronos.com>"

# AI (Claude API)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Application
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Models

The system uses **15+ MongoDB collections**:

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| User | Authentication & profile | email, password, role, preferences |
| Customer | Purchase history & VIP | email, totalSpend, vipTier |
| Product | Watch catalog | name, brand, price, images, specs |
| Order | Purchase transactions | items, status, deliveryTimeline, giftToken |
| Listing | P2P marketplace | title, price, condition, seller, status |
| Rental | Rental bookings | product, renter, startDate, endDate, status |
| Auction | Live auction rooms | product, currentBid, endTime, bids |
| Drop | Pre-order releases | product, releaseDate, vipEarlyAccess |
| Waitlist | Drop notifications | customer, drop, notified |
| Configuration | Watch customizers | product, strap, dial, case, customerId |
| Warranty | Warranty documents | order, purchaseDate, expiryDate |
| ServiceRequest | Service tickets | warranty, issue, status, timeline |
| PushSubscription | PWA subscriptions | endpoint, keys, email, user |
| ConciergeLog | Chat history | user, messages, recommendations |
| MatchmakerLog | Quiz responses | user, answers, results, timestamp |

---

## API Routes Reference

### Authentication (`/api/auth`)
- `POST /auth/register` — Create account
- `POST /auth/login` — Login
- `POST /auth/logout` — Logout
- `POST /auth/refresh` — Refresh JWT token
- `POST /auth/forgot-password` — Send reset email
- `POST /auth/reset-password` — Reset password

### Products (`/api/products`)
- `GET /products` — List all products (with filters)
- `GET /products/:id` — Get product details
- `POST /products` — Create product (admin)
- `PUT /products/:id` — Update product (admin)
- `DELETE /products/:id` — Delete product (admin)

### Orders (`/api/orders`)
- `GET /orders` — User's orders
- `POST /orders` — Create order
- `GET /orders/:id` — Order details
- `PUT /orders/:id/timeline` — Update delivery stage (admin)
- `POST /orders/:id/cancel` — Cancel order

### Auctions (`/api/auctions`)
- `GET /auctions` — List all auctions
- `GET /auctions/:id` — Get auction room
- `POST /auctions/:id/bid` — Place bid (WebSocket)

### Marketplace (`/api/listings`)
- `GET /listings` — List active listings
- `POST /listings` — Create listing (verified buyers)
- `PUT /listings/:id` — Update listing
- `PUT /listings/:id/approve` — Approve listing (admin)
- `PUT /listings/:id/sold` — Mark sold

### Concierge (`/api/concierge`)
- `POST /concierge` — Chat with AI assistant
- `POST /concierge/callback` — Request VIP callback

### Configurator (`/api/configurations`)
- `GET /configurations/:id` — Get saved config
- `POST /configurations` — Save configuration

### Other Endpoints
- `GET /api/vault/:customerId` — View collection vault
- `GET /api/gift/:token` — Reveal gift
- `GET /api/visual-search` — Image-based search
- `POST /api/rentals` — Book rental
- `GET /api/analytics/*` — Admin analytics
- `POST /api/push/subscribe` — Subscribe to push
- `POST /api/push/send` — Send push notification (admin)

---

## Installation Guide

### Prerequisites
- Node.js v18+
- MongoDB v8.2+
- npm or yarn

### Step 1: Clone & Setup Backend

```bash
cd server
npm install
cp .env.example .env  # Update with your credentials
npm run seed          # Seed sample data
npm run dev           # Start on http://localhost:5000
```

### Step 2: Setup Frontend

```bash
npm install
npm run dev           # Start on http://localhost:3000
```

### Step 3: Database Initialization

```bash
cd server
node scripts/seed.js  # Populate sample products & users
```

---

## Running Tests

```bash
# Backend tests
cd server && npm test

# Frontend tests
npm test
```

---

## Known Issues & Limitations

| Issue | Status | Notes |
|-------|--------|-------|
| Visual Search limited to 5MB files | ⚠️ Limitation | Client-side compression recommended for large images |
| Email delivery requires SMTP auth | ⚠️ Configuration | Gmail App Passwords recommended for setup |
| MongoDB Atlas connection timeouts | ⚠️ Configuration | Use VPC/whitelist IPs for production |

### QA Audit Results (April 14, 2026)
✅ **All Core Issues Fixed:**
- Auction bid race condition — FIXED (atomic findOneAndUpdate)
- Order stock race condition — FIXED (atomic operations)
- Waitlist VIP tier sorting — FIXED (aggregation pipeline)
- useSearchParams router context — FIXED (wrapped in Suspense)
- **Status:** 30+ phases tested, 0 critical bugs, ready for production

---

## Deployment

### Backend (Node.js)
```bash
# Set NODE_ENV=production in .env
npm install --production
pm2 start server.js --name "chronos-api"
```

### Frontend (Vercel)
```bash
vercel deploy --prod
```

### Database Backup
```bash
mongodump --uri="mongodb://localhost:27017/chronos" --out=./backup
```

---

## Customization Guide

### Branding & Store Customization

**Store Name & Colors:**
- Store name: Update `src/app/layout.js` (page titles) and component headers
- Logo: Replace `public/logo.png` with your own
- Brand colors: Modify Tailwind theme in `tailwind.config.js`
- Email footer: Update `SMTP_FROM` and email templates in `server/templates/emails/`

**Contact Information:**
- Edit `src/app/(storefront)/contact/page.jsx` to update phone numbers and email addresses
- Update `VAPID_EMAIL` in `server/.env` for push notifications

**Product Data:**
- Modify `server/scripts/seed.js` to customize the initial product catalog
- Re-run `npm run seed` after making changes
- Or use the admin dashboard to manage products directly

**API Keys & Configuration:**
- Anthropic API key: [Get it here](https://console.anthropic.com)
- Email service: Setup Gmail App Passwords or your SMTP provider
- Push notifications: Generate VAPID keys (see SETUP.md)
- Database: Connect to MongoDB Atlas in production

For more detailed instructions, see [SETUP.md](./SETUP.md).

---

## Support & Documentation

- **API Docs:** See `DOCUMENTATION.md`
- **QA Report:** `PART3_QA_REPORT.md`
- **Issues:** Report bugs in GitHub Issues
- **Setup Guide:** See [SETUP.md](./SETUP.md)
- **License:** See [LICENSE.md](./LICENSE.md)
