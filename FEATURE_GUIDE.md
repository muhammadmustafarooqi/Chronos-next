# Chronos Feature Guide

**Complete walkthrough of all 15 premium features with usage examples**

---

## Table of Contents

1. [AI Watch Concierge](#1-ai-watch-concierge)
2. [AR Try-On](#2-ar-try-on)
3. [Watch Configurator](#3-watch-configurator)
4. [Matchmaker Quiz](#4-matchmaker-quiz)
5. [Collection Vault](#5-collection-vault)
6. [VIP Loyalty System](#6-vip-loyalty-system)
7. [White-Glove Delivery](#7-white-glove-delivery)
8. [Virtual Gifting](#8-virtual-gifting)
9. [Live Auctions](#9-live-auctions)
10. [Drops & Waitlist](#10-drops--waitlist)
11. [Watch Rentals](#11-watch-rentals)
12. [Warranty Passport](#12-warranty-passport)
13. [P2P Marketplace](#13-p2p-marketplace)
14. [Visual Search](#14-visual-search)
15. [Push Notifications](#15-push-notifications)

---

## 1. AI Watch Concierge

### What It Does
Users chat with an AI assistant (Claude) about watch recommendations. The AI has access to your entire product catalog and provides personalized suggestions.

### How It Works

**Frontend User Experience:**
```
1. User sees chat widget (bottom-left, gold icon)
2. Types: "Recommend a dress watch under $5,000"
3. AI responds: "Based on your budget, I recommend the Seiko Presage SRP015..."
4. Response includes clickable product links
5. User can continue chatting for more refined suggestions
```

**Backend Processing:**
```
POST /api/concierge
{
  "message": "Recommend a dress watch under $5,000"
}

Server:
1. Fetches ALL products from MongoDB
2. Formats catalog into system prompt (e.g., "You have 47 watches...")
3. Calls Claude API with:
   - System prompt: Full catalog + instructions
   - Messages history: Previous chat messages
   - User message: Current query
4. Claude returns recommendation text
5. Backend saves conversation to ConciergeLog
6. Returns response with product suggestions
```

### Key Components
- **Frontend:** `src/components/WatchConcierge.jsx`
- **Backend:** `POST /api/concierge` in `server/routes/concierge.js`
- **Model:** `ConciergeLog` (tracks chat history)
- **API Key:** `ANTHROPIC_API_KEY` in `server/.env`

### Configuration
```env
# Enable/disable by setting API key
ANTHROPIC_API_KEY=sk-ant-v7-xxxxx

# If missing, feature gracefully returns error message
# Users see: "AI feature unavailable"
```

### Best Practices
- ✅ Keep user messages under 2,000 characters
- ✅ Catalog is re-fetched per request (stays current)
- ✅ Chat history retained per user session
- ✅ API errors handled gracefully (no app crash)

---

## 2. AR Try-On

### What It Does
Users point their device camera at their wrist, and the app uses MediaPipe to detect their hand, then overlays the watch image on their wrist in real-time.

### How It Works

**Setup Process:**
```
1. User taps "Try On" button on product page
2. Browser requests camera permission
3. MediaPipe Hands loads model (~7MB)
4. Video stream starts
5. MediaPipe detects wrist landmark in real-time
6. Canvas renders watch image on wrist
7. User taps "Save" to capture screenshot
```

**Technical Flow:**
```
MediaPipe Hands detection:
├─ Detects 21 hand landmarks
├─ Identifies wrist position (landmark 0)
├─ Calculates hand orientation
└─ Transforms watch image to align with wrist

Canvas overlay:
├─ Video stream as background
├─ Watch image transformed and scaled
├─ Updates 60fps (real-time)
└─ User can rotate phone to see from different angles
```

### Key Components
- **Frontend:** `src/components/ARTryOn.jsx`
- **Library:** MediaPipe Hands (via `@mediapipe/hands`)
- **Canvas:** HTML5 Canvas for rendering
- **Fallback:** Static wrist mockup if camera unavailable

### Browser Requirements
- ✅ Chrome, Firefox, Safari (mobile preferred)
- ✅ Camera permission required
- ✅ HTTPS or localhost only (browser security)
- ✅ 2GB+ RAM recommended

### Graceful Degradation
```javascript
// If camera not available or MediaPipe fails:
├─ Show static mockup of watch on wrist
├─ Display message: "Camera unavailable - Static preview shown"
└─ Still allow product browsing
```

### Best Practices
- ✅ Test on mobile devices (primary use case)
- ✅ Ensure good lighting for accuracy
- ✅ Allow users to skip AR if they prefer
- ✅ Use HTTPS in production (required by browser)

---

## 3. Watch Configurator

### What It Does
Users customize a watch in real-time by selecting strap, dial color, and case finish. A 3D preview updates instantly.

### How It Works

**Customization Flow:**
```
User Interface:
1. Three selector pickers visible
2. Strap options: Leather, Rubber, Stainless Steel Bracelet
3. Dial colors: Black, White, Blue, Green, Silver
4. Case finish: Polished, Brushed, Matte Gold
5. Each selection updates 3D preview instantly
6. User clicks "Save Configuration"
7. Gets a shareable URL with config ID
8. Can add configured watch to cart
```

**3D Preview System:**
```
Technology: Three.js + React Three Fiber

Model transformation based on selection:
├─ Strap color/material:
│  └─ Updates texture map, roughness, metallic properties
├─ Dial color:
│  └─ Changes base color, applies gradients
└─ Case finish:
   └─ Adjusts metallic reflectivity, roughness

Studio Lighting:
├─ Multiple point lights positioned around watch
└─ Creates premium luxury appearance
```

### Backend Processing

```
POST /api/configurations
{
  "productId": "69dd378e011d7dd7bab94b01",
  "strap": "leather",
  "dialColor": "blue",
  "caseFinish": "polished"
}

Response:
{
  "configId": "config_abc123xyz",
  "shareUrl": "/product/69dd378e011d7dd7bab94b01?config=abc123xyz",
  "preview3DUrl": "cdn-link-to-preview.jpg"
}
```

### Configuration Sharing

```
1. A saves custom config → Gets URL: /product/xxx?config=yyy
2. A sends link to friend B
3. B opens link → Sees exact same 3D watch
4. B can:
   ├─ Add to their own cart
   ├─ Customize further
   └─ Share with others
```

### Key Components
- **Frontend:** `src/components/WatchConfigurator.jsx`
- **3D Library:** Three.js, React Three Fiber, Drei
- **Backend:** `POST /api/configurations`, `GET /api/configurations/:id`
- **Model:** `Configuration` (stores custom selections)

### Database Storage
```
{
  "_id": "config_abc123xyz",
  "productId": "69dd378e...",
  "userId": "user_xyz",
  "strap": "leather",
  "dialColor": "blue",
  "caseFinish": "polished",
  "preview3DUrl": "https://cdn.../preview.jpg",
  "createdAt": "2026-04-15T10:00:00Z"
}
```

### Performance Optimization
- ✅ 3D model loaded once (cached)
- ✅ Material updates are real-time
- ✅ Preview shader is optimized
- ✅ Supports medium-range devices

---

## 4. Matchmaker Quiz

### What It Does
A 5-step quiz that profiles user preferences (style, occasion, movement type, budget, brand familiarity), then returns personalized watch recommendations.

### How It Works

**Quiz Questions:**
```
Step 1: What's your preferred style?
├─ Classic & Timeless
├─ Modern & Minimalist
├─ Bold & Statement
└─ Sport & Technical

Step 2: Primary occasion?
├─ Daily Wear
├─ Professional/Formal
├─ Adventure/Sports
└─ Mixed Use

Step 3: Preferred watch movement?
├─ Mechanical (hand-wound)
├─ Automatic (self-winding)
├─ Quartz (battery)
└─ No preference

Step 4: Maximum budget?
├─ Under $2,000
├─ $2,000 - $5,000
├─ $5,000 - $10,000
└─ $10,000+

Step 5: Familiarity with watch brands?
├─ New to watches
├─ Some knowledge
├─ Enthusiast
└─ Collector
```

**Scoring Algorithm:**
```
For each user answer:
├─ Assign weighted points to each product in catalog
└─ Product relevance score = sum of weighted points

Example:
├─ If user selects "Classic": Omega, Rolex, Tudor get +10 points
├─ If user selects "Sport": Seiko, Hamilton get +10 points
├─ If budget $2,000-5,000: Filter by price, adjust multiplier
└─ Final ranking: Sort by total points, return top 3

Bonus: if Claude API available:
├─ Request Claude generate personalized 1-sentence explanation
├─ Displayed with each recommendation
└─ Makes recommendations feel human-curated
```

### Feature Flow

```
1. User opens /matchmaker page
2. Sees Step 1/5 of quiz
3. Selects answer → Advances to Step 2
4. ... continues through Step 5
5. Hits "Get Recommendations"
6. Shows top 3 watches with:
   ├─ Product image
   ├─ Name, price, brand
   ├─ Personalized explanation
   ├─ "View Details" link
   └─ "Add to Cart" button
7. User can:
   ├─ Retake quiz
   ├─ View recommended watches
   └─ Share results with others
```

### Backend Processing

```
POST /api/matchmaker
{
  "style": "classic",
  "occasion": "professional",
  "movement": "automatic",
  "budget": 5000,
  "familiarity": "enthusiast"
}

Response:
{
  "recommendations": [
    {
      "productId": "...",
      "name": "Omega Seamaster",
      "price": 4500,
      "image": "...",
      "explanation": "Perfect balance of professional elegance and proven reliability..."
    },
    // ... 2 more recommendations
  ]
}
```

### Key Components
- **Frontend:** `src/app/(storefront)/matchmaker/page.jsx`
- **Backend:** `POST /api/matchmaker` in `server/routes/matchmaker.js`
- **Model:** `MatchmakerLog` (stores quiz responses for analytics)
- **Optional AI:** Claude integration for personalized explanations

### Analytics Use

```
MatchmakerLog stores:
├─ User ID & email
├─ Answers (style, occasion, movement, budget, familiarity)
├─ Recommendations returned
├─ Timestamp
└─ Whether user purchased recommended watch

This enables:
├─ Understanding customer preferences
├─ Measuring recommendation accuracy
├─ Refining scoring algorithm
└─ Inventory planning
```

### Best Practices
- ✅ Quiz is FREE (no login required initially)
- ✅ Results improve with optional account creation
- ✅ No pressure to purchase
- ✅ Analytics respect user privacy

---

## 5. Collection Vault

### What It Does
Authenticated users see all watches they've purchased in a personal digital collection. Shows purchase price vs. current market value.

### How It Works

**My Collection Page:**

```
User logs in → Navigates to /vault

Displays:
├─ Watch card for each purchased watch:
│  ├─ Product image
│  ├─ Brand & model name
│  ├─ Purchase price (from order)
│  ├─ Current market value (from Product.marketValue)
│  ├─ Price change ($) and (%)
│  └─ Appreciate/Depreciate indicator
│
├─ Collection statistics:
│  ├─ Total collection value (current market)
│  ├─ Total invested
│  └─ Overall gain/loss
│
└─ Actions per watch:
   ├─ View details
   ├─ Add to marketplace for sale
   └─ View warranty details
```

**Public Vault Sharing:**

```
User can share collection publicly:
1. Generate share token: /vault/[customerId]?view=public
2. Anyone (no login needed) can see:
   ├─ Product images
   ├─ Brand names & models
   ├─ Count of items
   └─ BUT NOT prices (prices hidden)
3. Viewers can't edit or purchase items
```

### Backend Processing

```
GET /api/vault
Response:
{
  "collection": [
    {
      "orderId": "order_xyz",
      "productId": "....",
      "name": "Rolex Submariner",
      "purchasePrice": 8000,
      "currentMarketValue": 8500,
      "priceChange": 500,
      "priceChangePercent": 6.25,
      "purchaseDate": "2024-01-15",
      "warranty": { status: "active", expiresAt: "2026-01-15" }
    },
    // ... more watches
  ],
  "stats": {
    "totalItems": 5,
    "totalInvested": 40000,
    "currentValue": 42500,
    "totalGain": 2500
  }
}
```

### Updating Market Value (Admin)

```
1. Admin logs in → Admin dashboard
2. Edits product details
3. Updates "Market Value" field
4. Saves
5. Next time user views vault:
   ├─ New market value shows
   └─ Price change recalculates
```

### Key Components
- **Frontend:** `src/app/(storefront)/vault/page.jsx`
- **Components:** `src/components/VaultCard.jsx`
- **Backend:** `GET /api/vault`, `GET /api/vault/:customerId`
- **Model:** Uses existing `Order` and `Product` models

### Best Practices
- ✅ Market values updated regularly by admins
- ✅ Historical price data tracked (for future trending)
- ✅ Public sharing respects user privacy (no prices exposed)
- ✅ Perfect for luxury watch collectors to showcase collections

---

## 6. VIP Loyalty System

### What It Does
Users automatically progress through VIP tiers (Bronze → Silver → Gold → Platinum) based on lifetime purchase spending.

### How It Works

**Tier Breakdown:**

```
Bronze Tier: $0+ spent
├─ Access to catalog
├─ Free shipping (conditional)
└─ Standard support

Silver Tier: $1,000+ spent
├─ Free shipping on all orders
├─ Early drop access (24h before Gold)
└─ 5% loyalty discount

Gold Tier: $5,000+ spent
├─ Free expedited shipping
├─ 48h VIP early access to drops (before public)
├─ Dedicated concierge chat
└─ 10% loyalty discount

Platinum Tier: $20,000+ spent
├─ White-glove delivery service
├─ Personal concierge hotline
├─ Private VIP events (quarterly)
├─ 15% loyalty discount
└─ Free returns on new purchases
```

**Automatic Tier Calculation:**

```
When an order is completed:
1. Backend calculates: customer.totalSpend += orderTotal
2. Checks: What tier should this customer be?
   ├─ if totalSpend >= 20000: tier = "platinum"
   ├─ if totalSpend >= 5000: tier = "gold"
   ├─ if totalSpend >= 1000: tier = "silver"
   └─ else: tier = "bronze"
3. If newTier !== oldTier:
   └─ Trigger: Send "Congratulations upgraded!" email
4. Update customer.vipTier
5. Return updated profile
```

**UI Display:**

```
Navbar (top-right):
├─ User icon with VIP badge
├─ Crown icon: Gold/Platinum tier
├─ Gem icon: Shows tier name on hover
└─ Clicking opens "My VIP Status" modal

VIP Status Modal:
├─ Current tier: "Gold ($5,100 spent)"
├─ Progress to next tier: "Platinum: $14,900 remaining"
├─ Visual progress bar (30% to Platinum)
├─ Benefits list for current tier
├─ Benefits preview for next tier
└─ "Explore Collections" button
```

**Tier Perks Applied:**

```
When customer logs in:
1. System checks customer.vipTier
2. On product page:
   ├─ Show discounted price if discounted apply to tier
   └─ Display "VIP Price: $4,500 (10% off)"
3. At checkout:
   ├─ Apply free/discounted shipping
   └─ Apply tier discount code automatically

Platinum-only features:
├─ Drop waitlist: Automatically approved (no queue)
├─ Auction access: Can participate earlier (2h head start)
└─ Support: Premium support queue (faster response)
```

### Key Components
- **Backend:** `server/utils/vipUtils.js` (tier calculation)
- **Frontend:** `src/context/VIPContext.jsx` (state management)
- **Components:** `src/components/VIPBadge.jsx`, `src/components/VIPProgress.jsx`
- **Model:** `Customer` (vipTier, totalSpend fields)

### Database Integration

```
Customer document:
{
  "_id": "customer_xyz",
  "userId": "user_xyz",
  "vipTier": "gold",
  "totalSpend": 5100,
  "preferences": {...},
  "createdAt": "2024-01-01"
}
```

### Best Practices
- ✅ Tier calculation automatic (no manual intervention)
- ✅ Users see clear benefits for next tier
- ✅ Upgrade notifications sent via email
- ✅ Tier status visible throughout app
- ✅ Perks applied automatically (no code entering)

---

## 7. White-Glove Delivery

### What It Does
Professional delivery tracking with 6 stages. Shows real-time status updates. Platinum members get concierge callback option.

### How It Works

**6-Stage Delivery Timeline:**

```
Stage 1: Order Confirmed
├─ Status: "pending" → Order received and verified
├─ UI: Checkmark icon, pulsing ring
└─ Email sent: "Order confirmed, processing begins"

Stage 2: Being Prepared
├─ Status: "processing" → Items being packed
├─ UI: Box icon being filled
└─ Email sent: "Order is being carefully prepared"

Stage 3: Quality Checked
├─ Status: "quality-check" → Final inspection
├─ UI: Inspection icon with magnifying glass
└─ Email sent: "Order passed quality check"

Stage 4: Dispatched
├─ Status: "dispatched" → Left warehouse
├─ UI: Truck icon with checkmark
├─ Email sent: "Package on the way"
└─ Includes: Tracking number (if available)

Stage 5: Out for Delivery
├─ Status: "out-for-delivery" → With delivery person
├─ UI: Location pin in motion
└─ Email sent: "Package out for delivery today"

Stage 6: Delivered
├─ Status: "delivered" → Reached customer
├─ UI: Checked delivery, date/time
├─ Email sent: "Order delivered"
└─ Auto-generates warranty document
```

**Admin Workflow:**

```
Admin dashboard → Orders → Select order

Admin can:
1. Click "Advance Stage" (manual progression)
2. Or set Date-based auto-progression:
   ├─ "Auto-advance in 2 hours"
   ├─ "Auto-advance in 2 days"
   └─ System handles automation via node-cron
```

**Platinum VIP Exclusive:**

```
When platinum customer views order:
├─ See all 6 stages (same as all tiers)
├─ NEW BUTTON: "Request Concierge Callback"
├─ Clicking opens modal:
│  ├─ Request reason dropdown
│  ├─ Preferred time slots
│  └─ Submit
└─ Admin receives notification: "VIP callback requested"
```

### Backend Processing

```
PUT /api/orders/:id/timeline
{
  "stage": "dispatched",
  "trackingNumber": "UPS123456789"
}

Response:
{
  "timeline": [
    { stage: "confirmed", completedAt: "2026-04-15T08:00:00Z" },
    { stage: "processing", completedAt: "2026-04-15T10:30:00Z" },
    { stage: "quality-check", completedAt: "2026-04-15T14:00:00Z" },
    { stage: "dispatched", completedAt: null } // Current
  ],
  "trackingNumbers": ["UPS123456789"]
}
```

### Key Components
- **Frontend:** `src/components/DeliveryTimeline.jsx`
- **Backend:** `PUT /api/orders/:id/timeline` in `server/routes/orders.js`
- **Model:** `Order` (deliveryTimeline array, trackingNumbers)
- **Notifications:** Email service triggers at each stage

### Visual Design

```
Timeline UI:
│
├─ ◉ Order Confirmed (Mon, Apr 15, 8:00 AM) [COMPLETED]
│
├─ ◉ Being Prepared (Mon, Apr 15, 10:30 AM) [COMPLETED]
│  └─ Pulsing animation
│
├─ ○ Quality Checked [IN PROGRESS]
│  └─ Waiting...
│
├─ ○ Dispatched
├─ ○ Out for Delivery
└─ ○ Delivered

On mobile: Vertical timeline
On desktop: Horizontal timeline with details panel
```

### Best Practices
- ✅ Automated stage progression (QA environment)
- ✅ Manual admin control when needed
- ✅ Timestamps recorded for each stage
- ✅ Customers notified at each transition
- ✅ Platinum VIP concierge option adds premium feel

---

## 8. Virtual Gifting

### What It Does
Buyers can purchase a watch as a gift, add a personal message, and generate a unique reveal token. The recipient sees a beautiful animated gift reveal page.

### How It Works

**Buyer Flow:**

```
1. Buyer in checkout: "Is this a gift?"
2. Toggles "YES" → Additional fields appear:
   ├─ "Recipient email" (optional, for direct invite)
   ├─ "Gift message" (personal note)
   └─ "Gift wrap?" (checkbox)
3. Completes purchase
4. Confirmation email includes:
   ├─ Unique reveal token (e.g., gift_abc123xyz)
   └─ Share link: yourstore.com/gift/abc123xyz
5. Buyer can:
   ├─ Send link via email/chat/social
   └─ OR system auto-sends to recipient email if provided
```

**Recipient Experience:**

```
Recipient clicks link: yourstore.com/gift/abc123xyz

Page loads with:
1. Beautiful modal animation
2. Sealed box icon (Framer Motion)
3. "Click to reveal" instruction
4. User clicks
5. Animation sequence:
   ├─ Box opens (swing animation)
   ├─ Confetti drops (react-confetti)
   ├─ Watch image appears (fadeIn over 0.5s)
   ├─ Message appears (slideUp)
   └─ Product details revealed second by second
6. Recipient can:
   ├─ Share reveal on social media
   ├─ Add to their wishlist
   └─ Purchase similar model

Recipient CANNOT:
├─ See buyer identity (anonymous)
├─ See order price/payment info
└─ Access buyer account
```

**Security & Privacy:**

```
Token is random & unique:
├─ Cannot guess other tokens (cryptographically random)
├─ Tokens stored in Order document
├─ One-time use concept (recipient can view multiple times)
└─ No authentication needed to view
```

### Backend Processing

```
POST /api/orders (checkout)
{
  ...orderData,
  "isGift": true,
  "giftMessage": "Happy birthday! Enjoy...",
  "giftRecipientEmail": "recipient@example.com",
  "giftWrap": true
}

Response includes:
{
  "giftRevealToken": "gift_abc123xyz",
  "giftRevealUrl": "https://chronos.com/gift/abc123xyz"
}

Later:
GET /api/gifts/:token
Response:
{
  "watch": { name, image, brand },
  "message": "Happy birthday...",
  "recipientEmail": "recipient@example.com"
  // Note: Buyer info NOT included
}
```

### Key Components
- **Frontend:** `src/app/(storefront)/gift/[token]/page.jsx`
- **Component:** Built with Framer Motion for animations
- **Backend:** `POST /api/gifts`, `GET /api/gifts/:token`
- **Model:** `Order` (giftRevealToken, isGift, giftMessage fields)
- **Animation:** `react-confetti` package for confetti effect

### Database Schema Addition

```
Order document includes:
{
  ...existingFields,
  "isGift": true,
  "giftMessage": "Happy birthday! Enjoy...",
  "giftRecipientEmail": "recipient@example.com",
  "giftWrap": true,
  "giftRevealToken": "gift_abc123xyz"
}
```

### Best Practices
- ✅ No sensitive buyer data visible to recipient
- ✅ Beautiful animations (premium feel)
- ✅ Shareable reveal link
- ✅ Optional recipient email for direct invite
- ✅ Perfect for premium gift purchases

---

## 9. Live Auctions

### What It Does
Exclusive items available in real-time auctions. Users place bids competing in live rooms with anti-sniping protection.

### How It Works

**Auction Setup (Admin):**

```
Admin creates auction:
1. Select product from catalog
2. Set starting price: $50,000
3. Set reserve price: $45,000 (minimum acceptable)
4. Set auction duration: 24 hours
5. Set minimum VIP tier: GOLD (only Gold/Platinum can bid)
6. Set minimum bid increment: $1,000
7. Publish
```

**Live Auction Room:**

```
User navigates to /auctions → See list of live auctions

Clicks auction → Enters real-time auction room

Room displays:
├─ Product image (large, HD)
├─ Current highest bid: $52,000
├─ Highest bidder: ["Anonymous Bidder" or name if VIP]
├─ Bid count: 14 bids placed
├─ Time remaining: 4 hours 32 minutes
├─ Your VIP tier: Gold ✓ (eligible)
├─ Bid history (latest 5 bids shown)
│  ├─ $52,000 by Bidder A (5 mins ago)
│  ├─ $51,000 by Bidder B (8 mins ago)
│  └─ ... more
│
└─ Bid input box:
   ├─ Minimum next bid shown: $53,000 (= current + increment)
   ├─ User enters bid amount
   └─ Click "Place Bid"
```

**Bid Placement & Validation:**

```
User places $53,000 bid

Server validation:
├─ ✓ User authenticated
├─ ✓ VIP tier >= requirement (Gold >= Gold ✓)
├─ ✓ Bid >= minimum ($53,000 >= $53,000 ✓)
├─ ✓ Auction still live
├─ ✓ Time > 0
└─ ✓ Atomic comparison (prevent race conditions)

If valid:
├─ Update Auction.currentBid = $53,000
├─ Add bidder to Auction.bidders array
├─ Check: Time remaining < 2 minutes?
│  ├─ YES: Extend endTime by 2 minutes (anti-sniping)
│  └─ NO: Keep endTime same
└─ Emit 'auctionUpdate' to all clients in room

All clients receive real-time update:
├─ Current bid changes to $53,000
├─ Bidder A is now highest
├─ Time extended? (if applicable)
├─ Re-render UI instantly
```

**Anti-Sniping Flash Extension:**

```
This is what makes Chronos auctions fair:

Normal auction: Ends at 3:00 PM
User 1 places bid at 2:59:00 (1 minute left)
  → Time < 2 minutes → Extend to 3:02 PM

User 2 places bid at 3:01:30
  → Time < 2 minutes → Extend to 3:03:30

This continues... preventing last-second sniping
Auction ends when 2+ minutes pass without a bid
```

**Auction End & Winner Notification:**

```
When time expires:
1. Status transitions to "ended"
2. Auction room shows: "ENDED - Bidding Closed"
3. Winner determined: Highest bidder
4. Winner notification:
   ├─ Email: "Congratulations! You won auctions for $53,000"
   ├─ Payment instructions sent
   └─ 48-hour checkout window
5. All bidders notified:
   ├─ Emails: "Auction ended, final bid was $53,000"
   └─ Link to similar items
```

### Backend Architecture

```
Socket.io namespace: /auctions/{auctionId}

Events sent from client:
├─ 'placeBid' { auctionId, bidAmount }
└─ 'join-room' (when client loads auction room)

Events broadcast to all clients:
├─ 'auctionUpdate' { currentBid, highestBidder, bidCount, timeRemaining }
└─ 'time-extended' { newEndTime } (anti-sniping trigger)

REST API:
├─ GET /api/auctions (list all)
├─ GET /api/auctions/:id (single auction)
├─ GET /api/auctions/:id/bids (bid history)
└─ WebSocket for real-time events
```

### Key Components
- **Frontend:** `src/components/AuctionRoom.jsx`, `src/components/BidHistory.jsx`
- **Backend Socket:** `server/socket/auctionSocket.js`
- **Model:** `Auction` (bid tracking, timeline)
- **Real-time:** Socket.io with atomic operations

### Database Schema

```
Auction document:
{
  "_id": "auction_xyz",
  "productId": "product_abc",
  "startingPrice": 50000,
  "reservePrice": 45000,
  "currentBid": 53000,
  "highestBidder": "user_123",
  "bidders": ["user_123", "user_456", ...],
  "bidCount": 14,
  "startTime": "2026-04-15T10:00:00Z",
  "endTime": "2026-04-16T10:03:30Z", // Extended due to anti-sniping
  "minBidIncrement": 1000,
  "requiredVipTier": 3, // GOLD = 3
  "status": "live",
  "bids": [
    { bidderId: "user_456", amount: 52000, placedAt: "..." },
    { bidderId: "user_123", amount: 53000, placedAt: "..." }
  ]
}
```

### Best Practices
- ✅ Anti-sniping prevents last-second bids
- ✅ VIP tier requirement creates exclusivity
- ✅ Real-time updates via Socket.io
- ✅ Atomic database operations prevent race conditions
- ✅ Beautiful UI shows bid history & excitement

---

## 10. Drops & Waitlist

### What It Does
Limited edition watches released on specific dates. Users join a waitlist. When release time arrives, VIP members get 48-hour early access before public sale.

### How It Works

**Drop Creation (Admin):**

```
Admin creates drop:
1. Select product: "Omega Seamaster Limited Edition"
2. Set release date: April 20, 2026 at 10:00 AM UTC
3. Set quantity: 50 units available
4. VIP early access: 48 hours before public
5. Publish

Status: "upcoming" until release time
```

**User Waitlist Journey:**

```
Regular User (Bronze/Silver):
1. Views drop: "Omega Limited Edition - Releases Apr 20"
2. Clicks "Join Waitlist"
3. System saves: Waitlist(userId, dropId, vipTier: "bronze")
4. Page shows: "You're #112 in line"
5. Background job: Monitors release date
6. Apr 19, 10:00 AM: Drop transitions to "live"
7. All waitlist members get notification:
   ├─ Email: "Limited edition now available!"
   └─ Push: "Omega now for sale - click to view"
8. User receives notification
9. Clicks → Goes to product page
10. Can purchase immediately (while stock available)

Platinum VIP User:
1. Same flow, but gets notification earlier
2. Apr 18, 10:00 AM: Early notification (48h before public)
   ├─ Email: "VIP Early Access - Available for 48 hours"
   ├─ Only Platinum/Gold see this notification initially
3. Gets 48-hour head start to purchase
4. Apr 20, 10:00 AM: Public access opens
5. Bronze/Silver/non-members can then purchase
```

**Waitlist Prioritization:**

```
When stock is limited, waitlist sorts by:
1. VIP tier (Platinum → Gold → Silver → Bronze)
2. Join date (Earlier join = higher priority)
3. Purchase history score (Frequent buyers prioritized)

Example: Only 50 units available
├─ Platinum users: Allocated first (48h head start)
├─ Gold users: See it next (48h head start)
├─ Silver users: Then public (Apr 20)
└─ Bronze users: Last, if stock remains
```

**Background Job Processing:**

```
Cron Job: Every 5 minutes check for releases

If Drop.releaseDate <= now AND status = "upcoming":
├─ Update Drop.status = "live"
├─ Fetch all Waitlist entries for this drop
├─ For each waitlisted user:
│  ├─ Check: VIP tier for early access?
│  ├─ Determine: Send now (if VIP) or send Apr 20 (if not)
│  ├─ Find: User push subscriptions
│  ├─ Send: Web push notification
│  ├─ Send: Email notification
│  └─ Mark: Waitlist.notified = true
└─ Log: "Released 50-unit drop to 247 waitlisted users"
```

### Backend Processing

```
POST /api/drops/:id/waitlist (join waitlist)
{
  "dropId": "drop_xyz"
}

Response:
{
  "position": 112,
  "vipTier": "gold",
  "earlyAccessStarts": "2026-04-18T10:00:00Z",
  "publicReleaseDate": "2026-04-20T10:00:00Z",
  "message": "You're #112. Gold members get 48h early access!"
}

GET /api/drops (list upcoming & live drops)
Response:
{
  "drops": [
    {
      "productId": "...",
      "productName": "Omega Seamaster Limited",
      "releaseDate": "2026-04-20T10:00:00Z",
      "quantity": 50,
      "quantityRemaining": 34,
      "status": "live",
      "vipEarlyAccessEnds": "2026-04-22T10:00:00Z",
      "yourPosition": 112,
      "yourTier": "gold",
      "earlyAccess": true
    }
  ]
}
```

### Key Components
- **Frontend:** `src/app/(storefront)/drops/page.jsx`, `src/components/DropCountdown.jsx`
- **Backend:** `GET /api/drops`, `POST /api/drops/:id/waitlist`
- **Cron Job:** `server/jobs/dropReleaser.js`
- **Model:** `Drop`, `Waitlist`
- **Notifications:** Email + Push services

### Database Schema

```
Drop document:
{
  "_id": "drop_xyz",
  "productId": "...",
  "releaseDate": "2026-04-20T10:00:00Z",
  "quantity": 50,
  "status": "upcoming", // or "live" or "ended"
  "vipEarlyAccessHours": 48,
  "createdAt": "2026-04-15T10:00:00Z"
}

Waitlist document:
{
  "_id": "waitlist_abc",
  "dropId": "drop_xyz",
  "userId": "user_123",
  "vipTier": "gold",
  "joinedAt": "2026-04-15T14:30:00Z",
  "notified": true,
  "notifiedAt": "2026-04-18T10:00:00Z"
}
```

### Best Practices
- ✅ VIP tiers get genuine early access (48h)
- ✅ Fair sorting prevents favoritism
- ✅ Automated job handles release timing
- ✅ Perfect for creating scarcity & hype
- ✅ All users stay informed via notifications

---

## 11. Watch Rentals

### What It Does
Users rent premium watches for 7, 14, or 30 days with security deposits. Rental fees can be credited toward purchase.

### How It Works

**Rental Product Setup (Admin):**

```
Admin marks product as rentable:
1. Edit watch: "Rolex Submariner"
2. Toggle: "Enable Rentals" ON
3. Configure:
   ├─ Daily rate (% of price): 1.5%
   ├─ Available rental periods: 7, 14, 30 days
   └─ Security deposit: 20% of price
4. Save
```

**User Rental Flow:**

```
User views rentable product: Rolex Submariner ($12,000)

Rental options appear:
├─ 7-day rental:
│  ├─ Daily rate: 1.5% × $12,000 = $180
│  ├─ Rental cost: $180 × 7 = $1,260
│  ├─ Security deposit: $2,400 (20%)
│  └─ Total charge: $3,660
│
├─ 14-day rental:
│  ├─ Daily rate: 1.5% × $12,000 × 0.9 = $162 (10% discount)
│  ├─ Rental cost: $162 × 14 = $2,268
│  ├─ Security deposit: $2,400
│  └─ Total charge: $4,668
│
└─ 30-day rental:
   ├─ Daily rate: 1.5% × $12,000 × 0.7 = $126 (30% discount)
   ├─ Rental cost: $126 × 30 = $3,780
   ├─ Security deposit: $2,400
   └─ Total charge: $6,180
   └─ + Special offer: "If you purchase, $3,780 applied to price!"
```

**Rental Purchase Option:**

```
During rental period, user can purchase:

"Interested in buying? 
 Your $3,780 rental fee applies as a credit.
 New price: $12,000 - $3,780 = $8,220"

User clicks "Upgrade to Purchase":
├─ Existing rental cancelled
├─ Rental fee ($3,780) credited as discount
├─ New order created: Price = $8,220
├─ Security deposit returns to user
└─ Watch shipped as purchase, not rental
```

**Rental Return & Deposit Handling:**

```
Timeline:
├─ Day 1: Rental starts, watch delivered
├─ Day 8: Rental period ends
├─ Backend: Sends "Please return watch" email with:
│  ├─ Return shipping label (pre-paid)
│  ├─ Inspection checklist
│  └─ Deadline (within 3 days)
│
├─ Day 10: Customer ships watch back
├─ Day 12: Watch received & inspected
├─ Inspection:
│  ├─ ✓ No damage: Full security deposit refunded
│  ├─ Minor damage: Deposit -$100-500 (repair estimate)
│  └─ Major damage: Deposit -$500+ (or claim insurance)
│
└─ Day 13: Refund processed, customer notified
```

**Rental to Purchase Conversion:**

```
If user purchases during rental:
├─ Security deposit NOT refunded (applied as credit)
├─ Rental fee credit applied to purchase price
├─ Watch ships as owned product
└─ Warranty starts from purchase date

Example:
├─ Rental cost: $1,260 (7 days)
├─ Security deposit: $2,400 (will keep)
├─ Purchase price: $12,000
├─ New price: $12,000 - $1,260 = $10,740
└─ Security deposit kept: Not additional charge
```

### Backend Processing

```
POST /api/rentals (start rental)
{
  "productId": "...",
  "rentalDays": 14
}

Response:
{
  "rentalId": "rental_xyz",
  "rentalCost": 2268,
  "securityDeposit": 2400,
  "totalCharge": 4668,
  "rentalPeriod": "2026-04-15 to 2026-04-29",
  "purchaseCreditIfBought": 2268,
  "trackingNumber": "UPS123456"
}

PUT /api/rentals/:id/convert-to-purchase
{
  "rentalId": "rental_xyz"
}

Response:
{
  "orderId": "order_new",
  "originalPrice": 12000,
  "rentalCredit": 2268,
  "newPrice": 9732,
  "securityDepositKept": 2400,
  "message": "Converted to purchase! Watch on the way."
}
```

### Key Components
- **Frontend:** `src/app/(storefront)/rentals/page.jsx`, `src/components/RentalCard.jsx`
- **Backend:** `GET /api/rentals`, `POST /api/rentals`, `PUT /api/rentals/:id/convert-to-purchase`
- **Model:** `Rental` (tracks rental period, deposit, conversion status)

### Rental Pricing Configuration

```
server/routes/rentals.js has pricing constants:

RENTAL_DAILY_RATE = 0.015 (1.5% of price per day)
RENTAL_PERIODS = {
  7: { days: 7, discount: 1.0 },     // No discount
  14: { days: 14, discount: 0.9 },   // 10% daily rate discount
  30: { days: 30, discount: 0.7 }    // 30% daily rate discount
}
SECURITY_DEPOSIT_RATE = 0.20 (20% of price)
```

### Database Schema

```
Rental document:
{
  "_id": "rental_xyz",
  "userId": "user_123",
  "productId": "product_abc",
  "rentalDays": 14,
  "dailyRate": 162,
  "rentalCost": 2268,
  "securityDeposit": 2400,
  "totalCharge": 4668,
  "startDate": "2026-04-15",
  "endDate": "2026-04-29",
  "status": "active", // or "completed" or "converted"
  "convertedToOrderId": null, // If purchased
  "trackingNumber": "UPS123456",
  "depositRefunded": false,
  "depositRefundAmount": 2400,
  "createdAt": "2026-04-15T10:00:00Z"
}
```

### Best Practices
- ✅ Clear pricing with tiered discounts (longer = cheaper per day)
- ✅ Security deposit prevents abuse
- ✅ Rental-to-purchase conversion incentivizes buying
- ✅ Automated deposit refunds (or deduction for damage)
- ✅ Great for users wanting to "test drive" luxury watches

---

## 12. Warranty Passport

### What It Does
Digital warranty document auto-generated on delivery. Users can track service history and request repairs.

### How It Works

**Warranty Auto-Generation:**

```
When order transitions to "Delivered":
├─ Backend auto-creates Warranty document:
│  ├─ warrantyId: unique ID
│  ├─ orderId: reference to order
│  ├─ productId: watch details
│  ├─ serialNumber: auto-generated (can be customized)
│  ├─ purchaseDate: order date
│  ├─ warrantyStartDate: delivery date
│  ├─ warrantyEndDate: purchaseDate + 2 years
│  ├─ movementType: mechanical/automatic/quartz
│  ├─ nextServiceDueDate: purchaseDate + 5 years (auto-service)
│  └─ status: "active"
│
└─ Email sent to customer:
   ├─ "Your warranty is active until..."
   ├─ Download PDF warranty certificate
   └─ View warranty details online
```

**Warranty Portal (User View):**

```
User logs in → /warranty

Displays:
├─ "My Warranties" list:
│  ├─ Watch name: Rolex Submariner
│  ├─ Serial: RS-0012345
│  ├─ Purchase date: Jan 15, 2024
│  ├─ Warranty expires: Jan 15, 2026
│  ├─ Status: ACTIVE (green badge)
│  ├─ Next service due: Jan 15, 2029
│  └─ Action buttons:
│     ├─ View Details
│     ├─ Request Service
│     └─ Download Certificate (PDF)
│
└─ For each warranty, user can:
   ├─ View full warranty terms
   ├─ Check service history
   ├─ Request new service
   └─ Track service requests
```

**Request Service Flow:**

```
User clicks "Request Service" for Rolex

Form appears:
├─ "What's the issue?"
│  └─ Dropdown: Crystal scratch, Band link broken, Not keeping time, Other
├─ "Description"
│  └─ Text area for details
└─ Upload photo (optional)
└─ Submit

Backend creates ServiceRequest:
├─ serviceRequestId: auto-generated
├─ warrantyId: reference
├─ status: "submitted"
├─ description: User input
├─ photos: Uploaded images
├─ createdAt: timestamp
└─ Admin notified

Admin dashboard receives notification:
├─ "New service request for Rolex"
├─ Reviews details & photos
├─ Responds: 
│   ├─ "This is covered under warranty - arrange pickup"
│   └─ OR "This is wear & tear not covered"

Customer receives update:
├─ Status: "approved" or "rejected"
├─ If approved: "Pickup window: Thu-Fri 2-6 PM"
```

**Service Tracking:**

```
Service Request Status Journey:
│
├─ ① "Submitted" (customer submitted request)
│  └─ Waiting for admin review
│
├─ ② "Received" (admin reviewed & approved)
│  └─ Arrangement for pickup
│
├─ ③ "In Service" (watch at service center)
│  └─ User can see: "Est. completion: XXX"
│
├─ ④ "Ready" (service completed, watch ready)
│  └─ Awaiting customer pickup/shipping
│
└─ ⑤ "Returned" (service complete, watch back with user)
   └─ Warranty updated, next service date recalculated

Each status change emails the user
```

### Backend Processing

```
GET /api/warranty (get all my warranties)
Response:
{
  "warranties": [
    {
      "warrantyId": "war_xyz",
      "orderId": "order_abc",
      "productName": "Rolex Submariner",
      "serialNumber": "RS-0012345",
      "purchaseDate": "2024-01-15",
      "warrantyExpires": "2026-01-15",
      "movementType": "automatic",
      "nextServiceDue": "2029-01-15",
      "status": "active",
      "serviceHistory": [...]
    }
  ]
}

POST /api/warranty/:id/service-request (request service)
{
  "issue": "Crystal scratch",
  "description": "Small scratch on top edge",
  "photos": [base64_image]
}

Response:
{
  "serviceRequestId": "sr_xyz",
  "status": "submitted",
  "estimatedReviewTime": "24 hours",
  "trackingUrl": "/warranty/sr_xyz"
}
```

### Key Components
- **Frontend:** `src/app/(storefront)/warranty/page.jsx`, `src/components/WarrantyCard.jsx`, `src/components/ServiceTimeline.jsx`
- **Backend:** `GET /api/warranty`, `POST /api/warranty/:id/service-request`, `PUT /api/service/:id/status`
- **Model:** `Warranty`, `ServiceRequest`
- **PDF:** Certificate generation for download

### Database Schema

```
Warranty document:
{
  "_id": "war_xyz",
  "orderId": "order_abc",
  "userId": "user_123",
  "productId": "product_abc",
  "serialNumber": "RS-0012345",
  "purchaseDate": "2024-01-15T10:00:00Z",
  "warrantyStartDate": "2024-01-20T10:00:00Z",
  "warrantyEndDate": "2026-01-20T10:00:00Z",
  "movementType": "automatic",
  "nextServiceDueDate": "2029-01-20T10:00:00Z",
  "status": "active",
  "termsAgreed": true,
  "createdAt": "2024-01-20T10:00:00Z"
}

ServiceRequest document:
{
  "_id": "sr_xyz",
  "warrantyId": "war_xyz",
  "userId": "user_123",
  "issue": "Crystal scratch",
  "description": "Small scratch...",
  "photoUrls": ["..."],
  "status": "submitted", // or "approved", "in-service", "ready", "returned"
  "adminNotes": "Covered under warranty",
  "timeline": [
    { status: "submitted", timestamp: "..." },
    { status: "approved", timestamp: "..." }
  ],
  "createdAt": "2026-01-10T10:00:00Z"
}
```

### Best Practices
- ✅ Auto-generated on delivery (no manual work)
- ✅ Clear warranty terms accessible anytime
- ✅ Service request workflow is transparent
- ✅ PDF certificate downloadable
- ✅ Builds trust with customers

---

## 13. P2P Marketplace

### What It Does
Verified customers can list their Chronos purchases for sale. Built-in Chronos verification & escrow system.

### How It Works

**Seller Listing Creation:**

```
Verified seller (must have purchased from Chronos):
1. Navigates to: /marketplace → "Sell Your Watch"
2. Form appears:
   ├─ Select watch: "Rolex Submariner" (from my vault)
   ├─ Asking price: $9,500
   ├─ Condition: "Excellent" dropdown
   │  └─ Excellent (no scratches)
   │  └─ Very Good (minor scratches)
   │  └─ Good (visible scratches)
   │  └─ Fair (significant wear)
   ├─ Description: "Original box, papers, service history"
   ├─ Warranty ref: (optional) Select warranty dot on order
   └─ Photos: Upload up to 5 photos
3. Submits
4. Listing status: "pending-review" (admin verification)

Admin Review:
├─ Verifies seller has delivered/authenticated product
├─ Checks warranty reference if provided
├─ Approves listing
└─ Status: "active" (now visible to all buyers)
```

**Buyer Discovery:**

```
Buyer navigates to /marketplace

Sees listings:
├─ Watch image, brand, model
├─ Asking price
├─ Condition badge
├─ Chronos Verified badge (if warranty provided)
├─ Seller rating/reviews
├─ "View Details" link

Clicks listing → Detailed view:
├─ Full photo gallery
├─ Detailed description
├─ Condition notes
├─ Warranty details (if verified)
├─ Seller profile:
│  ├─ Number of watches sold
│  ├─ Average rating
│  └─ Feedback from buyers
└─ Actions:
   ├─ "Make Offer" (propose price)
   ├─ "Buy Now" (accept asking price)
   └─ "Message Seller" (chat)
```

**Chronos Verification:**

```
When seller links warranty:
├─ Backend verifies:
│  ├─ This warranty exists in system
│  ├─ For this serial number
│  └─ Seller is warranty owner
├─ Badge displayed: "✓ Chronos Verified"
├─ Buyer confidence increases (authentic product)
└─ May command premium price vs. unverified

Unverified listings:
├─ Still allowed to sell
├─ But no official Chronos badge
├─ Buyer must trust seller reputation
└─ May sell for less (buyer assumes risk)
```

**Purchase Flow:**

```
Buyer places order (two options):

Option 1: "Buy Now" (asking price)
├─ Checkout: Confirm purchase at asking price
├─ Payment: Same as standard checkout
├─ Funds held in escrow
├─ Email to seller: "Your watch has been purchased"
├─ Buyer ships watch (within 3 days)
└─ Tracking provided to buyer

Option 2: "Make Offer"
├─ Buyer proposes: $9,000 (less than $9,500 ask)
├─ Offer sent to seller
├─ Seller has 24 hours to:
│  ├─ Accept offer
│  ├─ Reject offer
│  └─ Counter-offer ($9,200)
├─ If accepted: Same escrow checkout as "Buy Now"
└─ If rejected: Buyer can make new offer
```

**Escrow & Delivery:**

```
After purchase:

Seller side:
├─ Prepares watch for shipping
├─ Includes: Original box, papers, service cards (if applicable)
├─ Creates shipping label (pre-paid by platform)
├─ Tracks shipment
├─ Provides tracking number to buyer

Buyer side:
├─ Receives tracking notification
├─ Watch arrives
├─ Has 3-day inspection period
├─ Inspects: Condition matches description?
│  ├─ YES: Release payment from escrow to seller ✓
│  ├─ NO: File dispute (Chronos reviews)
│  └─ Minor issue: Negotiate adjustment

Resolution:
├─ If satisfied: Funds release to seller
├─ If dispute: Chronos mediation
│  ├─ Reviewer looks at description vs. condition
│  ├─ Judges: Issue warrants return
│  ├─ Outcome: Partial refund or full return
│  └─ Costs: Seller covers return shipping

Seller paid within 3 days of buyer acceptance
```

### Key Components
- **Frontend:** `src/app/(storefront)/marketplace/page.jsx`, `src/components/ListingCard.jsx`
- **Backend:** `GET /api/listings`, `POST /api/listings`, `PUT /api/listings/:id/status`, `POST /api/listings/:id/offer`
- **Model:** `Listing` (product, seller, price, condition, warranty reference)
- **Escrow:** Managed via order system

### Database Schema

```
Listing document:
{
  "_id": "listing_xyz",
  "productId": "product_abc",
  "sellerId": "user_123",
  "title": "Rolex Submariner",
  "description": "Original box, papers included...",
  "askingPrice": 9500,
  "condition": "excellent",
  "photos": ["url1", "url2", ...],
  "warrantyRef": "war_xyz", // Optional - for Chronos verification
  "isChronosVerified": true,
  "views": 145,
  "status": "active", // or "pending-review", "sold", "delisted"
  "soldTo": null, // When sold, reference buyer order
  "createdAt": "2026-04-15T10:00:00Z"
}

Offer document (optional):
{
  "_id": "offer_abc",
  "listingId": "listing_xyz",
  "buyerId": "user_456",
  "offeredPrice": 9000,
  "status": "pending", // or "accepted", "rejected", "counter"
  "counterOffer": 9200,
  "expiresAt": "2026-04-16T10:00:00Z"
}
```

### Best Practices
- ✅ Verified sellers (must have purchase history)
- ✅ Chronos verification badge for authentic products
- ✅ Escrow protects both buyer & seller
- ✅ Admin mediation for disputes
- ✅ Fair dispute resolution

---

## 14. Visual Search

### What It Does
Users upload a watch photo, AI analyzes it, and returns similar watches from the catalog.

### How It Works

**User Flow:**

```
User sees camera icon on product page
Clicks → Camera modal opens

Options:
├─ Take photo (using device camera)
├─ Upload from gallery
└─ Cancel

Upload watch image (JPG/PNG, <5MB)

Backend processes:
├─ Receives base64 image
├─ Calls Claude Vision API
├─ Claude analyzes and returns:
│  ├─ Brand identification (if visible)
│  ├─ Dial color
│  ├─ Case type
│  ├─ Strap material
│  └─ Style category
│
└─ Backend searches catalog:
   ├─ Filters products matching attributes
   ├─ Sorts by relevance
   └─ Returns top 5 similar watches
```

**Response:**

```
Frontend displays:
├─ Original uploaded image
├─ Analysis results:
│  ├─ "Detected: Dress Watch"
│  ├─ "Dial: Blue"
│  ├─ "Case: Stainless Steel"
│  └─ "Similar watches found: 12 items"
│
└─ Carousel of 5 recommended watches:
   ├─ Omega Seamaster (67% match)
   ├─ Seiko Presage (62% match)
   ├─ Citizen Eco-Drive (58% match)
   ├─ Tissot PRX (55% match)
   └─ "View All Similar" button (shows 12 items)
```

### Backend Architecture

```
POST /api/visual-search
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}

Server processing:
1. Validates: Image exists, JPG/PNG, <5MB
2. Calls Claude Vision:
   ├─ Prompt: "Analyze this watch. Identify: brand, dial color, case type, strap, style"
   └─ Claude responds with JSON: { brand, dialColor, caseType, strap, style }
3. Builds search query:
   ├─ $regex for brand & style (if detected)
   ├─ Filters by similar specs
   └─ Ranks by relevance
4. Returns top matches with similarity scores
```

### Key Components
- **Frontend:** `src/components/VisualSearch.jsx`
- **Backend:** `POST /api/visual-search` in `server/routes/visualSearch.js`
- **File Upload:** Multer middleware
- **AI Engine:** Anthropic Claude Vision API
- **API Key:** `ANTHROPIC_API_KEY`

### Configuration

```env
# Enable visual search
ANTHROPIC_API_KEY=sk-ant-v7-xxxxx

# Multer file limits
MAX_FILE_SIZE=5242880 # 5MB
ALLOWED_TYPES=["image/jpeg", "image/png"]
```

### Best Practices
- ✅ File size limits prevent abuse
- ✅ Error handling if Claude API fails
- ✅ Graceful fallback to manual search
- ✅ Fast processing (< 3 seconds typical)
- ✅ Useful for visual shoppers

---

## 15. Push Notifications

### What It Does
Web push notifications for drops, order updates, and auction activity. Works as a PWA on mobile & desktop.

### How It Works

**Setup Process:**

```
User visits store → Sees browser notification permission request

User clicks "Allow"
  ↓
Browser: pushManager.subscribe() creates unique subscription
  ↓
Subscription includes:
  ├─ endpoint: unique URL for this device
  ├─ keys.auth: authentication token
  └─ keys.p256dh: encryption key

Frontend sends subscription to backend:
  ├─ POST /api/push/subscribe
  ├─ Body: { endpoint, keys }
  └─ Backend saves to PushSubscription model

User is now subscribed
```

**Trigger: Drop Release**

```
Admin creates drop: "New Omega Available Apr 20"

Cron job monitors release date

Apr 20, 10:00 AM:
├─ Drop status changes to "live"
├─ Find all waitlisted users
├─ For each user:
│  ├─ Fetch their push subscriptions
│  ├─ If subscription exists:
│  │  └─ Call web-push.sendNotification()
│  └─ User receives browser notification:
│     ├─ Title: "✨ Limited drop available!"
│     ├─ Body: "Omega Seamaster now in stock - tap to view"
│     ├─ Icon: Store logo
│     └─ Action: Click → Open store at watch page
```

**Trigger: Order Status Update**

```
Admin updates order to "Dispatched"

Backend:
├─ Finds customer
├─ Fetches their push subscriptions
├─ Sends notification:
│  ├─ Title: "📦 Your order is on the way!"
│  ├─ Body: "Tracking: UPS123456789"
│  └─ Click → Open order tracking page
```

**Trigger: Auction Activity**

```
User places bid in live auction

Notification sent to other bidders:
├─ Title: "⏰ Outbid alert!"
├─ Body: "Rolex Submariner now $53,000 - bid here"
└─ Click → Return to auction room
```

### Browser Notification Display

```
Desktop (Chrome, Firefox, Edge):
┌─────────────────────────┐
│ chronos.com             │
├─────────────────────────┤
│ [Icon] ✨ Limited drop   │
│        available!        │
│        Omega Seamaster   │
│        now in stock      │
│        [View] [Dismiss]  │
└─────────────────────────┘

Mobile (Chrome):
┌─────────────────────────┐
│ [Icon] ✨ Limited drop   │
│        available!        │
│        Omega Seamaster   │
│        now in stock -    │
│        tap to view       │
└─────────────────────────┘
```

### Service Worker Handling

```
public/sw.js listens for push events:

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  
  Show notification with:
  ├─ Title
  ├─ Body
  ├─ Icon
  └─ Click handler → open app at specific URL
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  Open window with stored URL:
  ├─ Drop notification → /drops
  ├─ Order update → /orders/:id
  └─ Auction alert → /auctions/:auctionId
});
```

### Key Components
- **Frontend:** `src/components/NotificationPermission.jsx`, `src/components/InstallPrompt.jsx`
- **Backend:** `POST /api/push/subscribe`, `POST /api/push/send`
- **Service Worker:** `public/sw.js`
- **Model:** `PushSubscription` (stores subscription data)
- **Library:** `web-push` package

### Database Schema

```
PushSubscription document:
{
  "_id": "pushsub_xyz",
  "userId": "user_123",
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": {
    "auth": "auth_token_xxxxx",
    "p256dh": "public_key_xxxxx"
  },
  "userAgent": "Chrome 120 on Windows",
  "createdAt": "2026-04-15T10:00:00Z",
  "lastUsed": "2026-04-15T15:30:00Z"
}
```

### Configuration

```env
# VAPID keys for signing push notifications
VAPID_PUBLIC_KEY=BKXxx...
VAPID_PRIVATE_KEY=xxx...
VAPID_EMAIL=yourstore@example.com

# Frontend uses public key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BKXxx...
```

### Best Practices
- ✅ User opt-in (browser permission)
- ✅ Graceful failures (if subscription invalid)
- ✅ Timely notifications (not spam)
- ✅ Relevant content (personalized to user)
- ✅ Action-oriented (clicking leads somewhere)
- ✅ Mobile-first design

---

## Summary

All 15 features are production-ready and secure:
- ✅ Real-time systems (auctions, notifications)
- ✅ AI integration (recommendations, visual search)
- ✅ Payment & transactions (secure checkout, pricing)
- ✅ User engagement (VIP system, gamification)
- ✅ Trust & safety (warranties, escrow, verification)
- ✅ Analytics (tracking, logging)

For deployment & customization, see:
- **ARCHITECTURE.md** — System design details
- **CUSTOMIZATION_GUIDE.md** — Branding & content changes
- **DEPLOYMENT_DETAILED.md** — Production setup
