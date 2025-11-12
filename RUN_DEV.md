# Running Development Server from Root

## Quick Start

From the **root directory** (`C:\Users\Dell\Desktop\billing`), run:

```bash
npm run dev
```

This will start both:
- **Backend Server**: http://localhost:5000
- **Frontend Client**: http://localhost:3000

## Prerequisites

### 1. Install All Dependencies (First Time Only)

```bash
npm run install:all
```

This installs:
- Root dependencies (concurrently)
- Server dependencies
- Client dependencies

### 2. Setup Database (First Time Only)

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
cd ..
```

### 3. Create Environment Files

**Server** (`server/.env`):
```env
DATABASE_URL="file:./dev.db"
PORT=5000
ADMIN_KEY=sanjay2508
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_PHONE=+91xxxxxxxxxx
ADMIN_EMAIL=admin@shop.com
```

**Client** (`client/.env` - Optional):
```env
VITE_UPI_ID=your-upi-id@paytm
```

## Running Commands

### Start Both Servers
```bash
npm run dev
```

### Start Only Backend
```bash
npm run dev:server
```

### Start Only Frontend
```bash
npm run dev:client
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### Error: "concurrently not found"
```bash
npm install
```

### Error: "Cannot find module"
Make sure you ran `npm run install:all` first.

### Port Already in Use
- Change `PORT=5000` in `server/.env` for backend
- Change port in `client/vite.config.js` for frontend

### Database Errors
```bash
cd server
npm run prisma:migrate
```

## What Happens When You Run `npm run dev`

1. Starts Express server on port 5000
2. Starts Vite dev server on port 3000
3. Both run concurrently in the same terminal
4. You'll see logs from both servers

## Stopping the Servers

Press `Ctrl + C` in the terminal to stop both servers.




