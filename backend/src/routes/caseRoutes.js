const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Case = require('../models/Case');
const Application = require('../models/Application');
const { createNotification } = require('../services/notificationService');
const { checkSubscription, checkFeature } = require('../middleware/checkSubscription');

// Get all cases (with filters)
router.get('/', async (req, res) => {
  try {
    const match = { status: 'active' };
    const sort = {};

    if (req.query.subject) {
      match.subject = req.query.subject;
    }
    if (req.query.location) {
      match.location = req.query.location;
    }
    if (req.query.minFee) {
      match.fee = { $gte: Number(req.query.minFee) };
    }
    if (req.query.maxFee) {
      match.fee = { ...match.fee, $lte: Number(req.query.maxFee) };
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const cases = await Case.find(match)
      .populate('student', 'name')
      .sort(sort)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip));

    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get case details with contact info (only for approved applications)
router.get('/:id', auth, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id).populate('student', 'name email');
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check if user has an approved application
    const application = await Application.findOne({
      case: req.params.id,
      tutor: req.user._id,
      status: 'approved'
    });

    // If user is not the student and doesn't have an approved application, hide contact info
    if (caseItem.student._id.toString() !== req.user._id.toString() && !application) {
      const { contact, ...caseWithoutContact } = caseItem.toObject();
      return res.json(caseWithoutContact);
    }

    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cases applied by tutor
router.get('/applied', auth, async (req, res) => {
  try {
    const applications = await Application.find({ tutor: req.user._id })
      .populate('case')
      .populate('tutor', 'name email');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new case
router.post('/', auth, checkSubscription('cases'), async (req, res) => {
  try {
    const newCase = new Case({
      ...req.body,
      student: req.user.id,
      features: {
        priority: req.subscription.features.prioritySupport || false
      }
    });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Apply for case
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    if (!caseItem.verified) {
      return res.status(400).json({ message: 'Case is not verified yet' });
    }

    const existingApplication = await Application.findOne({
      case: req.params.id,
      tutor: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this case' });
    }

    const application = new Application({
      case: req.params.id,
      tutor: req.user._id,
      status: 'pending',
      message: req.body.message
    });

    await application.save();

    // Create notification for student
    await createNotification(
      caseItem.student,
      'CASE_APPLICATION',
      'New Case Application',
      `A tutor has applied for your case: ${caseItem.title}`,
      application._id,
      'Application'
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (student only)
router.patch('/applications/:id/status', auth, async (req, res) => {
  try {
    const { status, message } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('case')
      .populate('tutor', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify that the current user is the case owner
    if (application.case.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    application.message = message;
    await application.save();

    // Create notification for tutor
    await createNotification(
      application.tutor._id,
      'APPLICATION_STATUS',
      'Application Status Updated',
      `Your application for case "${application.case.title}" has been ${status}`,
      application._id,
      'Application'
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update case verification status (admin only)
router.patch('/:id/verify', adminAuth, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    caseItem.verified = !caseItem.verified;
    await caseItem.save();

    // Create notification for student
    await createNotification(
      caseItem.student,
      'CASE_APPROVAL',
      'Case Status Updated',
      `Your case "${caseItem.title}" has been ${caseItem.verified ? 'verified' : 'unverified'}`,
      caseItem._id,
      'Case'
    );

    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's cases
router.get('/my', auth, async (req, res) => {
  try {
    const cases = await Case.find({ student: req.user.id })
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get case analytics
router.get('/analytics', auth, checkFeature('analytics'), async (req, res) => {
  try {
    const cases = await Case.find({ student: req.user.id });
    const analytics = {
      total: cases.length,
      active: cases.filter(c => c.status === 'active').length,
      completed: cases.filter(c => c.status === 'completed').length,
      averageFee: cases.reduce((acc, c) => acc + c.fee, 0) / cases.length || 0,
      bySubject: cases.reduce((acc, c) => {
        acc[c.subject] = (acc[c.subject] || 0) + 1;
        return acc;
      }, {}),
      byLocation: cases.reduce((acc, c) => {
        acc[c.location] = (acc[c.location] || 0) + 1;
        return acc;
      }, {})
    };
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update case
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'subject', 'fee', 'location', 'requirements', 'schedule', 'status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const targetCase = await Case.findOne({ _id: req.params.id, student: req.user.id });
    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    updates.forEach(update => targetCase[update] = req.body[update]);
    await targetCase.save();
    res.json(targetCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete case
router.delete('/:id', auth, async (req, res) => {
  try {
    const targetCase = await Case.findOneAndDelete({ _id: req.params.id, student: req.user.id });
    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 