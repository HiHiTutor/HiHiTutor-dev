const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
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

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionDeletion(deletedSubscription);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handleSuccessfulPayment(invoice);
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await handleFailedPayment(failedInvoice);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSubscriptionUpdate(subscription) {
  const sub = await Subscription.findOne({ paymentId: subscription.id });
  if (sub) {
    sub.status = subscription.status;
    sub.endDate = new Date(subscription.current_period_end * 1000);
    await sub.save();
  }
}

async function handleSubscriptionDeletion(subscription) {
  const sub = await Subscription.findOne({ paymentId: subscription.id });
  if (sub) {
    sub.status = 'cancelled';
    sub.autoRenew = false;
    await sub.save();
  }
}

async function handleSuccessfulPayment(invoice) {
  const sub = await Subscription.findOne({ paymentId: invoice.subscription });
  if (sub) {
    sub.endDate = new Date(invoice.period_end * 1000);
    await sub.save();
  }
}

async function handleFailedPayment(invoice) {
  const sub = await Subscription.findOne({ paymentId: invoice.subscription });
  if (sub) {
    // Notify user about failed payment
    const user = await User.findById(sub.user);
    // TODO: Implement notification system
    console.log(`Payment failed for user ${user.email}`);
  }
}

module.exports = router; 