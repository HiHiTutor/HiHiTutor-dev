import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ package: selectedPackage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          amount: selectedPackage.price,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name', // You might want to get this from user profile
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        // Payment successful
        navigate('/payment-success', {
          state: {
            package: selectedPackage,
            paymentId: result.paymentIntent.id,
          },
        });
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Complete Your Payment</h3>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Package:</span>
          <span className="font-semibold">{selectedPackage.name}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Amount:</span>
          <span className="font-semibold">NT${selectedPackage.price}</span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-semibold">{selectedPackage.duration} days</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border rounded-md p-3">
            <CardElement
              options={{
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
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-2 px-4 rounded-md ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-medium`}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 