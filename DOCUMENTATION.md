# Chronos Platform Architecture Documentation

## 1. Project Overview

Chronos is a fully-featured, ultra-premium luxury watch e-commerce ecosystem built to provide collectors with an unparalleled digital experience. Combining hyper-modern aesthetic designs, 3D immersive elements, and AI-driven concierge services, Chronos serves both as a marketplace and a comprehensive lifestyle platform. By offering features such as an interactive AR/3D watch configurator, automated VIP tiering, live socket-based auctions, secure waitlists for exclusive drops, a rent-to-own trial program, transparent warranty handling, an AI visual search matching engine, and a verified P2P escrow marketplace, the platform bridges the gap between high-end retail craftsmanship and cutting-edge web technology.

## 2. Technology Stack

**Frontend**

- **Framework**: Next.js 16.2.3 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion 12, standard CSS transitions
- **3D/AR**: Three.js, @react-three/fiber, @react-three/drei, MindAR for Web (React module)
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Axios and native fetch
- **PWA**: next-pwa for offline capabilities and caching

**Backend**

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose 8
- **Real-time**: Socket.io (for Live Auctions)
- **Security**: Helmet, express-mongo-sanitize, xss-clean, express-rate-limit, cors
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **File Uploads**: Multer
- **Background Jobs**: node-cron

**Integrations & Utilities**

- **AI Engine**: Anthropic Claude 3.5 Sonnet (for AI Concierge and Visual Search)
- **Email**: Nodemailer (SMTP integration for transactional emails)
- **Push Notifications**: web-push with VAPID keys

## 3. Environment Variables

Below are the `.env` variables utilized in the project and their core purposes.

**Backend (`server/.env`)**

- `PORT`: Port for the Express server (default: 5000)
- `NODE_ENV`: Application environment (`development` or `production`)
- `MONGODB_URI`: Connection string for the MongoDB instance
- `JWT_SECRET` / `JWT_EXPIRE`: Secret key and expiration duration for JWT authentication
- `FRONTEND_URL`: URL of the frontend application for CORS configuration
- `ANTHROPIC_API_KEY`: API key for Claude 3.5 Sonnet integration (Visual Search & Concierge)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: Nodemailer credentials for the automated transactional email system
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`: Keys required by the `web-push` service to deliver browser push notifications
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Credentials for the default admin account seeded during database initialization

**Frontend (`.env.local` / `.env`)**

- `NEXT_PUBLIC_API_URL`: The base URL pointing to the Express backend (e.g., `http://localhost:5000`)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: The public VAPID key utilized by the service worker to subscribe clients for push notifications

## 4. Project File Structure

```text
Chronos/
├── package.json (Frontend dependencies & scripts)
├── next.config.mjs (Next.js configurations & PWA setup)
├── public/ (Static assets like fonts, placeholder imagery, and PWA manifest)
├── src/
│   ├── app/ (Next.js App Router structure: pages, layouts, globals.css)
│   ├── components/ (Reusable UI components: Navbar, ProductCard, LiveAuctionRoom, Admin charts, etc.)
│   ├── context/ (React Context providers: Auth, Cart, Watch, VIP, VIPContext, etc.)
│   └── services/ (Frontend API wrapper api.js, auth logic, service worker registration)
└── server/
    ├── package.json (Backend dependencies)
    ├── server.js (Express application entry point, route mounts, middleware setup)
    ├── models/ (Mongoose schema definitions: User, Product, Order, Auction, Configuration, Drop, Listing, Rental, ServiceRequest, Warranty)
    ├── routes/ (Express routers for handling API endpoints grouped by domain)
    ├── controllers/ (Logic mapped to specific API endpoints)
    ├── middleware/ (Auth protection, rate limiters, admin verification)
    ├── services/ (Complex backend logic: EmailService, PushService)
    ├── socket/ (Dedicated Socket.io handlers for specific modules like auctionSocket.js)
    ├── utils/ (Helpers: vipUtils.js, catchAsync.js, cache.js, AppError.js)
    ├── jobs/ (Cron jobs: dropReleaser.js)
    └── scripts/ (Database administration scripts: seed.js)
```

## 5. Database Models

- **User**: Handles authentication and profile data. _Virtuals_: N/A. _Methods/Hooks_: `matchPassword`, pre-save bcrypt hash.
- **Customer**: Represents e-commerce specific data extending the User (shipping, billing).
- **Product**: Catalog definition for watches (brand, features, price, stock, specs).
- **Order**: Handles checkout, tracking, and delivery timeline. _Methods/Hooks_: Pre-validate hook for `orderId` generation, dynamic delivery timeline structure.
- **Configuration**: Stores 3D configurations specified by exactly users (custom dials, straps).
- **Auction**: Manages live auction events. _Virtuals/Hooks_: Time extension logic to prevent sniping; tracking of current highest bid and bidders array.
- **Drop**: Defines exclusive limited releases with start times and associated waitlists.
- **Waitlist**: Associates users with specific Product drops, storing push/email notification statuses.
- **Listing**: Powers the P2P Escrow Marketplace. Flags for Chronos verification, seller reference, and item condition.
- **Rental**: Tracks 7/14/30-day trial periods, associating products, users, rental fees, and security deposits.
- **Warranty**: Activated upon order delivery; tracks product serial numbers, expiration dates, movement type, and next service due dates.
- **ServiceRequest**: Tied to the Warranty module; tracks the status lifecycle of a watch repair/service (submitted, received, in-service, ready, returned).
- **Cart/Wishlist**: Often embedded arrays or managed via UI context and specialized endpoints without heavy standalone schemas in this architecture.

