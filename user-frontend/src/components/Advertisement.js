import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Advertisement = ({ position }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get(`/api/advertisements/active/${position}`);
        if (response.data.length > 0) {
          // Randomly select one advertisement from the available ones
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setAd(response.data[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [position]);

  const handleClick = async () => {
    if (ad) {
      try {
        await axios.post(`/api/advertisements/${ad._id}/click`);
        window.open(ad.link, '_blank');
      } catch (error) {
        console.error('Error tracking click:', error);
        window.open(ad.link, '_blank');
      }
    }
  };

  if (loading || !ad) return null;

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transition-transform hover:scale-105"
    >
      <img
        src={ad.imageUrl}
        alt={ad.title}
        className="w-full h-auto rounded-lg shadow-md"
      />
    </div>
  );
};

export default Advertisement; 