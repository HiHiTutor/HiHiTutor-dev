const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  PACKAGES,
  createStripePaymentIntent,
  createOrder,
  updateOrderStatus,
  getOrderById,
  getUserOrders
} = require('../services/paymentService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Get available packages
router.get('/packages', (req, res) => {
  res.json({ packages: PACKAGES });
});

// Create new order
router.post('/orders', auth, async (req, res) => {
  try {
    const { type, package: packageName, paymentMethod } = req.body;
    const order = await createOrder(req.user._id, type, packageName, paymentMethod);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's orders
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await getUserOrders(req.user._id);
    res.json({ orders });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order by ID
router.get('/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { type, package: packageName, paymentMethod } = req.body;
    
    // Create order
    const order = await createOrder(
      req.user._id,
      type,
      packageName,
      paymentMethod
    );

    // Create payment intent
    const paymentIntent = await createStripePaymentIntent(order);

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { packageName, amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'twd',
      metadata: {
        userId: req.user.id,
        packageName
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Update user's subscription status
      const userId = paymentIntent.metadata.userId;
      const packageName = paymentIntent.metadata.packageName;
      
      // Calculate expiration date based on package duration
      const duration = packageName === 'basic' ? 30 : packageName === 'premium' ? 90 : 180;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + duration);

      await User.findByIdAndUpdate(userId, {
        subscriptionStatus: 'active',
        subscriptionPackage: packageName,
        subscriptionExpiresAt: expirationDate
      });

      console.log(`Updated subscription for user ${userId}`);
    } catch (error) {
      console.error('Error updating user subscription:', error);
    }
  }

  res.json({ received: true });
});

// Get user's subscription status
router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscriptionStatus subscriptionPackage subscriptionExpiresAt');
    res.json(user);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Error fetching subscription status' });
  }
});

// Admin: Get all orders
router.get('/admin/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 