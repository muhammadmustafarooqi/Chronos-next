# Chronos Architecture Documentation

**Complete System Design & Data Flow Overview**

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│  Components → Context API → Pages (App Router)              │
│  Features: AR, Configurator, Chat, Dashboard                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP + WebSocket
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                        │
│  Routes → Controllers → Models → Database                   │
│  Services: Email, Push, AI, Socket.io                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ 
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
    ┌─────────┐  ┌──────────┐  ┌──────────────┐
    │ MongoDB │  │ Claude   │  │ SMTP/Push    │
    │         │  │ API      │  │ Services     │
    └─────────┘  └──────────┘  └──────────────┘
```

---

## 2. Data Layer Architecture

### Database Models & Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    USER MODELS                              │
├─────────────────────────────────────────────────────────────┤
│  User                    Customer                           │
│  ├─ email (unique)      ├─ vipTier                         │
│  ├─ password (hashed)   ├─ totalSpend                      │
│  ├─ name                ├─ shippingAddress                 │
│  ├─ phone               ├─ billingAddress                  │
│  └─ role (user/admin)   └─ preferences                     │
└─────────────────────────────────────────────────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         ↓                       ↓
    ┌─────────────┐      ┌─────────────┐
    │    ORDER    │      │   WISHLIST  │
    ├─────────────┤      ├─────────────┤
    │ orderId     │      │ products[]  │
    │ userId      │      │ createdAt   │
    │ items[]     │      └─────────────┘
    │ totalAmount │
    │ status      │      ┌─────────────┐
    │ timeline[]  │      │  CUSTOMER   │
    │ giftReveal  │      │   CONTEXT   │
    │ isGift      │      └─────────────┘
    └─────────────┘
         │
    ┌────┴────┬────────┬──────────┐
    ↓         ↓        ↓          ↓
  ORDER    RENTAL  WARRANTY  SERVICE
  ITEMS    AUDIT    PASSPORT  REQUESTS


┌─────────────────────────────────────────────────────────────┐
│                  PRODUCT MODELS                             │
├─────────────────────────────────────────────────────────────┤
│  Product (Watch Catalog)      Configuration (Custom)        │
│  ├─ name                       ├─ productId                │
│  ├─ brand                       ├─ userId                  │
│  ├─ price                       ├─ strap (leather/rubber)  │
│  ├─ marketValue                 ├─ dialColor              │
│  ├─ images                      ├─ caseFinish             │
│  ├─ stock                       └─ preview3DUrl           │
│  ├─ specs                                                 │
│  ├─ isRentable     ┌─────────────┐        ┌─────────────┐
│  └─ arTryOnCount   │   RENTAL    │        │  AUCTION    │
│                    ├─────────────┤        ├─────────────┤
│     ┌──────────────│ productId   │        │ productId   │
│     │              │ userId      │        │ startPrice  │
│     │              │ rentalDays  │        │ currentBid  │
│     │              │ deposit     │        │ bidders[]   │
│     │              │ status      │        │ endTime     │
│     │              └─────────────┘        │ status      │
│     │                                     └─────────────┘
│     └──→ LISTING (P2P Marketplace)
│         ├─ productId
│         ├─ sellerId
│         ├─ askingPrice
│         ├─ condition
│         ├─ isChronosVerified
│         └─ warrantyRef


┌─────────────────────────────────────────────────────────────┐
│                   DROP MODELS                               │
├─────────────────────────────────────────────────────────────┤
│  Drop (Limited Release)           Waitlist                   │
│  ├─ productId                     ├─ dropId                 │
│  ├─ releaseDate                   ├─ userId                │
│  ├─ quantity                       ├─ vipTier       ┌──────┐
│  ├─ status (upcoming/live/ended)  ├─ joinedAt     │PUSH  │
│  └─ vipEarlyAccess (48h)          └─ notified ←───→│NOTIF │
│                                                    │      │
│  ┌────────────────────────────────────┐           └──────┘
│  │ BACKGROUND JOB: dropReleaser       │
│  │ • Runs every 5 minutes             │
│  │ • Checks releaseDate vs now        │
│  │ • Transitions status to 'live'     │
│  │ • Sends push/email notifications   │
│  └────────────────────────────────────┘
```

