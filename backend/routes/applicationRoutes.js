const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Case = require('../models/Case');
const auth = require('../middleware/auth');
const { checkSubscription } = require('../middleware/checkSubscription');

// Get all applications for a case
router.get('/case/:caseId', auth, async (req, res) => {
  try {
    const targetCase = await Case.findById(req.params.caseId);
    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Only case owner can view applications
    if (targetCase.student.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view applications' });
    }

    const applications = await Application.find({ case: req.params.caseId })
      .populate('tutor', 'name email profile')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new application
router.post('/', auth, checkSubscription('applications'), async (req, res) => {
  try {
    const targetCase = await Case.findById(req.body.caseId);
    if (!targetCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      case: req.body.caseId,
      tutor: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this case' });
    }

    const application = new Application({
      case: req.body.caseId,
      tutor: req.user.id,
      message: req.body.message,
      features: {
        priority: req.subscription.features.prioritySupport || false
      }
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's applications (as tutor)
router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ tutor: req.user.id })
      .populate('case')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific application
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('case')
      .populate('tutor', 'name email profile');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Only the applicant or case owner can view the application
    const targetCase = await Case.findById(application.case);
    if (application.tutor.toString() !== req.user.id && 
        targetCase.student.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status (accept/reject)
router.patch('/:id', auth, async (req, res) => {
  const allowedUpdates = ['status'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Only case owner can update application status
    const targetCase = await Case.findById(application.case);
    if (targetCase.student.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    updates.forEach(update => application[update] = req.body[update]);
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      tutor: req.user.id
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await application.remove();
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 