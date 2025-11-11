# Quick Setup Guide

## Step 1: Install Dependencies

Run this command from the root directory:

```bash
npm run install:all
```

This installs dependencies for root, server, and client.

## Step 2: Setup Database

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ..
```

## Step 3: Create Environment File

Copy the example env file:

```bash
cd server
copy env.example .env
```

Or manually create `server/.env` with:

```
DATABASE_URL="file:./dev.db"
PORT=5000
ADMIN_KEY=my-secret-admin-key-123
NODE_ENV=development
```

**Important**: Change `ADMIN_KEY` to your own secret key for admin access.

## Step 4: Start Development Servers

From the root directory:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Step 5: Access the Website

- **Customer View**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## Using the Admin Dashboard

1. Go to http://localhost:3000/admin
2. Enter your admin key (the one you set in `.env`)
3. Click "Load Orders" to see all orders
4. Click "Mark Paid" when a customer pays at the counter

## Troubleshooting

- If port 3000 or 5000 is already in use, change them in:
  - `client/vite.config.js` (port 3000)
  - `server/.env` (PORT=5000)
- If database errors occur, delete `server/prisma/dev.db` and run migrations again
- Make sure Node.js version is 18 or higher


