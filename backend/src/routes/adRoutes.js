const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Advertisement = require('../models/Advertisement');

// 獲取所有廣告清單
router.get('/', async (req, res) => {
  try {
    const ads = await Advertisement.find()
      .populate('createdBy', 'name')
      .sort({ priority: -1, createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 新增廣告
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const newAd = new Advertisement({
      ...req.body,
      createdBy: req.user._id
    });
    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 修改廣告
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: '廣告不存在' });
    }

    Object.assign(ad, req.body);
    await ad.save();
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 刪除廣告
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: '廣告不存在' });
    }

    await ad.remove();
    res.json({ message: '廣告已刪除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 獲取隨機廣告
router.get('/random', async (req, res) => {
  try {
    const now = new Date();
    const ads = await Advertisement.aggregate([
      {
        $match: {
          status: 'active',
          startDate: { $lte: now },
          endDate: { $gte: now }
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (ads.length === 0) {
      return res.status(404).json({ message: '沒有可用的廣告' });
    }

    res.json(ads[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 