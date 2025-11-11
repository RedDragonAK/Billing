import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { notifyCustomer, notifyAdmin } from './services/notificationService.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Generate unique order code
function generateOrderCode() {
  const prefix = 'SHP-';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomNum;
}

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, paymentMethod, customerName, customerPhone, customerEmail } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (!paymentMethod || !['CASH', 'CARD', 'UPI'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Valid payment method is required' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const item = await prisma.item.findUnique({
        where: { id: cartItem.id }
      });

      if (!item || !item.isAvailable) {
        return res.status(400).json({ error: `Item ${cartItem.name} is not available` });
      }

      const lineTotal = item.price * cartItem.quantity;
      totalAmount += lineTotal;

      orderItems.push({
        itemId: item.id,
        nameSnapshot: item.name,
        priceSnapshot: item.price,
        quantity: cartItem.quantity,
        lineTotal: lineTotal
      });
    }

    // Generate unique order code
    let orderCode;
    let isUnique = false;
    while (!isUnique) {
      orderCode = generateOrderCode();
      const existing = await prisma.order.findUnique({
        where: { code: orderCode }
      });
      if (!existing) isUnique = true;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        code: orderCode,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        paymentMethod: paymentMethod,
        paymentStatus: 'PENDING',
        totalAmount: totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });

    // Send notifications
    try {
      await notifyCustomer(order, 'ORDER_PLACED');
      await notifyAdmin(order, 'ORDER_PLACED');
    } catch (notifError) {
      console.error('Notification error (non-blocking):', notifError);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by code
app.get('/api/orders/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const order = await prisma.order.findUnique({
      where: { code },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders (admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            item: true
          }
        }
      },
      take: 100
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order payment status (admin)
app.patch('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!['PENDING', 'PAID'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });

    // Send payment confirmation notifications
    if (paymentStatus === 'PAID') {
      try {
        await notifyCustomer(order, 'PAYMENT_CONFIRMED');
        await notifyAdmin(order, 'PAYMENT_CONFIRMED');
      } catch (notifError) {
        console.error('Notification error (non-blocking):', notifError);
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