## 6. API Endpoints

All backend endpoints are prefixed with `/api`.

- `/auth`: `/register`, `/login`, `/me` (Creates/Authenticates user, fetches session)
- `/products`: `GET /`, `GET /:id` (Catalog fetching with extensive filtering)
- `/orders`: `POST /`, `GET /myorders`, `GET /:id` (Checkout processing, updating VIP spend logic, and order retrieval)
- `/customers`: `GET /profile`, `PUT /profile` (Profile fetching and updating)
- `/wishlist`: `GET /`, `POST /:productId`, `DELETE /:productId` (Manages user specific wishlist persistence)
- `/admin`: Broad routing for administrative control (user lists, dashboard aggregates via `analytics` sub-routes)
- `/concierge`: `POST /` (Interfaces with Claude API. Retains full chat history and uses RAG against product DB)
- `/configurations`: `POST /`, `GET /` (Saves/Renders user's custom 3D watch designs)
- `/matchmaker`: `POST /` (Uses weighted backend algorithm to recommend watches based on quiz)
- `/vault`: `GET /`, `POST /`, `PUT /`, `DELETE /` (Digital asset tracking for collection management)
- `/gifts`: `POST /`, `GET /:token` (Virtual gifting suite processing)
- `/auctions`: `GET /`, `GET /:id`, `POST /:id/bid` (Auction room state and bid registration)
- `/drops`: `GET /`, `POST /:id/waitlist` (Release windows and waitlist signups)
- `/listings`: `GET /`, `POST /`, `PUT /:id/status` (P2P marketplace endpoints)
- `/rentals`: `POST /`, `GET /my-rentals` (Handles reservations and deposit calculations)
- `/warranties`: `GET /my-warranties`, `GET /:serial` (Digital passport retrieval)
- `/service`: `POST /`, `GET /:id`, `PUT /:id/status` (Service portal tracking)
- `/visual-search`: `POST /` (Utilizes multer for upload, Claude API for image detection to match catalog items)
- `/push`: `POST /subscribe` (Stores VAPID push subscriptions for a user)

## 7. Context Providers

The React frontend handles global state via standard contextual providers:

- **AuthContext**: Manages active User sessions, JWT presence, and login/logout abstractions.
- **CartContext**: Handles localized shopping cart actions (add, remove, total calculation).
- **WishlistContext**: Tracks saved items locally and syncs with backend persistence.
- **VIPContext**: Syncs user spend against the global Tier calculation thresholds. Automatically adjusts tier badges, progress bars, and exclusive pricing logic.
- **WatchContext**: Preloads the global catalog. Facilitates client-side filtering, sorting, and pagination.
- **OrderContext**: Provides history and localized tracking hooks for past purchases.
- **CustomerContext**: General profile data state wrapper.
- **RecentlyViewedContext**: Uses local storage to maintain a queue of the user's latest viewed products.
- **ThemeContext**: Global styling definitions.
- **ToastContext**: Universal notification wrapper for error, success, and info flashes.

## 8. Utility Services & Integrations

- **`emailService.js`**: Reusable NodeMailer abstraction utilizing strict HTML templates (e.g. `sendOrderConfirmation`, `sendVIPUpgrade`, `sendWaitlistNotification`).
- **`pushService.js`**: Implementation of `web-push` library exposing `sendPush` functions to ping enrolled browsers.
- **`vipUtils.js`**: Centralized logic defining Spend Thresholds (Bronze: $0, Silver: $1k, Gold: $5k, Platinum: $20k) and perk assignments. Used by the order controller to detect post-purchase upgrades.
- **`auctionSocket.js`**: Binds to the core Express HTTP server structure. Orchestrates `placeBid` events, enforces a 2-minute anti-sniping extension rule, and broadcasts real-time `auctionUpdate` packets.
- **`dropReleaser.js`**: `node-cron` scheduled background job. Runs repeatedly to check Drop timestamps, transition them from 'upcoming' to 'live', and fire off mass Push and Email notifications to enrolled Waitlist users.
- **`catchAsync.js` / `AppError.js`**: Standardized Express error handling wrappers enforcing reliable JSON responses on failures.

## 9. Feature Breakdowns

**Phase 1 Foundation**
The standard e-commerce flow involving a highly stylized aesthetic, user auth, dynamic product catalog, detailed single product display, cart, and simulated checkout mechanism. Employs sophisticated dark-theme luxury design queues using Tailwind CSS and Framer Motion for cinematic scroll and reveal animations.

**1. Live Auction Room**

- **Architecture**: Uses Socket.io mounted in `server.js` matching UI `Auctions.jsx` logic.
- **Interaction**: Admins assign products to an Auction. Users join real-time rooms. Bids are broadcasted. If a bid occurs in the last 2 minutes, `auctionSocket.js` immediately extends the timer by 120 seconds.

**2. Watch Rental System**

- **Architecture**: Combines `Rental` models, `/api/rentals`, and the `RentalCheckout.jsx` interface.
- **Interaction**: Users select 7/14/30 day periods. UI displays daily rate dynamic scaling (1.5%, 1.2%, 1.0% of price/day). Backend securely notes 20% security deposit expectations, mapping an 80% rent-to-own credit.

**3. Drop & Waitlist System**

- **Architecture**: Models (`Drop`, `Waitlist`), Routes (`/api/drops`), and the Cron Job (`dropReleaser.js`).
- **Interaction**: VIPs bypass limits, but standard users click "Join Waitlist". When the target time hits, `dropReleaser` shifts state, allowing purchases and hitting the Push API matrix to notify subscribed browsers.

**4. Warranty & Service Portal**

- **Architecture**: Models (`Warranty`, `ServiceRequest`), Routes (`/api/warranties`, `/api/service`), and UI components (`ServiceTimeline.jsx`, `WarrantyCard.jsx`).
- **Interaction**: Completing an order auto-generates a Warranty document. Users can retrieve their "digital passport" by serial number and invoke service requests mapped chronologically in an aesthetic tracking timeline.

**5. P2P Escrow Marketplace**

- **Architecture**: `Listing` model, `/api/listings` endpoints, and UI `SellerProfile.jsx` integrated into the generic catalog.
- **Interaction**: Certified collectors post items. Items are flagged `isVerifiedVault` indicating possession. Payment acts entirely within Chronos escrow until authentication checks trigger status updates.

**6. Automated VIP Tier System**

- **Architecture**: `server/utils/vipUtils.js` paired tightly with the Order creation route and React `VIPContext`.
- **Interaction**: Threshold processing ($0 > $1k > $5k > $20k). Post checkout calculation detects tier shifts, triggers NodeMailer `sendVIPUpgrade`, and instantly updates UI badges (`Crown`, `Gem` icons) and custom discount variables.

**7. Visual AI Search**

- **Architecture**: `VisualSearch.jsx` UI, backend `multer` upload handler in `server/routes/visualSearch.js` linked to Anthropic Claude Vision API.
- **Interaction**: User clicks camera icon, uploads wrist-shot. Backend prompts Claude to identify the watch brand, dial color, and case type. Results format an optimized Mongoose `$regex` search, instantly returning catalog matches.

**8. AI Watch Concierge & Matchmaker**

- **Architecture**: `WatchConcierge.jsx`, `/api/concierge`, and matching logic on both ends.
- **Interaction**:
  - _Direct Chat_: Continuous conversational interface powered by Claude. Parses history, context, and returns product IDs formatted into functional links by the UI.
  - _Quiz Matching_: Series of 4 questions passing into scoring algorithm (`WatchMatchmaker.jsx`). Dynamically assigns weighted points leading to Top 3 visual watch reveals.

**9. AR Try-on & 3D Configurator**

- **Architecture**: `WatchModel3D.jsx` relying heavily on `@react-three/drei` and `fiber`, alongside `WatchConfigurator.jsx`.
- **Interaction**: Procedural mesh generation utilizing dynamic variables tied to Straps, Dials, and Cases. Translates text properties into live environmental metallic and roughness properties inside a cinematic studio lighting canvas.

## 10. Known Limitations & Developer Guide

- **Environment Validation**: Deployments _must_ have valid `MONGODB_URI` and SMTP details. The backend will halt or fail to send critical emails/OTP if `emailService.js` defaults fail. Anthropic API keys are required; without them, the Visual Search and AI Concierge explicitly throw fallback UI errors.
- **Production Analytics**: The backend `/api/admin/analytics` structure contains aggregations for revenue and VIP flow, but specific feature tracking (like explicit count of visual search operations) uses stub variables.
- **Payments**: System employs a simulated checkout context. Standard Stripe/Braintree webhooks are not implemented in Phase 2.
- **Rental Billing**: Rent-to-own logic stops at deposit calculation. Automatic charging of the final purchase conversion requires manual Invoice triggers or a future subscription API billing module integration.
- **Local Development**:
  1. Inside `/server`, run `npm i` and establish `.env` using `.env.example`.
  2. Start backend via `npm run dev`. Wait for MongoDB connection.
  3. Run `npm run seed` to establish base admin user, product drops, and auctions.
  4. Inside `/`, run `npm i`, establish `.env.local` pointing to `http://localhost:5000`.
  5. Run `npm run dev` to access Next.js environment on port 3000.
