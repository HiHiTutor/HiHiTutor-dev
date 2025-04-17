const express = require('express');
const router = express.Router();
const { isAuthenticated, isTutor } = require('../middleware/auth');
const Case = require('../models/Case');

// 發佈個案
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const newCase = new Case({
      ...req.body,
      createdBy: req.user._id
    });
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 查閱個案詳情
router.get('/:id', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('createdBy', 'name phone')
      .populate('applications.tutor', 'name phone');
    
    if (!caseItem) {
      return res.status(404).json({ message: '個案不存在' });
    }
    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 導師申請個案
router.post('/:id/apply', isAuthenticated, isTutor, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: '個案不存在' });
    }

    // 檢查是否已經申請過
    const existingApplication = caseItem.applications.find(
      app => app.tutor.toString() === req.user._id.toString()
    );
    if (existingApplication) {
      return res.status(400).json({ message: '您已經申請過這個個案' });
    }

    caseItem.applications.push({
      tutor: req.user._id,
      message: req.body.message
    });

    await caseItem.save();
    res.status(201).json(caseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 導師查閱已申請個案
router.get('/applied', isAuthenticated, isTutor, async (req, res) => {
  try {
    const appliedCases = await Case.find({
      'applications.tutor': req.user._id
    }).populate('createdBy', 'name phone');
    res.json(appliedCases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 搜尋個案
router.get('/', async (req, res) => {
  try {
    const {
      subject,
      grade,
      location,
      minSalary,
      maxSalary,
      status
    } = req.query;

    const query = {};

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (location) query.location = location;
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }
    if (status) query.status = status;

    const cases = await Case.find(query)
      .populate('createdBy', 'name phone')
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 