import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PaymentSuccess = () => {
  const location = useLocation();
  const { package: selectedPackage, paymentId } = location.state || {};

  if (!selectedPackage || !paymentId) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invalid Payment Information</h2>
          <p className="text-gray-600 mb-4">We couldn't find the payment details. Please contact support if you believe this is an error.</p>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium">{selectedPackage.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">NT${selectedPackage.price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{selectedPackage.duration} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment ID:</span>
            <span className="font-medium text-sm">{paymentId}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Return to Dashboard
          </Link>
          <Link
            to="/ads"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200"
          >
            View Your Advertisements
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 