### Key Relationships
- **User → Orders**: 1:Many (one user, many orders)
- **Order → Product**: Many:Many (order has multiple items)
- **User → Wishlist**: 1:1 (one wishlist per user)
- **User → Configuration**: 1:Many (multiple custom configs)
- **User → Rental**: 1:Many (multiple rental attempts)
- **Drop → Waitlist**: 1:Many (many users on waitlist)
- **Auction → User (Bidders)**: Many:Many (tracked in bids array)
- **Warranty → Order**: 1:1 (one warranty per delivered order)
- **ServiceRequest → Warranty**: 1:Many (multiple service requests per warranty)

---

## 3. API Architecture

### Request-Response Flow

```
Frontend Request
    ↓
├─ HTTP Method (GET/POST/PUT/DELETE)
├─ Authorization: Bearer <JWT_TOKEN>
├─ Headers: Content-Type, CORS checked
└─ Body: JSON payload
    ↓
Express Server
    ↓
CORS Middleware → Sanitize → Rate Limit → Auth Middleware
    ↓
Route Handler (e.g., /api/orders)
    ↓
├─ Extract params/body
├─ Validate input
├─ Check authorization
└─ Call controller
    ↓
Controller Logic
    ↓
├─ Query database
├─ Apply business logic
├─ Call external services (Claude, Email, Push)
├─ Update cache if needed
└─ Return data
    ↓
Response Handler (ApiResponse utility)
    ↓
├─ Success: { success: true, data: {...}, statusCode: 200 }
├─ Created: { success: true, data: {...}, statusCode: 201 }
├─ Error: { success: false, error: "message", statusCode: 4xx/5xx }
└─ JSON response
    ↓
Frontend Receives Response
    ↓
Update Context State → Re-render Component → Display to User
```

### API Endpoint Categories

| Category | Routes | Purpose |
|----------|--------|---------|
| **Authentication** | `/api/auth/*` | Register, login, session management |
| **Catalog** | `/api/products/*` | Browse, filter, search watches |
| **Shopping** | `/api/orders/*`, `/api/wishlist/*`, `/api/cart/*` | Purchase flow |
| **VIP System** | Built into `/api/customers/*`, `/api/orders/*` | Tier calculation, perks |
| **Features** | `/api/concierge/*`, `/api/configurations/*`, `/api/matchmaker/*` | AI & customization |
| **Collections** | `/api/vault/*` | Personal collection tracking |
| **Gifting** | `/api/gifts/*` | Gift reveal system |
| **Auctions** | `/api/auctions/*` (+ Socket.io) | Live bidding |
| **Rentals** | `/api/rentals/*` | Trial programs |
| **Drops** | `/api/drops/*` | Limited releases |
| **Marketplace** | `/api/listings/*` | P2P sales |
| **Warranty** | `/api/warranty/*`, `/api/service/*` | Product coverage |
| **Notifications** | `/api/push/*` | Push subscription |
| **Admin** | `/api/admin/*` | Dashboard, management |
| **Analytics** | `/api/analytics/*` | Business metrics |

---

## 4. Real-Time Architecture (Socket.io)

### Auction Room Flow

```
Client 1 connects              Client 2 connects
    ↓                              ↓
  Join room "auction-69dd..."
    ↓
Initialize state (current bid, bidders, time)
    ↓─────────────────────────────────────↓
    
Client 1 places bid ($100,050)
    ↓
Emit: placeBid event
    ↓
Server validates:
├─ User authenticated
├─ VIP tier >= requirement
├─ Bid > current + increment
└─ Auction still live
    ↓
If valid:
├─ Update Auction document (atomic findOneAndUpdate)
├─ Check if < 2 minutes remaining
├─ If yes: Extend endTime by 2 minutes
└─ Emit 'auctionUpdate' to all clients in room
    ↓
Both Clients receive update:
├─ New current bid: $100,050
├─ Highest bidder updated
├─ Bid count incremented
└─ UI updates in real-time
```

