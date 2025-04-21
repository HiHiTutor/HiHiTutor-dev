const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require('../models/User');

class SubscriptionService {
  async getPlans() {
    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring',
      expand: ['data.product']
    });

    return prices.data.map(price => ({
      id: price.id,
      name: price.product.name,
      price: price.unit_amount / 100,
      interval: price.recurring.interval,
      features: price.product.metadata.features ? 
        JSON.parse(price.product.metadata.features) : {}
    }));
  }

  async createSubscription(userId, planId, paymentMethodId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create or get Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    // Create local subscription record
    await Subscription.create({
      user: userId,
      planId,
      paymentId: subscription.id,
      status: 'pending',
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000)
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    };
  }

  async getCurrentSubscription(userId) {
    const subscription = await Subscription.findOne({
      user: userId,
      status: 'active'
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return null;
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.paymentId
    );

    return {
      ...subscription.toObject(),
      stripeStatus: stripeSubscription.status,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
    };
  }

  async cancelSubscription(userId) {
    const subscription = await Subscription.findOne({
      user: userId,
      status: 'active'
    });

    if (!subscription) {
      throw new Error('No active subscription found');
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.update(subscription.paymentId, {
      cancel_at_period_end: true
    });

    subscription.status = 'canceling';
    await subscription.save();

    return { message: 'Subscription will be cancelled at the end of the billing period' };
  }

  async reactivateSubscription(userId) {
    const subscription = await Subscription.findOne({
      user: userId,
      status: 'canceling'
    });

    if (!subscription) {
      throw new Error('No canceling subscription found');
    }

    // Reactivate Stripe subscription
    await stripe.subscriptions.update(subscription.paymentId, {
      cancel_at_period_end: false
    });

    subscription.status = 'active';
    await subscription.save();

    return { message: 'Subscription has been reactivated' };
  }

  async handleWebhook(event) {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        const subscription = await Subscription.findOne({
          paymentId: event.data.object.subscription
        });
        if (subscription) {
          subscription.status = 'active';
          await subscription.save();
        }
        break;

      case 'invoice.payment_failed':
        const failedSubscription = await Subscription.findOne({
          paymentId: event.data.object.subscription
        });
        if (failedSubscription) {
          failedSubscription.status = 'payment_failed';
          await failedSubscription.save();
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = await Subscription.findOne({
          paymentId: event.data.object.id
        });
        if (deletedSubscription) {
          deletedSubscription.status = 'cancelled';
          await deletedSubscription.save();
        }
        break;
    }
  }
}

module.exports = new SubscriptionService(); 