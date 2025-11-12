# Notification System Setup

The billing website now includes a notification system that sends messages to customers and admin when orders are placed or payments are confirmed.

## How It Works

1. **When Order is Placed:**
   - Customer receives notification (if phone/email provided)
   - Admin receives notification about new order

2. **When Payment is Confirmed:**
   - Customer receives payment confirmation
   - Admin receives payment confirmation

## Current Status

Currently, notifications are **logged to console** for testing. To enable actual SMS/Email sending, you need to configure a service provider.

## Setup Instructions

### Option 1: SMS via Twilio (Recommended for India)

1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. Add to `server/.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
5. Install Twilio SDK:
   ```bash
   cd server
   npm install twilio
   ```
6. Uncomment Twilio code in `server/services/notificationService.js`

### Option 2: Email via Nodemailer

1. Install Nodemailer:
   ```bash
   cd server
   npm install nodemailer
   ```
2. For Gmail, create an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. Add to `server/.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```
4. Uncomment Nodemailer code in `server/services/notificationService.js`

### Option 3: WhatsApp via Twilio API

Twilio also supports WhatsApp messaging. Follow Twilio setup and use WhatsApp API instead of SMS.

## Admin Notifications

Set your admin contact info in `server/.env`:
```env
ADMIN_PHONE=+91xxxxxxxxxx
ADMIN_EMAIL=admin@shop.com
```

## Testing

1. Place an order with phone/email
2. Check server console for notification logs
3. Check admin dashboard → Notifications tab
4. Mark order as paid
5. Check notifications again

## Notification Status

- **PENDING**: Notification created but not sent
- **SENT**: Successfully sent
- **FAILED**: Failed to send

All notifications are stored in the database and visible in the admin dashboard.

## Database Migration

After adding the notification model, run:

```bash
cd server
npm run prisma:migrate
```

Enter migration name: `add_notifications`

## Viewing Notifications

1. Go to Admin Dashboard: http://localhost:3000/admin
2. Enter admin key
3. Click "Notifications" tab
4. See all notifications with status