---

## 5. Background Jobs Architecture

### Scheduled Tasks

```
┌─────────────────────────────────────────────────────────────┐
│              node-cron Scheduled Jobs                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  dropReleaser: Every 5 minutes                             │
│  ├─ Query Drops where status = 'upcoming'                  │
│  │   AND releaseDate <= now                                │
│  ├─ Transition status to 'live'                            │
│  ├─ Query Waitlist for this drop                           │
│  ├─ For each waitlisted user:                              │
│  │   ├─ Find push subscriptions                            │
│  │   ├─ Send web-push notification                         │
│  │   ├─ Send email notification                            │
│  │   └─ Mark as notified = true                            │
│  └─ Log job completion                                     │
│                                                             │
│  orderSimulator: Every 5 minutes (QA only)                 │
│  ├─ Query Orders with status != 'Delivered'              │
│  ├─ Increment timeline to next stage                       │
│  ├─ When status = 'Delivered':                             │
│  │   ├─ Auto-generate Warranty                             │
│  │   └─ Stop advancing                                     │
│  └─ FOR TESTING ONLY - Remove before sale                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Authentication & Authorization

### JWT Flow

```
User Enters Credentials
    ↓
POST /api/auth/login
    ↓
Server verifies:
├─ Email exists
└─ Password matches bcrypt hash
    ↓
Generate JWT:
├─ Header: { alg: "HS256", typ: "JWT" }
├─ Payload: { userId, email, role, iat: now, exp: now + 7d }
├─ Signature: HMAC-SHA256(header + payload, JWT_SECRET)
└─ Return: { token: eyJhbGc... }
    ↓
Frontend stores token → localStorage
    ↓
Subsequent requests:
├─ Header: Authorization: Bearer <token>
└─ Express middleware verifies:
    ├─ Token present
    ├─ Signature valid
    ├─ Not expired
    └─ Extract userId, role, attach to req.user
    ↓
Protected route handler:
├─ Check req.user exists
├─ Check req.user.role if role-based
└─ Proceed or return 401/403
```

### Authorization Levels

| Level | Route Example | Check |
|-------|---------------|-------|
| **Public** | GET /api/products | No auth required |
| **Authenticated** | GET /api/orders/my-orders | req.user must exist |
| **Admin Only** | POST /api/products | req.user.role === 'admin' |
| **VIP Only** | GET /api/auctions/<auction_id>/bid | Verify vipTier >= required |
| **Owner Only** | PUT /api/orders/<id> | Order.userId === req.user.id |

---

## 7. External Service Integration

### AI Concierge & Visual Search

```
User: "Recommend a dress watch under $5,000"
    ↓
POST /api/concierge { message }
    ↓
Backend:
├─ Fetch all products from MongoDB
├─ Format into catalog context
├─ Call Claude API with:
│   ├─ System prompt (catalog injected)
│   ├─ Messages history (from ConciergeLog)
│   └─ User message
└─ Claude returns natural language response
    ↓
Backend:
├─ Parse response for product IDs
├─ Format response with clickable links
├─ Save to ConciergeLog
└─ Return { success: true, data: { reply, suggestions: [...] } }
    ↓
Frontend:
├─ Display chat message
├─ Render clickable product suggestions
└─ Save to local context for history
```

### Email Service

```
Trigger: Order created (status = "pending")
    ↓
Backend calls:
├─ emailService.sendOrderConfirmation({
│   to: customer.email,
│   orderData: { items, total, orderId }
│ })
├─ emailService renders HTML template
├─ Calls nodemailer.transporter.sendMail()
└─ Returns success/error
    ↓
