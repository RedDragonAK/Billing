# Troubleshoot Render API Not Working

## Common Issues and Solutions

### Issue 1: Database Connection Error
**Problem**: SQLite doesn't work on Render (file system not persistent)
**Solution**: Use PostgreSQL

### Issue 2: Server Not Starting
**Problem**: Server crashes on startup
**Solution**: Check server logs in Render Dashboard

### Issue 3: Missing Environment Variables
**Problem**: DATABASE_URL not set
**Solution**: Set DATABASE_URL in Render environment variables

### Issue 4: Prisma Client Not Generated
**Problem**: Prisma Client not generated during build
**Solution**: Build command should include `npm run prisma:generate`

## Step-by-Step Troubleshooting

### Step 1: Check Server Logs
1. Go to Render Dashboard → billing-vgih
2. Click "Logs" tab
3. Check for errors
4. Common errors:
   - "Can't reach database server"
   - "Prisma Client not generated"
   - "Environment variable not found: DATABASE_URL"

### Step 2: Check Environment Variables
1. Go to Render Dashboard → billing-vgih → Environment
2. Verify these are set:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `ADMIN_KEY` - sanjay2508
   - `NODE_ENV` - production
   - `PORT` - (auto-set by Render)

### Step 3: Check Database Connection
**If using SQLite (not recommended for production):**
- SQLite won't work on Render (file system not persistent)
- You need PostgreSQL

**If using PostgreSQL:**
- Check if DATABASE_URL is correct
- Format: `postgresql://user:password@host:port/database?sslmode=require`
- Test connection in Supabase/Neon dashboard

### Step 4: Check Build Command
1. Go to Render Dashboard → billing-vgih → Settings
2. Verify Build Command:
   ```bash
   npm install && npm run build
   ```
   OR
   ```bash
   npm install
   ```
3. Verify Start Command:
   ```bash
   npm start
   ```

### Step 5: Check Prisma Schema
Make sure `server/prisma/schema.prisma` has:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**NOT:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Step 6: Manual Deploy with Clean Build
1. Go to Render Dashboard → billing-vgih → Manual Deploy
2. Click "Clear build cache & deploy"
3. Wait for deployment
4. Check logs again

## Quick Fix: Switch to PostgreSQL

### Option 1: Use Supabase (Free)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (URI format)
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require`
6. Add to Render → Environment → DATABASE_URL

### Option 2: Use Neon (Free)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Format: `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`
5. Add to Render → Environment → DATABASE_URL

### Option 3: Temporarily Use SQLite (Not Recommended)
If you want to test without PostgreSQL:
1. Update `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```
2. Commit and push
3. This will NOT work on Render (file system not persistent)
4. Use PostgreSQL for production

## Update Prisma Schema for PostgreSQL

1. Edit `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Commit and push:
   ```bash
   git add .
   git commit -m "Switch to PostgreSQL for production"
   git push
   ```

3. Update Render Environment:
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Make sure it starts with `postgresql://` or `postgres://`

4. Redeploy:
   - Go to Manual Deploy
   - Click "Clear build cache & deploy"

## Check Server Status

1. Go to Render Dashboard → billing-vgih
2. Check "Status" - should be "Live"
3. Check "Logs" - should show "Server running on http://localhost:5000"
4. If status is "Build Failed" or "Deploy Failed", check logs

## Test API Endpoint

1. Open: https://billing-vgih.onrender.com/api/menu
2. Should return JSON with menu items
3. If it returns error, check:
   - Server logs
   - Environment variables
   - Database connection
   - Build logs

## Next Steps

1. Check Render logs first
2. Share the error message you see
3. Verify DATABASE_URL is set correctly
4. Make sure Prisma schema uses PostgreSQL
5. Redeploy with clean build


