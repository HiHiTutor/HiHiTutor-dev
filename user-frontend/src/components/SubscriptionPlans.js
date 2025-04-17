import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ selectedPackage, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      // Create payment intent
      const { data: { clientSecret } } = await axios.post('/api/payments/create-intent', {
        packageName: selectedPackage.name,
        amount: selectedPackage.price
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: user.email
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#9e2146'
              }
            }
          }}
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Subscribe Now'}
      </button>
    </form>
  );
};

const SubscriptionPlans = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get('/api/payments/packages');
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    const fetchSubscription = async () => {
      try {
        const { data } = await axios.get('/api/payments/subscription');
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };

    fetchPackages();
    fetchSubscription();
  }, []);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setSelectedPackage(null);
    // Refresh subscription status
    const { data } = await axios.get('/api/payments/subscription');
    setSubscription(data);
  };

  if (subscription?.status === 'active') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Active Subscription</h2>
          <p>Package: {subscription.package}</p>
          <p>Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4">{pkg.name}</h2>
            <p className="text-3xl font-bold mb-4">NT$ {pkg.price}</p>
            <ul className="mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePackageSelect(pkg)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {showPayment && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Complete Your Subscription</h2>
            <p className="mb-4">
              You selected the {selectedPackage.name} for NT$ {selectedPackage.price}
            </p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                selectedPackage={selectedPackage}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-4 border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans; 