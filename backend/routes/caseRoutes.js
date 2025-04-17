const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Case = require('../models/Case');
const Application = require('../models/Application');

// 獲取個案列表（可選：只獲取已審核的個案）
router.get('/', async (req, res) => {
  try {
    const { verified } = req.query;
    const query = verified === 'true' ? { verified: true } : {};
    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: '獲取個案列表失敗' });
  }
});

// 獲取已申請的個案
router.get('/applied', auth, async (req, res) => {
  try {
    const applications = await Application.find({ tutor: req.user.id })
      .populate('case')
      .sort({ createdAt: -1 });
    res.json(applications.map(app => app.case));
  } catch (err) {
    res.status(500).json({ message: '獲取已申請個案失敗' });
  }
});

// 創建新個案
router.post('/', auth, async (req, res) => {
  try {
    const { title, subject, location, fee, requirements, schedule, contact } = req.body;
    
    // 驗證必填欄位
    if (!title || !subject || !location || !fee || !requirements || !schedule || !contact) {
      return res.status(400).json({ message: '請填寫所有必填欄位' });
    }

    const newCase = new Case({
      title,
      subject,
      location,
      fee,
      requirements,
      schedule,
      contact,
      student: req.user.id,
      verified: false
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: '創建個案失敗' });
  }
});

// 申請個案
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const caseId = req.params.id;
    
    // 檢查個案是否存在且已審核
    const caseItem = await Case.findById(caseId);
    if (!caseItem) {
      return res.status(404).json({ message: '個案不存在' });
    }
    if (!caseItem.verified) {
      return res.status(400).json({ message: '個案尚未審核' });
    }

    // 檢查是否已經申請過
    const existingApplication = await Application.findOne({
      case: caseId,
      tutor: req.user.id
    });
    if (existingApplication) {
      return res.status(400).json({ message: '您已經申請過這個個案' });
    }

    // 創建申請記錄
    const application = new Application({
      case: caseId,
      tutor: req.user.id
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: '申請個案失敗' });
  }
});

// 更新個案狀態（審核）
router.patch('/:id/status', auth, async (req, res) => {
  try {
    // 檢查是否為管理員
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '無權限執行此操作' });
    }

    const { verified } = req.body;
    const caseItem = await Case.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true }
    );

    if (!caseItem) {
      return res.status(404).json({ message: '個案不存在' });
    }

    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: '更新個案狀態失敗' });
  }
});

module.exports = router; 