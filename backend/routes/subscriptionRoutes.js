const express = require('express');
const router = express.Router();
const subscriptionService = require('../services/subscriptionService');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Get available subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await subscriptionService.getPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new subscription
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    if (!planId || !paymentMethodId) {
      return res.status(400).json({ error: 'Plan ID and payment method are required' });
    }

    const result = await subscriptionService.createSubscription(
      req.user.id,
      planId,
      paymentMethodId
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current subscription
router.get('/current', auth, async (req, res) => {
  try {
    const subscription = await subscriptionService.getCurrentSubscription(req.user.id);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const result = await subscriptionService.cancelSubscription(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reactivate subscription
router.post('/reactivate', auth, async (req, res) => {
  try {
    const result = await subscriptionService.reactivateSubscription(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await subscriptionService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 