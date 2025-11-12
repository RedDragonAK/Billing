# Deployment Guide

This guide will help you deploy your billing website to production.

## Prerequisites

- GitHub account (for code hosting)
- Vercel account (free) for frontend
- Render/Railway account (free tier available) for backend
- PostgreSQL database (free tier available on Supabase, Neon, or Railway)

## Step 1: Prepare for Production

### 1.1 Update Prisma Schema for PostgreSQL

Edit `server/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 1.2 Create Environment Variables File

Create `client/.env.production`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_UPI_ID=your-shop@paytm
```

**Important**: Replace `your-shop@paytm` with your actual UPI ID (e.g., `sanjay2508@paytm` or `yourname@ybl`)

## Step 2: Deploy Backend (Render/Railway)

### Option A: Deploy to Render

1. **Create PostgreSQL Database**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "PostgreSQL"
   - Create database and copy the **Internal Database URL**

2. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as root directory
   - Build Command: `npm install && npm run prisma:generate && npm run prisma:migrate deploy && npm run prisma:seed`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     DATABASE_URL=<your-postgresql-url>
     PORT=10000
     ADMIN_KEY=sanjay2508
     NODE_ENV=production
     ```

3. **Copy your backend URL** (e.g., `https://billing-server.onrender.com`)

### Option B: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Add PostgreSQL service
4. Add environment variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ADMIN_KEY=sanjay2508
   NODE_ENV=production
   ```
5. Deploy and copy the backend URL

## Step 3: Deploy Frontend (Vercel)

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **Root Directory**: Select `client` folder
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     VITE_UPI_ID=your-shop@paytm
     ```
   - Click "Deploy"

3. **Update API Proxy** (if needed):
   - In `client/vite.config.js`, the proxy is only for development
   - For production, update API calls to use `import.meta.env.VITE_API_URL`

## Step 4: Update Frontend API Calls

Update `client/src/pages/Menu.jsx`, `Checkout.jsx`, `Receipt.jsx`, and `Admin.jsx` to use the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api'
axios.get(`${API_URL}/menu`)
```

Or create a utility file `client/src/utils/api.js`:

```javascript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL
})

export default api
```

Then use `api.get('/menu')` instead of `axios.get('/api/menu')`.

## Step 5: Configure UPI ID

1. Get your UPI ID from your payment app (GPay, PhonePe, Paytm)
2. Format: `yourname@paytm`, `yourname@ybl`, `yourname@okaxis`, etc.
3. Add to Vercel environment variables as `VITE_UPI_ID`

## Step 6: Test Deployment

1. Visit your Vercel frontend URL
2. Test placing an order
3. Test UPI QR code generation
4. Test admin dashboard at `/admin`

## Quick Deployment Checklist

- [ ] Updated Prisma schema to PostgreSQL
- [ ] Created PostgreSQL database
- [ ] Deployed backend (Render/Railway)
- [ ] Set backend environment variables
- [ ] Updated frontend API calls
- [ ] Deployed frontend (Vercel)
- [ ] Set frontend environment variables (API_URL, UPI_ID)
- [ ] Tested order placement
- [ ] Tested UPI QR code
- [ ] Tested admin dashboard

## Troubleshooting

### Backend Issues
- **Database connection error**: Check DATABASE_URL format
- **Migration errors**: Run `prisma migrate deploy` manually
- **CORS errors**: Add frontend URL to CORS in server.js

### Frontend Issues
- **API not working**: Check VITE_API_URL environment variable
- **QR code not showing**: Check VITE_UPI_ID is set correctly
- **Build errors**: Check Node.js version (18+)

### CORS Fix

Update `server/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Add `FRONTEND_URL` to backend environment variables.

## Free Tier Limits

- **Vercel**: Unlimited for personal projects
- **Render**: 750 hours/month free, sleeps after 15min inactivity
- **Railway**: $5 free credit/month
- **Supabase/Neon**: Free PostgreSQL with generous limits

## Support

If you encounter issues:
1. Check server logs in Render/Railway dashboard
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly




