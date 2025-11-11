import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Send notification to customer
 */
export async function notifyCustomer(order, notificationType) {
  try {
    let message = '';
    
    if (notificationType === 'ORDER_PLACED') {
      message = `Your order ${order.code} has been placed successfully! Total: ₹${order.totalAmount.toFixed(2)}. Show this receipt at the shop to collect your order.`;
    } else if (notificationType === 'PAYMENT_CONFIRMED') {
      message = `Payment confirmed for order ${order.code}! Your order is ready for pickup. Total paid: ₹${order.totalAmount.toFixed(2)}.`;
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        orderId: order.id,
        type: notificationType,
        recipient: 'CUSTOMER',
        message: message,
        phoneNumber: order.customerPhone || null,
        email: order.customerEmail || null,
        status: 'PENDING'
      }
    });

    // Send SMS if phone number provided
    if (order.customerPhone) {
      await sendSMS(order.customerPhone, message);
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() }
      });
    }

    // Send Email if email provided
    if (order.customerEmail) {
      await sendEmail(order.customerEmail, `Order ${order.code}`, message);
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() }
      });
    }

    return notification;
  } catch (error) {
    console.error('Error notifying customer:', error);
    throw error;
  }
}

/**
 * Send notification to admin
 */
export async function notifyAdmin(order, notificationType) {
  try {
    const adminPhone = process.env.ADMIN_PHONE;
    const adminEmail = process.env.ADMIN_EMAIL;

    let message = '';
    
    if (notificationType === 'ORDER_PLACED') {
      const itemsList = order.items.map(item => 
        `${item.nameSnapshot} (${item.quantity}x)`
      ).join(', ');
      message = `New Order ${order.code}!\nCustomer: ${order.customerName || 'Guest'}\nItems: ${itemsList}\nTotal: ₹${order.totalAmount.toFixed(2)}\nPayment: ${order.paymentMethod}`;
    } else if (notificationType === 'PAYMENT_CONFIRMED') {
      message = `Payment confirmed for order ${order.code}!\nCustomer: ${order.customerName || 'Guest'}\nAmount: ₹${order.totalAmount.toFixed(2)}\nPayment Method: ${order.paymentMethod}`;
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        orderId: order.id,
        type: notificationType,
        recipient: 'ADMIN',
        message: message,
        phoneNumber: adminPhone || null,
        email: adminEmail || null,
        status: 'PENDING'
      }
    });

    // Send SMS to admin if phone number configured
    if (adminPhone) {
      await sendSMS(adminPhone, message);
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() }
      });
    }

    // Send Email to admin if email configured
    if (adminEmail) {
      await sendEmail(adminEmail, `Order ${order.code} - ${notificationType}`, message);
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() }
      });
    }

    return notification;
  } catch (error) {
    console.error('Error notifying admin:', error);
    throw error;
  }
}

/**
 * Send SMS (placeholder - integrate with Twilio, AWS SNS, etc.)
 */
async function sendSMS(phoneNumber, message) {
  // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
  // For now, just log it
  console.log(`[SMS] To: ${phoneNumber}`);
  console.log(`[SMS] Message: ${message}`);
  
  // Example Twilio integration (uncomment and configure):
  /*
  const twilio = require('twilio');
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
  */
  
  return true;
}

/**
 * Send Email (placeholder - integrate with Nodemailer, SendGrid, etc.)
 */
async function sendEmail(email, subject, message) {
  // TODO: Integrate with email service (Nodemailer, SendGrid, etc.)
  // For now, just log it
  console.log(`[EMAIL] To: ${email}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Message: ${message}`);
  
  // Example Nodemailer integration (uncomment and configure):
  /*
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message
  });
  */
  
  return true;
}


