const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

const PACKAGES = {
  basic: {
    name: 'Basic Package',
    price: 299,
    duration: 30, // days
    features: [
      'Post up to 3 cases',
      'Basic support',
      'Email notifications'
    ]
  },
  premium: {
    name: 'Premium Package',
    price: 799,
    duration: 90, // days
    features: [
      'Post up to 10 cases',
      'Priority support',
      'Email notifications',
      'Featured listing'
    ]
  },
  enterprise: {
    name: 'Enterprise Package',
    price: 1499,
    duration: 180, // days
    features: [
      'Unlimited case posts',
      '24/7 support',
      'Email notifications',
      'Featured listing',
      'Custom branding'
    ]
  }
};

const createStripePaymentIntent = async (order) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.amount * 100, // Convert to cents
    currency: 'twd',
    metadata: {
      orderId: order._id.toString(),
      type: order.type,
      package: order.package
    }
  });

  return paymentIntent;
};

const createOrder = async (userId, type, packageName, paymentMethod) => {
  const packageDetails = PACKAGES[packageName];
  if (!packageDetails) {
    throw new Error('Invalid package');
  }

  const order = new Order({
    user: userId,
    type,
    package: packageName,
    amount: packageDetails.price,
    paymentMethod,
    metadata: {
      duration: packageDetails.duration,
      features: packageDetails.features
    }
  });

  await order.save();
  return order;
};

const updateOrderStatus = async (orderId, status, paymentId = null) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  if (paymentId) {
    order.paymentId = paymentId;
  }

  await order.save();
  return order;
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId).populate('user');
};

const getUserOrders = async (userId) => {
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user');
};

// Get available packages
const getPackages = () => {
  return PACKAGES;
};

// Get package details
const getPackageDetails = (packageName) => {
  return PACKAGES[packageName];
};

// Create a payment intent
const createPaymentIntent = async (userId, packageName) => {
  const packageDetails = PACKAGES[packageName];
  if (!packageDetails) {
    throw new Error('Invalid package selected');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: packageDetails.price * 100, // Convert to cents
    currency: 'twd',
    metadata: {
      userId,
      packageName
    }
  });

  return paymentIntent;
};

// Update user subscription
const updateUserSubscription = async (userId, packageName) => {
  const packageDetails = PACKAGES[packageName];
  if (!packageDetails) {
    throw new Error('Invalid package selected');
  }

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + packageDetails.duration);

  await User.findByIdAndUpdate(userId, {
    subscriptionStatus: 'active',
    subscriptionPackage: packageName,
    subscriptionExpiresAt: expirationDate
  });
};

// Check subscription status
const checkSubscriptionStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if subscription has expired
  if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
    await User.findByIdAndUpdate(userId, {
      subscriptionStatus: 'expired',
      subscriptionPackage: null
    });
    return {
      status: 'expired',
      package: null,
      expiresAt: null
    };
  }

  return {
    status: user.subscriptionStatus,
    package: user.subscriptionPackage,
    expiresAt: user.subscriptionExpiresAt
  };
};

module.exports = {
  PACKAGES,
  createStripePaymentIntent,
  createOrder,
  updateOrderStatus,
  getOrderById,
  getUserOrders,
  getPackages,
  getPackageDetails,
  createPaymentIntent,
  updateUserSubscription,
  checkSubscriptionStatus
}; 