import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useAuth } from '../contexts/AuthContext';

// Initialize GA4
ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);

const Analytics = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Track page views
    ReactGA.send({ hitType: 'pageview', page: location.pathname });

    // Load Facebook Pixel
    if (process.env.REACT_APP_FB_PIXEL_ID) {
      const fbPixel = document.createElement('script');
      fbPixel.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.REACT_APP_FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbPixel);
    }
  }, [location]);

  useEffect(() => {
    // Track user login
    if (user) {
      ReactGA.set({ userId: user._id });
      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'User Registration',
          status: true
        });
      }
    }
  }, [user]);

  return null;
};

// Custom hook for tracking events
export const useAnalytics = () => {
  const trackEvent = (category, action, label = null, value = null) => {
    ReactGA.event({
      category,
      action,
      label,
      value
    });

    if (window.fbq) {
      window.fbq('trackCustom', action, {
        category,
        label,
        value
      });
    }
  };

  return { trackEvent };
};

export default Analytics; 