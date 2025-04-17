const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Post = require('../models/Post');

// 創建導師貼文
router.post('/tutor', auth, async (req, res) => {
  try {
    const {
      title,
      subjects,
      locations,
      fee,
      experience,
      education,
      description,
      genderPreference
    } = req.body;

    // 驗證必填欄位
    if (!title || !subjects || !locations || !fee || !experience || !education || !description) {
      return res.status(400).json({ message: '請填寫所有必填欄位' });
    }

    const post = new Post({
      tutor: req.user.id,
      title,
      subjects,
      locations,
      fee,
      experience,
      education,
      description,
      genderPreference: genderPreference || 'any'
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: '創建貼文失敗' });
  }
});

// 獲取貼文列表（支援搜尋和篩選）
router.get('/', async (req, res) => {
  try {
    const {
      location,
      subject,
      genderPreference,
      verified,
      status = 'active',
      sort = '-createdAt',
      limit = 10,
      page = 1
    } = req.query;

    const query = { status: 'active' };
    if (location) query.locations = location;
    if (subject) query.subjects = subject;
    if (genderPreference) query.genderPreference = genderPreference;
    if (verified !== undefined) query.verified = verified === 'true';

    const posts = await Post.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('tutor', 'name email phone');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: '獲取貼文列表失敗' });
  }
});

// 獲取單個貼文詳情
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('tutor', 'name email phone');
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '獲取貼文詳情失敗' });
  }
});

// 更新貼文
router.patch('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }

    if (post.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: '無權限修改此貼文' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: '更新貼文失敗' });
  }
});

// 刪除貼文
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }

    if (post.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: '無權限刪除此貼文' });
    }

    await post.remove();
    res.json({ message: '貼文已刪除' });
  } catch (err) {
    res.status(500).json({ message: '刪除貼文失敗' });
  }
});

// 管理員審核貼文
router.patch('/:id/verify', adminAuth, async (req, res) => {
  try {
    const { verified, status, adLevel } = req.body;
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          verified,
          status,
          adLevel
        }
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: '貼文不存在' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: '更新貼文狀態失敗' });
  }
});

module.exports = router; 