Later, admin updates:
├─ Order status = "Dispatched"
├─ Backend calls: emailService.sendShippingUpdate()
└─ Customer receives tracking update
```

### Push Notifications

```
User subscribes on PWA:
    ↓
Service worker: pushManager.subscribe({ userVisibleOnly: true })
    ↓
Frontend sends subscription to backend:
├─ POST /api/push/subscribe
├─ { endpoint, keys: { auth, p256dh } }
└─ Backend saves to PushSubscription model
    ↓
Trigger: Drop goes live
    ↓
dropReleaser job:
├─ Finds all PushSubscription documents
├─ For each subscription:
│   ├─ web-push.sendNotification(
│   │   subscription,
│   │   payload: { title, body, url }
│   │ )
│   └─ Silently fails if subscription invalid (410 Gone)
└─ User receives browser notification
    ↓
User clicks notification → Opens app (via notificationclick handler)
```

---

## 8. Frontend Architecture

### React Context Providers

```
root layout.js
    ↓
<Providers>
    ├─ <AuthProvider>
    │  └─ Manages currentUser, isAuthenticated, login, logout
    │
    ├─ <CartProvider>
    │  └─ Manages items[], totals, add, remove, clear
    │
    ├─ <WishlistProvider>
    │  └─ Manages saved items, sync with backend
    │
    ├─ <VIPProvider>
    │  └─ Manages vipTier, totalSpend, progressToNext, tiers
    │
    ├─ <WatchProvider>
    │  └─ Manages catalog, filters, sorting
    │
    ├─ <OrderProvider>
    │  └─ Manages orderHistory, currentOrder status
    │
    ├─ <ThemeProvider>
    │  └─ Manages dark/light mode, colors
    │
    └─ <ToastProvider>
       └─ Manages success/error/info notifications
    ↓
<App>
    ├─ Layout (Navbar, Footer, Cart Drawer)
    └─ Pages (via Next.js App Router)
        ├─ (storefront)/ - Public pages
        ├─ (admin)/ - Protected admin pages
        └─ auth/ - Login, register
</Providers>
```

### Component Hierarchy (Example: Product Page)

```
page.jsx (Product Detail)
    ↓
<Product>
    ├─ <ProductImages />      - Gallery, AR button
    │  └─ <ARTryOn />         - Launch Try-On modal
    │
    ├─ <ProductInfo />        - Name, price, specs
    │  ├─ <VIPBadge />        - Current tier discount
    │  └─ <Rating />          - Reviews
    │
    ├─ <ProductActions />     - Add to cart, wishlist
    │  └─ <ConfigureButton /> - Open configurator
    │
    ├─ <WatchConfigurator />  - 3D real-time customization
    │  └─ Three.js Canvas
    │
    └─ <RentalOption />       - 7/14/30 day trial
       └─ RentalCheckout flow
```

---

## 9. Caching Strategy

### Client-Side Cache

```
Browser LocalStorage:
├─ recentlyViewed: [productId1, productId2, ...] (max 10)
├─ cartItems: [{productId, qty, config}, ...]
├─ userPreferences: { theme, currency, language }
└─ deviceToken: push notification subscription

Session Storage:
└─ tempOrderData: Pending checkout info (cleared on leave)
```

### Server-Side Cache

```
In-Memory Cache (via cache.js utility):
├─ Key: "products:all"
│  Value: Full product catalog
│  TTL: 1 hour
│  Invalidated on: Product create/update/delete
│
├─ Key: "featured-products"
│  Value: Filtered top 10 products
│  TTL: 2 hours
│
└─ Key: "vip-tiers"
   Value: Tier definitions
   TTL: Never (static)
```

### Invalidation Strategy

```
On Order Created:
├─ Invalidate: "products:all" (stock may have changed)
└─ Invalidate: "featured-products"

