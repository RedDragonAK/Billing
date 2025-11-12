# Environment Variables Setup for UPI ID

## Important: For Development

Vite reads environment variables from `.env` file (not `env.production`).

## Steps to Fix:

1. **Create `client/.env` file** (in the `client` folder):
   ```
   VITE_UPI_ID=your-actual-upi-id@paytm
   ```

2. **Make sure the file is named exactly `.env`** (starts with a dot)

3. **Restart the dev server completely**:
   - Stop the server (Ctrl + C)
   - Run `npm run dev` again from root

4. **Check if it's loading**: 
   - Open browser console (F12)
   - The QR code should use your UPI ID

## File Locations:

- **Development**: `client/.env` (this is what Vite reads)
- **Production**: `client/env.production` (used when building for production)

## Example `.env` file:

```env
VITE_UPI_ID=sanjay2508@paytm
```

Replace `sanjay2508@paytm` with your actual UPI ID.

## Troubleshooting:

If it's still not working:
1. Make sure file is in `client` folder (not root)
2. Make sure file is named `.env` (with dot at start)
3. Make sure variable name is `VITE_UPI_ID` (must start with VITE_)
4. Restart dev server completely
5. Clear browser cache (Ctrl + Shift + R)




