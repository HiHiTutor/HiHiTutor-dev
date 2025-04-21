const User = require('../models/User');
const Case = require('../models/Case');
const Application = require('../models/Application');

const fileAccess = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Admin can access all files
    if (userRole === 'admin') {
      return next();
    }

    // Check if the file belongs to a case
    const caseDoc = await Case.findOne({ 'documents._id': fileId });
    if (caseDoc) {
      // Case owner can access their files
      if (caseDoc.student.toString() === userId.toString()) {
        return next();
      }

      // Check if user has an approved application for this case
      const application = await Application.findOne({
        case: caseDoc._id,
        tutor: userId,
        status: 'approved'
      });

      if (application) {
        return next();
      }
    }

    // Check if the file belongs to a tutor's verification documents
    const tutor = await User.findOne({
      'verificationDocuments._id': fileId,
      role: 'tutor'
    });

    if (tutor) {
      // Only the tutor themselves and admins can access verification documents
      if (tutor._id.toString() === userId.toString()) {
        return next();
      }
    }

    // If none of the above conditions are met, deny access
    res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('File access check failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = fileAccess; 