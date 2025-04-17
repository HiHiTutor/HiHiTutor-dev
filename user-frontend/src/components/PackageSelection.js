import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PackageSelection = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/payments/packages');
      const data = await response.json();
      setPackages(data.packages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load packages');
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageData) => {
    setSelectedPackage(packageData);
  };

  if (loading) return <div className="text-center py-8">Loading packages...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Choose Your Package</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedPackage?.name === pkg.name
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handlePackageSelect(pkg)}
          >
            <h3 className="text-xl font-semibold mb-4">{pkg.name}</h3>
            <p className="text-3xl font-bold mb-4">NT${pkg.price}</p>
            <ul className="space-y-2 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center">
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
              className={`w-full py-2 px-4 rounded-md ${
                selectedPackage?.name === pkg.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedPackage?.name === pkg.name ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="mt-12">
          <Elements stripe={stripePromise}>
            <PaymentForm package={selectedPackage} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default PackageSelection; 