import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post('/api/subscriptions/subscribe', {
        planId: plan.id,
        paymentMethodId: paymentMethod.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret);
      
      if (confirmError) {
        setError(confirmError.message);
      } else {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Subscribe to ${plan.name}`}
      </button>
    </form>
  );
};

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansResponse, subscriptionResponse] = await Promise.all([
          axios.get('/api/subscriptions/plans', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/subscriptions/current', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPlans(plansResponse.data);
        setCurrentSubscription(subscriptionResponse.data);
      } catch (error) {
        setError(error.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCancel = async () => {
    try {
      await axios.post('/api/subscriptions/cancel', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { data } = await axios.get('/api/subscriptions/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSubscription(data);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleReactivate = async () => {
    try {
      await axios.post('/api/subscriptions/reactivate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { data } = await axios.get('/api/subscriptions/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSubscription(data);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleSubscriptionSuccess = async () => {
    const { data } = await axios.get('/api/subscriptions/current', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCurrentSubscription(data);
    setSelectedPlan(null);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {currentSubscription ? (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
          <div className="space-y-2">
            <p>Plan: {plans.find(p => p.id === currentSubscription.planId)?.name}</p>
            <p>Status: {currentSubscription.status}</p>
            <p>Expires: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</p>
            {currentSubscription.status === 'active' && (
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            )}
            {currentSubscription.status === 'canceling' && (
              <button
                onClick={handleReactivate}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Reactivate Subscription
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white shadow rounded-lg p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold mb-4">${plan.price}/month</p>
              <ul className="mb-6 flex-grow">
                {Object.entries(plan.features).map(([key, value]) => (
                  <li key={key} className="flex items-center mb-2">
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
                    {key}: {value}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Subscribe to {selectedPlan.name}
            </h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                plan={selectedPlan}
                onSuccess={handleSubscriptionSuccess}
              />
            </Elements>
            <button
              onClick={() => setSelectedPlan(null)}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement; 