On Product Updated (admin):
├─ Invalidate: "products:all"
└─ Invalidate: "featured-products"

On Customer VIP Tier Change:
├─ Broadcast update to WatchContext
└─ Re-render price displays
```

---

## 10. Error Handling & Logging

### Error Handling Flow

```
Frontend HTTP Request
    ↓ Error occurs
    ↓
Express error middleware:
├─ Catches all errors (thrown or passed to next(err))
├─ Checks error type:
│   ├─ CastError (invalid ObjectId) → 400
│   ├─ ValidationError → 400 + details
│   ├─ Duplicate Key (11000) → 409
│   ├─ JWT errors → 401
│   └─ Generic Error → 500
├─ Logs error (in file, console, or service)
├─ Removes stack trace if production
└─ Returns JSON: { success: false, error: "message", statusCode: xxx }
    ↓
Frontend receives error:
├─ Axios interceptor catches 4xx/5xx
├─ Display user-friendly toast message
└─ Log to console in development

Frontend Validation:
├─ Input validation before submission
├─ Display inline error messages
└─ Block submission if invalid
```

### Logging Layers

| Component | Method | Used For |
|-----------|--------|----------|
| Backend | console.log, custom logger | Development debugging |
| Backend | File logger | Production: Track errors, access logs |
| Frontend | console.warn | Development: Prop warnings, React issues |
| Frontend | Error boundary | Catch React component errors |

---

## 11. Deployment Architecture

### Development

```
localhost:3000 (Frontend)         localhost:5000 (Backend)
      ↓ HTTP/WS                         ↓ WebSocket
      └─────────────────────────────────┘
                    
In-Memory MongoDB (testing)
```

### Production

```
CDN                  Vercel (Frontend)        Railway/Render (Backend)
 ↓                        ↓                            ↓
 └────────→ HTTP ────────→ HTTPS ─────→ Secured WS ─→ Express
                                                         ↓
                                                   MongoDB Atlas
                                                   (Cloud Database)
                                                         ↑
                                        Claude API, SendGrid, web-push
```

---

## 12. Scaling Considerations

### Current Limits
- In-memory database: QA/development only
- Single Node.js process: Fine for <1000 concurrent users
- Single service: No load balancing

### For Production Scale

```
If users increase:

1. Database Scaling
   ├─ Switch to MongoDB Atlas (managed)
   ├─ Add indexes on frequently queried fields
   └─ Implement read replicas if needed

2. Backend Scaling
   ├─ Deploy multiple Node.js instances
   ├─ Use load balancer (Railway/Render handles this)
   └─ Implement session persistence (Redis)

3. Frontend Optimization
   ├─ Code splitting (Next.js does this automatically)
   ├─ Image optimization (Next.js Image component)
   ├─ Caching headers (browser cache)
   └─ CDN distribution (Vercel serves globally)

4. API Optimization
   ├─ Add Redis cache layer
   ├─ Implement GraphQL (alternative to REST)
   └─ API versioning (/api/v1/)

5. Real-Time Scaling (Socket.io)
   ├─ Use Socket.io adapter (Redis Adapter)
   ├─ Enable sticky sessions for load balancer
   └─ Monitor WebSocket connections
```

---

## Summary

Chronos architecture is built for:
- ✅ **Scalability** - Modular design, separate concerns
- ✅ **Security** - JWT auth, input sanitization, rate limiting
- ✅ **Maintainability** - Clear folder structure, consistent patterns
- ✅ **Performance** - Caching, atomic database operations, indexed queries
- ✅ **Real-Time** - Socket.io for auctions, WebSocket support
- ✅ **Integration** - Easy to add new services (Claude, Email, Push)

For questions on specific components, see:
- **FEATURE_GUIDE.md** — Feature-specific architecture
- **API_REFERENCE.md** — Endpoint details
- **DEPLOYMENT_DETAILED.md** — Production setup
