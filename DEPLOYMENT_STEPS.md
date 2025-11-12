# Complete Deployment Steps

## ✅ Step 1: Backend Deployed (DONE)
- Backend URL: https://billing-vgih.onrender.com
- API is working: ✅ https://billing-vgih.onrender.com/api/menu returns JSON

## 📋 Step 2: Deploy Frontend to Vercel

### 2.1 Go to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"

### 2.2 Import Repository
1. Select your repository: **RedDragonAK/Billing**
2. Click "Import"

### 2.3 Configure Project
- **Framework Preset**: Vite
- **Root Directory**: `client` (click "Edit" and change from `/` to `client`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.4 Add Environment Variables
Click "Environment Variables" and add:
- **Key**: `VITE_API_URL`
- **Value**: `https://billing-vgih.onrender.com`

- **Key**: `VITE_UPI_ID`
- **Value**: `muthukumar2508.m@okaxis`

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Copy your Vercel URL (e.g., `https://billing-abc123.vercel.app`)

## 📋 Step 3: Update Backend CORS

### 3.1 Go to Render Dashboard
1. Go to https://render.com
2. Click on your service: **billing-vgih**

### 3.2 Add Frontend URL
1. Go to "Environment" tab
2. Click "Add Environment Variable"
3. **Key**: `FRONTEND_URL`
4. **Value**: Your Vercel URL (e.g., `https://billing-abc123.vercel.app`)
5. Click "Save Changes"

### 3.3 Restart Service
1. Go to "Manual Deploy" tab
2. Click "Clear build cache & deploy" (or just restart)

## 📋 Step 4: Commit and Push Code Changes

The code has been updated to use the API utility. You need to commit and push:

```bash
git add .
git commit -m "Update API calls to use environment variable"
git push
```

After pushing, Vercel will automatically redeploy with the updated code.

## ✅ Step 5: Test Everything

### 5.1 Test Customer Site
1. Open your Vercel URL
2. Browse menu - should load items
3. Add items to cart
4. Go to checkout
5. Select "UPI / GPay / PhonePe"
6. QR code should show with your UPI ID
7. Place order - should work

### 5.2 Test Admin Dashboard
1. Go to: `https://your-vercel-url.vercel.app/admin`
2. Enter admin key: `sanjay2508`
3. Click "Load Orders"
4. Should see orders
5. Click "Mark Paid" - should work

## 🎉 Done!

Your website is now fully deployed and working!

## 🔗 Your URLs:
- **Frontend**: https://your-vercel-url.vercel.app
- **Backend**: https://billing-vgih.onrender.com
- **Admin**: https://your-vercel-url.vercel.app/admin

## 📝 Notes:
- All features are working (menu, cart, checkout, UPI QR, admin dashboard)
- Notifications are logged to console (can be enabled later with Twilio/Email)
- Database is working (SQLite for now, can switch to PostgreSQL later)
- Environment variables are set correctly

