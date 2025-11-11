# Quick Start Guide

## 🚀 UPI Payment Setup

### Step 1: Get Your UPI ID

Your UPI ID is usually in one of these formats:
- `yourname@paytm` (Paytm)
- `yourname@ybl` (PhonePe)
- `yourname@okaxis` (GPay)
- `yourname@payu` (BHIM)

**How to find it:**
1. Open your UPI app (GPay, PhonePe, Paytm, etc.)
2. Go to your profile
3. Look for "UPI ID" or "Payment Address"
4. Copy it (e.g., `sanjay2508@paytm`)

### Step 2: Set UPI ID in Environment

**For Development:**
Create `client/.env`:
```env
VITE_UPI_ID=your-upi-id@paytm
```

**For Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - Key: `VITE_UPI_ID`
   - Value: `your-upi-id@paytm`
3. Redeploy

### Step 3: Test UPI Payment

1. Start your app: `npm run dev`
2. Add items to cart
3. Go to checkout
4. Select "UPI / GPay / PhonePe"
5. QR code should appear with your UPI ID
6. Scan with any UPI app to test

## 📦 Install QR Code Library

Run this command to install the QR code library:

```bash
cd client
npm install
```

This will install `qrcode.react` which is needed for UPI QR codes.

## 🌐 Deployment Checklist

### Before Deploying:

1. ✅ Install QR code library: `cd client && npm install`
2. ✅ Set your UPI ID in environment variables
3. ✅ Test UPI QR code locally
4. ✅ Update Prisma schema for PostgreSQL (see DEPLOYMENT.md)

### Deployment Steps:

1. **Backend**: Deploy to Render/Railway (see DEPLOYMENT.md)
2. **Frontend**: Deploy to Vercel (see DEPLOYMENT.md)
3. **Set Environment Variables**:
   - Backend: `DATABASE_URL`, `ADMIN_KEY`, `FRONTEND_URL`
   - Frontend: `VITE_API_URL`, `VITE_UPI_ID`

## 🔧 Troubleshooting

### QR Code Not Showing?
- Check `VITE_UPI_ID` is set in `.env` file
- Make sure you've installed dependencies: `cd client && npm install`
- Restart dev server after adding `.env` file

### UPI Payment Not Working?
- Verify your UPI ID format is correct
- Test the QR code with your UPI app
- Check browser console for errors

### Deployment Issues?
- See `DEPLOYMENT.md` for detailed instructions
- Make sure all environment variables are set
- Check server logs in Render/Railway dashboard

## 📝 Notes

- UPI QR codes work with all UPI apps (GPay, PhonePe, Paytm, BHIM, etc.)
- Customers scan the QR code and pay directly
- After payment, they click "Place Order" to confirm
- You can mark orders as "PAID" in the admin dashboard when payment is received


