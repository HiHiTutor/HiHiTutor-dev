import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PackageSelector = ({ type, onSelect }) => {
  const [packages, setPackages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get('/api/payments/packages');
        setPackages(data[type]);
      } catch (err) {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [type]);

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!packages) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(packages).map(([key, pkg]) => (
        <div
          key={key}
          className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onSelect(key)}
        >
          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            NT$ {pkg.price}
            <span className="text-sm text-gray-500">/month</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
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
              Duration: {pkg.duration} days
            </li>
            {type === 'TUTOR_AD' && (
              <>
                <li className="flex items-center">
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
                  {key === 'BASIC' && 'Basic profile listing'}
                  {key === 'PREMIUM' && 'Premium profile with featured placement'}
                  {key === 'PRO' && 'Pro profile with maximum visibility'}
                </li>
              </>
            )}
            {type === 'ADVERTISEMENT' && (
              <>
                <li className="flex items-center">
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
                  {key === 'SMALL' && 'Small banner (300x250)'}
                  {key === 'MEDIUM' && 'Medium banner (728x90)'}
                  {key === 'LARGE' && 'Large banner (970x90)'}
                </li>
              </>
            )}
          </ul>
          <button
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            onClick={() => onSelect(key)}
          >
            Select Package
          </button>
        </div>
      ))}
    </div>
  );
};

export default PackageSelector; 