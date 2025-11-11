# Shop Billing Website

A modern billing and ordering system for shops with snacks and food items. Customers can browse items with pictures, add to cart, place orders, and show receipts at the shop for pickup.

## Features

- 🍽️ **Menu Display**: Browse items with pictures organized by categories
- 🛒 **Shopping Cart**: Add items, adjust quantities, view totals
- 💳 **Payment Options**: Cash, Card, or UPI (with QR code) payment methods
- 📱 **UPI QR Code**: Scan-to-pay with GPay, PhonePe, Paytm, or any UPI app
- 📄 **Digital Receipt**: Order code and receipt to show at shop
- 👨‍💼 **Admin Dashboard**: View orders and mark payment status
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for root, server, and client.

### 2. Setup Database

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 3. Configure Environment

Create `server/.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=5000
ADMIN_KEY=your-secret-admin-key-here
NODE_ENV=development
```

### 4. Run Development Servers

From the root directory:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
billing/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app router
│   └── package.json
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js       # Seed data
│   ├── server.js          # Express server
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

- `GET /api/menu` - Get all menu items
- `POST /api/orders` - Create new order
- `GET /api/orders/:code` - Get order by code
- `GET /api/admin/orders` - Get all orders (requires admin key)
- `PATCH /api/admin/orders/:id/status` - Update payment status (requires admin key)

## Deployment

### Frontend (Vercel/Netlify)

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the `client/dist` folder to Vercel or Netlify

### Backend (Render/Railway)

1. Set environment variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `ADMIN_KEY` (your secret admin key)
   - `PORT` (usually auto-set by platform)

2. Update Prisma schema to use PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npm run prisma:migrate
npm run prisma:seed
```

## Usage

1. **Customers**: Visit the website, browse menu, add items to cart, checkout, and show receipt at shop
2. **Admin**: Visit `/admin`, enter admin key, view orders, and mark as paid when customer pays

## UPI Payment Setup

See `QUICK_START.md` for detailed UPI setup instructions.

Quick setup:
1. Get your UPI ID from your payment app
2. Create `client/.env` with `VITE_UPI_ID=your-upi-id@paytm`
3. Install dependencies: `cd client && npm install`
4. Restart dev server

## Future Enhancements

- Order tracking and notifications
- Inventory management
- Customer accounts and order history
- Payment gateway integration
- SMS/Email notifications

