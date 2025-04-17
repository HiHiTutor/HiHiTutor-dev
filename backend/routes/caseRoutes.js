const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Case = require('../models/Case');
const Application = require('../models/Application');
const { createNotification } = require('../services/notificationService');

// Get all cases
router.get('/', async (req, res) => {
  try {
    const { verified } = req.query;
    const query = verified === 'true' ? { verified: true } : {};
    const cases = await Case.find(query).populate('student', 'name email');
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
router.post('/', auth, async (req, res) => {
  try {
    const { title, subject, location, fee, requirements, schedule, contact } = req.body;
    if (!title || !subject || !location || !fee || !requirements || !schedule || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCase = new Case({
      title,
      subject,
      location,
      fee,
      requirements,
      schedule,
      contact,
      student: req.user._id
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = router; 