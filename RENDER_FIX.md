# Fix Render Build Error

## Problem
Render is trying to run `npm run build` but the server doesn't have a build script.

## Solution
I've added a build script to `server/package.json`. Now you need to update Render configuration.

## Steps to Fix:

### 1. Commit and Push the Fix
```bash
git add .
git commit -m "Add build script to server package.json"
git push
```

### 2. Update Render Configuration

Go to Render Dashboard → Your Service → Settings:

**Build Command:**
```bash
npm install && npm run build && npx prisma migrate deploy && node prisma/seed.js
```

**OR (Simpler - Recommended):**
```bash
npm install && npm run prisma:generate && npx prisma migrate deploy && node prisma/seed.js
```

**Start Command:**
```bash
npm start
```

### 3. Alternative: Use Render's Auto-Deploy
If the above doesn't work, try this simpler build command:

**Build Command:**
```bash
npm install
```

**Then add these as separate commands or in a script:**
- Generate Prisma: `npm run prisma:generate`
- Migrate: `npx prisma migrate deploy`
- Seed: `node prisma/seed.js`

**Start Command:**
```bash
npm start
```

### 4. Manual Deploy
After updating the build command:
1. Go to "Manual Deploy" tab
2. Click "Clear build cache & deploy"
3. Wait for deployment

## Recommended Render Configuration:

### Build Command:
```bash
npm install && npm run prisma:generate && npx prisma migrate deploy && node prisma/seed.js
```

### Start Command:
```bash
npm start
```

### Environment Variables:
- `DATABASE_URL` = Your PostgreSQL connection string
- `ADMIN_KEY` = sanjay2508
- `NODE_ENV` = production
- `FRONTEND_URL` = (your Vercel URL - set after frontend deploy)
- `PORT` = (Render sets this automatically)

## What Each Command Does:
1. `npm install` - Installs all dependencies
2. `npm run prisma:generate` - Generates Prisma Client
3. `npx prisma migrate deploy` - Runs database migrations
4. `node prisma/seed.js` - Seeds the database with menu items
5. `npm start` - Starts the server

## Test:
After deployment, test:
- https://billing-vgih.onrender.com/api/menu
- Should return JSON with menu items

