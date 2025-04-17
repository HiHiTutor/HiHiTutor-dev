const axios = require('axios');

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;

const trackEvent = async (clientId, eventName, params = {}) => {
  try {
    // Google Analytics 4 Event
    await axios.post(
      `${GA_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        client_id: clientId,
        events: [
          {
            name: eventName,
            params: {
              ...params,
              timestamp_micros: Date.now() * 1000
            }
          }
        ]
      }
    );

    // Facebook Pixel Event (if configured)
    if (process.env.FB_PIXEL_ID) {
      // Note: Facebook Pixel events are typically handled client-side
      // This is just a placeholder for server-side tracking if needed
      console.log('Facebook Pixel event:', eventName, params);
    }
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
};

const trackPageView = async (clientId, pagePath, pageTitle) => {
  await trackEvent(clientId, 'page_view', {
    page_path: pagePath,
    page_title: pageTitle
  });
};

const trackTutorApplication = async (clientId, tutorId, caseId) => {
  await trackEvent(clientId, 'tutor_application', {
    tutor_id: tutorId,
    case_id: caseId
  });
};

const trackAdClick = async (clientId, adId, position) => {
  await trackEvent(clientId, 'ad_click', {
    ad_id: adId,
    position: position
  });
};

const trackPayment = async (clientId, orderId, amount, currency) => {
  await trackEvent(clientId, 'purchase', {
    order_id: orderId,
    value: amount,
    currency: currency
  });
};

module.exports = {
  trackEvent,
  trackPageView,
  trackTutorApplication,
  trackAdClick,
  trackPayment
}; 