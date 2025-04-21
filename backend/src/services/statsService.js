const User = require('../../models/User');
const Case = require('../../models/Case');
const Advertisement = require('../../models/Advertisement');

async function getDashboardStats() {
  try {
    // 獲取用戶統計
    const totalUsers = await User.countDocuments();
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const verifiedTutors = await User.countDocuments({ role: 'tutor', isVerified: true });

    // 獲取案例統計
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ status: 'pending' });
    const activeCases = await Case.countDocuments({ status: 'active' });

    // 獲取廣告統計
    const totalAds = await Advertisement.countDocuments();
    const activeAds = await Advertisement.countDocuments({ status: 'active' });

    // 獲取最近的案例
    const recentCases = await Case.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    return {
      users: {
        total: totalUsers,
        tutors: totalTutors,
        students: totalStudents,
        verifiedTutors
      },
      cases: {
        total: totalCases,
        pending: pendingCases,
        active: activeCases,
        recent: recentCases.map(c => ({
          id: c._id,
          title: c.title,
          status: c.status,
          createdBy: c.createdBy.name,
          createdAt: c.createdAt
        }))
      },
      ads: {
        total: totalAds,
        active: activeAds
      }
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}

module.exports = {
  getDashboardStats
}; 