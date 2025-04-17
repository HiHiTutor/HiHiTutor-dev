const User = require('../models/User');
const Case = require('../models/Case');
const Application = require('../models/Application');
const Advertisement = require('../models/Advertisement');

const getStats = async () => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const verifiedTutors = await User.countDocuments({ role: 'tutor', verified: true });

    // Case statistics
    const totalCases = await Case.countDocuments();
    const verifiedCases = await Case.countDocuments({ verified: true });
    const activeCases = await Case.countDocuments({
      verified: true,
      endDate: { $gte: new Date() }
    });

    // Application statistics
    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    // Advertisement statistics
    const totalAds = await Advertisement.countDocuments();
    const activeAds = await Advertisement.countDocuments({ active: true });
    const totalClicks = await Advertisement.aggregate([
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);

    // Monthly statistics
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyStats = {
      newUsers: await User.countDocuments({
        createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
      }),
      newCases: await Case.countDocuments({
        createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
      }),
      newApplications: await Application.countDocuments({
        createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
      }),
      adClicks: await Advertisement.aggregate([
        {
          $match: {
            updatedAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: '$clicks' } } }
      ])
    };

    return {
      users: {
        total: totalUsers,
        students: totalStudents,
        tutors: totalTutors,
        verifiedTutors
      },
      cases: {
        total: totalCases,
        verified: verifiedCases,
        active: activeCases
      },
      applications: {
        total: totalApplications,
        approved: approvedApplications,
        pending: pendingApplications
      },
      advertisements: {
        total: totalAds,
        active: activeAds,
        totalClicks: totalClicks[0]?.total || 0
      },
      monthly: {
        newUsers: monthlyStats.newUsers,
        newCases: monthlyStats.newCases,
        newApplications: monthlyStats.newApplications,
        adClicks: monthlyStats.adClicks[0]?.total || 0
      }
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw error;
  }
};

module.exports = {
  getStats
}; 