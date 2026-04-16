# Chronos Admin Guide

**Complete walkthrough of the admin dashboard and management features**

---

## Table of Contents

1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Product Management](#product-management)
3. [Order Management](#order-management)
4. [Customer Management](#customer-management)
5. [Auction Management](#auction-management)
6. [Drop & Waitlist Management](#drop--waitlist-management)
7. [Marketplace Moderation](#marketplace-moderation)
8. [Analytics & Reports](#analytics--reports)
9. [Warranty & Service Management](#warranty--service-management)
10. [Settings & Configuration](#settings--configuration)
11. [User Support & Communications](#user-support--communications)

---

## Admin Dashboard Overview

### Accessing the Admin Area

**First-Time Setup:**
```
1. After running `npm run seed` in server directory
2. Admin account created with credentials from .env:
   └─ Email: {ADMIN_EMAIL} (default: admin@chronos.com)
   └─ Password: {ADMIN_PASSWORD} (default: Admin123@)

3. Navigate to: http://localhost:3000/admin
4. Login with admin credentials
5. Dashboard loads
```

### Dashboard Home Page

Location: `/admin` or `/admin/dashboard`

**Displays:**
```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Key Metrics (Top Row):                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  │ Revenue │ │ Orders  │ │ Customers│ │ Products│     │
│  │ $124K   │ │   427   │ │   1,203 │ │   47    │     │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │
│                                                         │
│  Quick Actions (Center):                               │
│  ├─ [ + New Product ]    [ + Create Drop ]            │
│  ├─ [ Create Auction ]   [ View Reports ]             │
│  └─ [ Manage Inventory ] [ System Health ]            │
│                                                         │
│  Recent Activity (Bottom):                             │
│  ├─ Last 10 orders                                     │
│  ├─ New customers registered                           │
│  ├─ Inventory alerts                                   │
│  └─ Support tickets pending                           │
│                                                         │
│  Navigation Sidebar:                                   │
│  ├─ Dashboard                                          │
│  ├─ Products                                           │
│  ├─ Orders                                             │
│  ├─ Customers                                          │
│  ├─ Auctions                                           │
│  ├─ Drops                                              │
│  ├─ Marketplace                                        │
│  ├─ Analytics                                          │
│  ├─ Warranty/Service                                   │
│  ├─ Settings                                           │
│  └─ Logout                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Product Management

### View All Products

Location: `/admin/products`

**Product List:**
```
Table columns:
├─ Product ID (link to detail)
├─ Name
├─ Brand
├─ Price
├─ Stock (current quantity)
├─ Status (active/inactive)
├─ VIP Discount (% off for tiers)
├─ Market Value (for vault tracking)
└─ Actions (Edit, Delete, Duplicate)

Filters:
├─ Brand: [Dropdown filter]
├─ Price range: $0 - $100,000
├─ Stock status: In stock / Low / Out of stock
└─ Status: Active / Inactive

Sorting:
├─ By name (A-Z)
├─ By price (low-high, high-low)
├─ By stock (ascending)
└─ By created date
```

### Create New Product

Location: `/admin/products/create`

**Form Fields:**
```
┌─ Basic Info
│  ├─ Product name: "Rolex Submariner"
│  ├─ Brand: [Dropdown or free text]
│  ├─ Model number: "116610LN"
│  ├─ Description: [Rich text editor]
│  ├─ Category: [Watch style category]
│  └─ Status: [Active/Inactive toggle]
│
├─ Pricing
│  ├─ Regular price: $8,995
│  ├─ Market value: $9,200 (for vault/resale display)
│  ├─ VIP discounts:
│  │  ├─ Silver tier: 5% off
│  │  ├─ Gold tier: 10% off
│  │  └─ Platinum tier: 15% off
│  └─ Sale price: [Optional, for promotions]
│
├─ Inventory
│  ├─ Stock quantity: 15 units
│  ├─ Reorder level: 5 units
│  ├─ Enable rentals: [Checkbox]
│  │  └─ If yes: Daily rate %, rental periods allowed
│  └─ Stock status: [Auto-calculated]
│
├─ Media
│  ├─ Primary image: [Upload JPG/PNG]
│  ├─ Gallery images: [Multiple upload, drag to reorder]
│  └─ 3D model file: [Optional, for configurator]
│
├─ Specifications
│  ├─ Movement type: [Mechanical/Automatic/Quartz]
│  ├─ Case material: [Stainless Steel/Gold/Titanium]
│  ├─ Dial color: [Color picker]
│  ├─ Water resistance: [1000m, 500m, etc]
│  ├─ Case diameter: [40mm, 42mm, etc]
│  └─ Strap type: [Leather/Metal/Rubber]
│
└─ Advanced
   ├─ SEO title: [For search engines]
   ├─ SEO description: [Meta description]
   ├─ Is featured: [Checkbox - appears on homepage]
   ├─ Is new arrival: [Checkbox - appears in new arrivals section]
   └─ Is best seller: [Checkbox - sorting order]

ACTION BUTTONS:
┌─ [ Save Draft ]   [ Preview ]   [ Publish ]   [ Cancel ]
```

### Edit Product

Location: `/admin/products/:id/edit`

Same form as "Create New Product" but pre-filled with current data.

**Additional Options:**
```
- View product on store (opens in new tab)
- View sales history (orders containing this product)
- View rental history (if rentable)
- Duplicate product (creates copy with new details)
- View 3D preview (if 3D model uploaded)
- See recent edits (who changed what, when)
```

### Bulk Actions

Location: `/admin/products` (select multiple items)

**Operations:**
```
Select multiple products:
1. Checkboxes appear next to each product
2. Review → Selection counter at top: "12 selected"
3. Bulk actions menu appears:
   ├─ [ Bulk Edit ]
   │  ├─ Change price (-$500, +10%)
   │  ├─ Change stock (+50, -30%)
   │  ├─ Add category tag
   │  └─ Enable/disable feature status
   │
   ├─ [ Export to CSV ]
   │  └─ Downloads: product_export_2026-04-15.csv
   │
   ├─ [ Bulk Price Update ]
   │  └─ Upload CSV with new prices
   │
   └─ [ Deactivate All ]
      └─ Hides from store
```

---

## Order Management

### View All Orders

Location: `/admin/orders`

**Orders List:**
```
Table columns:
├─ Order ID (link to detail)
├─ Customer name
├─ Order date
├─ Total amount
├─ Status (pending, processing, dispatched, delivered)
├─ Payment status (paid, pending, failed)
├─ VIP tier of customer
└─ Actions (View, Edit delivery, Refund, Cancel)

Filters:
├─ Date range: [From - To]
├─ Status: [Multi-select]
├─ Payment status: [All/Paid/Pending/Failed]
├─ VIP tier: [All/Bronze/Silver/Gold/Platinum]
├─ Amount range: $0 - $100,000
└─ Search by: Order ID / Customer email

Sorting:
├─ By date (newest first)
├─ By amount (high-low)
├─ By status
└─ By VIP tier
```

### Order Detail Page

Location: `/admin/orders/:id`

**Order Information:**
```
Header:
├─ Order ID: #ORD-2026-0312
├─ Status: Dispatched
├─ Payment: Paid
└─ Order date: Apr 12, 2026 @ 3:45 PM

Customer Section:
├─ Name: Jane Doe
├─ Email: jane@example.com
├─ VIP Tier: Gold ($5,100 spent)
├─ Phone: (555) 123-4567
├─ Shipping address: [Full address]
└─ Billing address: [Full address]

Items Section (Order Contents):
├─ Rolex Submariner (1x)
│  ├─ Price: $8,995
│  ├─ Configuration: [If custom config]
│  │  └─ Strap: Leather, Dial: Black
│  └─ Status: Shipped
│
└─ Warranty: [Auto-generated if delivered]
   └─ Expires: Apr 12, 2028

Pricing Breakdown:
├─ Subtotal: $8,995.00
├─ VIP Discount (10%): -$899.50
├─ Shipping: Free (VIP perk)
├─ Tax: $689.59
└─ Total: $9,685.09

Payment Details:
├─ Method: Credit Card (****1234)
├─ Status: Paid
├─ Transaction ID: txn_abc123xyz
└─ Paid at: Apr 12, 2026 @ 3:50 PM

Delivery Timeline:
├─ You can manually advance stages OR set auto-progression

Current stage options:
├─ [ Advance to: Processing ]
├─ [ Advance to: Quality Check ]
├─ [ Add Tracking Number ]
│  └─ [Input field]
├─ [ Notify Customer ]
└─ [ Request Concierge Callback ] (if Platinum)

Gift Status (if applicable):
├─ Is gift: YES
├─ Recipient email: friends@example.com
├─ Message: "Happy birthday..."
├─ Reveal token: gift_abc123xyz
└─ Accessed: No (not yet viewed)
```

### Update Order Status

**Manual Status Update:**
```
Admin clicks dropdown → Select new status

Workflow:
pending → processing → quality-check → dispatched → out-for-delivery → delivered

Each transition:
1. Can add internal note: "Ready to ship, awaiting carrier"
2. Can add tracking number: "UPS123456789"
3. Select: "Notify customer" checkbox
4. Click "Update"

Result:
├─ Order status changes
├─ Customer email sent (if notified)
├─ Timeline updated with timestamp
└─ Admin action logged
```

**Auto-Progression Setup:**
```
Instead of manual: Click "[ Auto-advance ]"

Options:
├─ Advance in 2 hours
├─ Advance in 1 day
├─ Advance in 3 days
├─ Schedule specific date/time
└─ Stop auto-progression

System will:
├─ Wait specified time
├─ Advance order automatically
├─ Send notification to customer
└─ Log automated transition
```

### Refunds & Returns

**Process Refund:**
```
1. Click "[ Refund ]" button on order
2. Refund dialog appears:
   ├─ Full refund: $9,685.09
   ├─ Partial refund: [Input custom amount]
   ├─ Reason: [Dropdown - Customer request/Damaged/Other]
   ├─ Note: [Free text for internal tracking]
   └─ Notify customer: [Checkbox]
3. Click "Process refund"
4. Refund initiated to original payment method
5. Customer receives email: "Refund processed: $9,685.09"
6. Refund shows in transaction history

Refund processing:
├─ May take 3-5 business days (payment processor)
├─ Admin sees status: "Processing" → "Completed"
└─ Order status option changes to "Refunded"
```

---

## Customer Management

### View All Customers

Location: `/admin/customers`

**Customers List:**
```
Table columns:
├─ Customer name (link to detail)
├─ Email
├─ VIP tier (badge with color)
├─ Total spent (lifetime)
├─ Orders (count)
├─ Joined date
└─ Status (active/inactive)

Filters:
├─ VIP tier: [All/Bronze/Silver/Gold/Platinum]
├─ Spend range: $0 - $100,000
├─ Orders: 0-5 / 5-10 / 10+
├─ Joined: Last 30 days / 90 days / all time
└─ Status: Active / Inactive

Search:
├─ By name
├─ By email
└─ By customer ID
```

### Customer Detail Page

Location: `/admin/customers/:id`

**Profile Information:**
```
Basic Info:
├─ Name: Jane Doe
├─ Email: jane@example.com
├─ Phone: (555) 123-4567
├─ VIP tier: Gold ⭐
├─ Status: Active
├─ Joined: Jan 15, 2024
└─ Last login: Apr 12, 2026 @ 2:30 PM

Spending Analysis:
├─ Total spent: $5,125
├─ Average order: $1,281
├─ Largest order: $2,495
├─ Orders (total): 4
├─ Progress to next tier (Platinum): $14,875 remaining
└─ VIP tier history:
   ├─ Bronze until Apr 10, 2025
   ├─ Silver until Jan 15, 2026
   └─ Gold since Jan 15, 2026

Addresses:
├─ Shipping addresses on file: 2
├─ Billing addresses on file: 1
└─ Default shipping: [Edit/Change]

Order History:
├─ Recent orders (last 5)
│  ├─ #ORD-2026-0312 ($9,685) - Delivered
│  ├─ #ORD-2026-0289 ($4,200) - Delivered
│  ├─ #ORD-2026-0251 ($1,500) - Delivered
│  └─ More... [View all orders]
│
└─ Quick stats:
   ├─ Returns: 1 (20% return rate)
   └─ Disputes: 0

Account Actions:
├─ [ Edit Profile ]
├─ [ View Order History ]
├─ [ View Wishlist ]
├─ [ Manually Upgrade Tier ] → Manual tier boost if needed
├─ [ Send Message ] (write customer note)
├─ [ Deactivate Account ]
└─ [ Delete Account ] (with confirmation)

Communication History:
├─ Messages sent to customer
└─ Support tickets / inquiries
```

---

## Auction Management

### View All Auctions

Location: `/admin/auctions`

**Auctions List:**
```
Table columns:
├─ Auction ID
├─ Product name
├─ Status (upcoming, live, ended)
├─ Start price
├─ Current bid
├─ Time remaining (if live)
├─ Bid count
└─ Actions (Edit, End early, View room)

Filters:
├─ Status: [All/Upcoming/Live/Ended]
├─ Date range
└─ Price range
```

### Create New Auction

Location: `/admin/auctions/create`

**Form:**
```
├─ Select product: [Dropdown of inventory]
├─ Starting price: $50,000
├─ Reserve price: $45,000
├─ Minimum bid increment: $1,000
├─ Duration: [24 hours / 48 hours / 7 days / custom]
├─ Start time:
│  ├─ Immediately
│  ├─ Schedule for: [Date/time picker]
│  └─ Repeating: [Weekly/Monthly - leave blank for one-time]
├─ Required VIP tier: [Bronze/Silver/Gold/Platinum]
│  └─ Only this tier and above can bid
├─ Features:
│  ├─ [ ] Allow offers below starting price
│  ├─ [ ] Featured auction (homepage display)
│  └─ [ ] VIP exclusive
└─ Description: [Rich text editor]

[ Create & Publish ]
```

### Manage Live Auction

Location: `/admin/auctions/:id/manage`

**Live Auction Controls:**
```
Current Status:
├─ Product: Rolex Submariner
├─ Current bid: $52,000 (highest bidder: John S.)
├─ Bid count: 14
├─ Time remaining: 2h 34m
├─ High bidder tier: Gold

Live Actions:
├─ [ Manual Bid ] (admin can place bid on behalf of inactive bidder)
├─ [ Add Time ] (extend auction - emergency only)
│  └─ Add [number] minutes
├─ [ End Auction ] (emergency stop - unlikely winner declared)
│  └─ Reason: [Dropdown - technical issue, product damaged, etc]
├─ [ Pause Auction ] (freeze bidding temporarily)
└─ [ View Bid History ] (detailed log)

Bid History Table:
├─ Bidder (name or anonymous if privacy requested)
├─ Amount
├─ Time
├─ Auto-extended? (if bid in last 2 min)
└─ IP/Location (for fraud detection)
```

---

## Drop & Waitlist Management

### Create New Drop

Location: `/admin/drops/create`

**Form:**
```
├─ Select product: [Dropdown]
├─ Release date/time: [Date/time picker]
├─ Quantity available: 100 units
├─ VIP early access: 48 hours
│  ├─ Early access tiers: [Gold, Platinum checkboxes]
│  └─ Early access starts: 2 days before public
├─ Description: [Rich text]
└─ Marketing:
   ├─ [ ] Featured on homepage
   ├─ [ ] Send announcement email to all subscribers
   └─ [ ] Create anticipation countdown

[ Create Drop ]
```

### View Waitlist

Location: `/admin/drops/:id/waitlist`

**Waitlist Display:**
```
Drop: Omega Seamaster Limited Edition
Release date: Apr 20, 2026

Waitlist statistics:
├─ Total on waitlist: 247 users
├─ By VIP tier:
│  ├─ Platinum: 12
│  ├─ Gold: 45
│  ├─ Silver: 89
│  └─ Bronze: 101
└─ Sent notifications: 0 (Not released yet)

Waitlist Table (sorted by tier → join date):
├─ Position | Name | Email | Tier | Joined | Status
├─ 1 | John Smith | john@... | Platinum | Apr 10 | Notified
├─ 2 | Sarah Chen | sarah@.. | Platinum | Apr 11 | Notified
├─ ...
└─ 247 | Bronze User | bronze@.. | Bronze | Apr 14 | Pending

Actions:
├─ [ Export to CSV ] (for CRM/email)
├─ [ Send Manual Notification ] (if release delayed)
└─ [ View Analytics ] (engagement rates, conversion)
```

---

## Marketplace Moderation

### Pending Listings

Location: `/admin/marketplace/pending`

**Listings Awaiting Approval:**
```
Table:
├─ Listing ID
├─ Seller name
├─ Watch product
├─ Asking price
├─ Condition
├─ Chronos verified? (Has warranty reference?)
└─ Actions (Approve, Reject, Request more info)

Click listing → Detail view:
├─ Seller profile (verified buyer?)
├─ Product condition (matches description claimed?)
├─ Photos (adequate, clear?)
├─ Warranty reference (valid serial number?)
├─ Pricing (fair market value?)
└─ Red flags:
   ├─ New seller (untrusted)
   ├─ Price unusually low (possible counterfeit?)
   ├─ Damaged photos
   └─ Missing warranty ref (but claimed authentic)

Admin decision:
├─ [ APPROVE ] → Listing goes live
├─ [ REJECT ] → Seller notified, reason sent
│  └─ Reason: [Dropdown - price too low, poor photos, etc]
└─ [ REQUEST INFO ] → Ask seller to clarify/improve
   └─ Message: [Text field]
```

### Flag & Review Risky Listings

```
Flags that trigger review:
├─ Price dropped significantly after listing
├─ Multiple price changes in short time
├─ Large number of views but no sales
├─ Seller asking for off-platform payment
├─ Customer disputes/refund requests
└─ Possible warranty fraud detected

Admin can:
├─ Flag listing as "Under Investigation"
├─ Temporarily hide from search
├─ Contact seller with questions
├─ Contact buyer if dispute pending
├─ Request proof of authenticity
└─ Delist if fraud confirmed
```

---

## Analytics & Reports

### Analytics Dashboard

Location: `/admin/analytics`

**Key Metrics:**
```
Revenue Section:
├─ Total revenue (all-time): $1,247,500
├─ Monthly revenue: $94,300 (Apr 2026)
├─ Weekly revenue: $21,840 (last 7 days)
├─ Daily average: $3,120
└─ Revenue trend chart (line graph - last 12 months)

Orders Section:
├─ Total orders: 427
├─ Orders this month: 34
├─ Average order value: $2,921
├─ Fulfillment rate: 98.7%
│  └─ On time: 98.7%, Late: 1.2%, Cancelled: 0.1%
└─ Orders by status chart

Customer Analysis:
├─ Total customers: 1,203
├─ New this month: 47
├─ VIP tier distribution (pie chart):
│  ├─ Platinum: 45 (3.7%)
│  ├─ Gold: 156 (13%)
│  ├─ Silver: 298 (24.8%)
│  └─ Bronze: 704 (58.5%)
├─ Customer retention: 87%
└─ Churn rate: 13%

Feature Adoption:
├─ AR Try-on uses: 2,341 (45% of shoppers)
├─ Visual search queries: 784
├─ Concierge messages: 3,127 average/month
├─ Configurator creations: 456
└─ Rental bookings: 23 (this month)

Inventory:
├─ Total SKUs: 47
├─ In stock: 312 units
├─ Low stock (<5): 3 products
│  └─ Alert: Re-order needed
├─ Out of stock: 0
└─ Turnover rate: 12.3 times/year

Top Products:
├─ 1. Rolex Submariner: 89 sold ($798K revenue)
├─ 2. Omega Seamaster: 67 sold ($536K revenue)
├─ 3. Seiko 5: 45 sold ($180K revenue)
└─ More... [View full product report]
```

### Custom Reports

**Generate Reports:**
```
Options:
├─ Sales report (date range, product, customer tier)
├─ Customer acquisition (source, channel, retention)
├─ Rental analysis (conversion rate, popular models)
├─ Auction analytics (average bid, completion rate)
├─ Warranty claims (warranty fraud detection)
├─ Return/refund analysis
└─ VIP tier progression (how many customers per tier)

Export:
├─ PDF (formatted report)
├─ CSV (spreadsheet import)
├─ JSON (API integration)
└─ Email report (scheduled, e.g., weekly summary)
```

---

## Warranty & Service Management

### Service Requests

Location: `/admin/warranty/service-requests`

**Pending Requests:**
```
Table:
├─ Request ID
├─ Customer name
├─ Product
├─ Issue type
├─ Status (submitted, approved, in-service, ready, returned)
└─ Actions (Approve, Reject, Update status, Contact customer)

Click request → Detail:
├─ Customer info
├─ Product warranty info
├─ Issue description + customer photos
├─ Admin assessment:
│  ├─ Covered under warranty? [Yes/No]
│  ├─ Estimate for repair: [If approved]
│  ├─ Shipping address for return: [Customer provided]
│  └─ Notes: [Internal notes for technician]
│
└─ Actions:
   ├─ [ APPROVE ] → Send "approved" email with shipping details
   ├─ [ REJECT ] → Send "declined" email with reason
   └─ [ REQUEST MORE INFO ] → Ask customer for photos/details
```

### Warranty Reports

**Summary:**
```
├─ Active warranties: 487
├─ Warranty period: 2 years from delivery
├─ Claims this month: 12
├─ Claim rate: 2.5%
├─ Most common claims:
│  ├─ Crystal scratch: 4
│  ├─ Band link broken: 3
│  ├─ Not keeping time: 2
│  └─ Other: 3
└─ Fraudulent claims detected: 0
```

---

## Settings & Configuration

### Store Settings

Location: `/admin/settings/general`

**Basic Configuration:**
```
├─ Store name: Chronos
├─ Store slug: chronos
├─ Store tagline: Luxury Watch Platform
├─ Contact email: support@chronos.com
├─ Support phone: (555) 123-4567
├─ Currency: USD
├─ Timezone: UTC-5
├─ Tax rate: 8.2%
└─ Shipping costs:
   ├─ Standard (5-7 days): Free ($0)
   ├─ Express (2-3 days): $50
   └─ Overnight: $150
```

### Admin Users

Location: `/admin/settings/admins`

**Manage Admin Accounts:**
```
Current admins:
├─ Admin User 1 (admin@chronos.com) - Full access ✓
├─ Manager User 2 (manager@chronos.com) - Products, Orders only
└─ Support Lead 3 (support@chronos.com) - Orders, Customers

Add new admin:
├─ Email: [Input]
├─ Name: [Input]
├─ Role:
│  ├─ Full admin (all features)
│  ├─ Products manager (products only)
│  ├─ Orders manager (orders + customers)
│  ├─ Support staff (customer service only)
│  └─ Analytics viewer (read-only reports)
│
└─ [ Invite ] (sends email with setup link)
```

### API Keys & Webhooks

Location: `/admin/settings/integrations`

**Configured Services:**
```
├─ Anthropic Claude: ✓ Connected
├─ SMS provider: Not configured
├─ Payment processor: ✓ Connected
├─ Email service: ✓ Connected
└─ Analytics: ✓ Connected

JWT Secret Management:
├─ Current secret: Last 4 chars: ...f7a9
├─ Created: Jan 1, 2026
├─ Last rotated: Jan 1, 2026
└─ [ Rotate secret ] (invalidates all existing tokens)
```

---

## User Support & Communications

### Messaging Center

Location: `/admin/support/messages`

**Support Tickets/Messages:**
```
├─ Unread: 3
├─ Total this month: 47

Inbox:
├─ 1. Jane Doe - "Question about warranty" (1 hour ago)
├─ 2. John Smith - "Delivery delay inquiry" (3 hours ago)
├─ 3. Sarah Chen - "Rental agreement question" (5 hours ago)

Click message → View thread:
├─ Customer message
├─ Previous replies (if any)
├─ [ Reply ] text box
├─ Actions:
│  ├─ Mark as resolved
│  ├─ Forward to support team
│  └─ Template responses (quick replies)

Templates available:
├─ "Thank you for your order"
├─ "Delivery update"
├─ "Warranty expired" (with option to renew)
└─ Custom templates
```

### Email Broadcast

Location: `/admin/communications/broadcast`

**Send Messages to Users:**
```
Create campaign:
├─ Recipient group:
│  ├─ All customers
│  ├─ By VIP tier (Platinum, Gold, Silver, Bronze)
│  ├─ By purchase history (bought in last 30/60/90 days)
│  ├─ By location
│  └─ Custom segment
│
├─ Subject: [Input]
├─ Message: [Rich text editor]
├─ Add CTA button: [Optional]
│  └─ Button text: "View collection"
│  └─ Link: "https://..."
│
├─ Preview: [Shows how email looks]
├─ Send options:
│  ├─ Send immediately
│  ├─ Schedule for: [Date/time]
│  └─ Send weekly/monthly (repeating)
│
└─ [ Send ] (or [ Schedule ])

Analytics:
├─ Sent: 1,203 emails
├─ Opened: 467 (38.8%)
├─ Clicked: 123 (10.2%)
└─ Conversions: 34 orders from email
```

---

## Quick Tips

### Common Admin Tasks

**Weekly Checklist:**
```
□ Review pending marketplace listings
□ Check inventory levels (reorder low stock)
□ Review support tickets
□ Check analytics for trends
□ Verify payment processing
```

**Monthly Checklist:**
```
□ Generate sales report
□ Review customer feedback
□ Update product descriptions/images
□ Plan new drops/limited editions
□ Review warranty claims
□ Check for fraudulent activity
```

**Quarterly Checklist:**
```
□ Review pricing strategy
□ Audit user accounts (deactivate inactive)
□ Security review (API keys, admin access)
□ Campaign performance analysis
□ Team performance review
```

### Best Practices
- ✅ Always notify customers of status changes
- ✅ Approve/reject marketplace listings within 24 hours
- ✅ Monitor low-stock alerts to avoid overselling
- ✅ Keep admin login credentials secure
- ✅ Rotate API keys quarterly
- ✅ Archive old orders/data regularly
- ✅ Respond to support tickets promptly

---

For more details:
- See **FEATURE_GUIDE.md** for how each feature works
- See **DEPLOYMENT_DETAILED.md** for production admin setup
