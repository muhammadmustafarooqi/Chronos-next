# Chronos Backend Server

MongoDB-powered REST API for the Chronos Luxury Watch Store.

## Prerequisites

- **Node.js** v18+ 
- **MongoDB** v6+ (local installation or MongoDB Atlas)

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Edit `.env` file with your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chronos
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chronos
```

### 3. Start MongoDB (if using local)

```bash
# Windows - run as Administrator
mongod

# Or if installed as service, it should be running automatically
```

### 4. Seed Database (Optional)

Populate the database with initial watch data:

```bash
cd server
node scripts/seed.js
```

### 5. Start the Server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/new-arrivals` | Get new arrivals |
| GET | `/api/products/categories` | Get categories |
| GET | `/api/products/brands` | Get brands |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/my-orders` | Get user's orders |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id/status` | Update status (Admin) |
| DELETE | `/api/orders/:id` | Delete order (Admin) |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers (Admin) |
| GET | `/api/customers/:id` | Get customer details (Admin) |
| PUT | `/api/customers/:id/status` | Update status (Admin) |
| DELETE | `/api/customers/:id` | Delete customer (Admin) |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get user's wishlist |
| POST | `/api/wishlist/:productId` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |
| POST | `/api/wishlist/toggle/:productId` | Toggle wishlist item |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get dashboard stats |
| POST | `/api/admin/seed` | Seed database |

## Admin Credentials

```
Email: admin@yourstore.com (created after running `npm run seed`)
Password: (set during seed script - see SETUP.md)
```

## Running with Frontend

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd .. 
npm run dev
```

The frontend will connect to the backend at `http://localhost:5000/api`

## File Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication
├── models/
│   ├── Customer.js        # Customer schema
│   ├── Order.js           # Order schema
│   ├── Product.js         # Product schema
│   └── User.js            # User schema
├── routes/
│   ├── admin.js           # Admin routes
│   ├── auth.js            # Authentication routes
│   ├── customers.js       # Customer routes
│   ├── orders.js          # Order routes
│   ├── products.js        # Product routes
│   └── wishlist.js        # Wishlist routes
├── scripts/
│   └── seed.js            # Database seeder
├── .env                   # Environment variables
├── package.json
└── server.js              # Main entry point
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check if the port 27017 (default MongoDB port) is not blocked

### Port Already in Use
- Change the PORT in `.env` file
- Kill any process using port 5000

### CORS Issues
- The server allows requests from `http://localhost:5173` and `http://localhost:3000`
- Add more origins in `server.js` if needed
