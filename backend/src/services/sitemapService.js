const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Case = require('../models/Case');
const User = require('../models/User');

const generateSitemap = async (hostname) => {
  try {
    const smStream = new SitemapStream({ hostname });
    const pipeline = smStream.pipe(createGzip());

    // Add static routes
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.8 });
    smStream.write({ url: '/tutors', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/cases', changefreq: 'daily', priority: 0.9 });

    // Add tutor profiles
    const tutors = await User.find({ role: 'tutor', verified: true })
      .select('_id updatedAt');
    
    tutors.forEach(tutor => {
      smStream.write({
        url: `/tutors/${tutor._id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: tutor.updatedAt
      });
    });

    // Add case listings
    const cases = await Case.find({ verified: true })
      .select('_id updatedAt');
    
    cases.forEach(caseItem => {
      smStream.write({
        url: `/cases/${caseItem._id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: caseItem.updatedAt
      });
    });

    smStream.end();

    const data = await streamToPromise(pipeline);
    return data.toString();
  } catch (error) {
    console.error('Sitemap generation failed:', error);
    throw error;
  }
};

module.exports = {
  generateSitemap
}; 