const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const fileAccess = require('../middleware/fileAccess');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/verification');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload verification document
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    const { type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    user.verificationDocuments.push({
      type,
      path: file.path,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });

    await user.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Document upload failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get verification document
router.get('/:fileId', auth, fileAccess, async (req, res) => {
  try {
    const { fileId } = req.params;
    const user = await User.findOne({ 'verificationDocuments._id': fileId });
    const document = user.verificationDocuments.id(fileId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.sendFile(path.resolve(document.path));
  } catch (error) {
    console.error('Document retrieval failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: Get all verification documents
router.get('/admin/documents', adminAuth, async (req, res) => {
  try {
    const users = await User.find({
      role: 'tutor',
      'verificationDocuments.0': { $exists: true }
    }).select('name email verificationDocuments');

    res.json(users);
  } catch (error) {
    console.error('Document list retrieval failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: Verify document
router.post('/admin/verify/:fileId', adminAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { status, note } = req.body;

    const user = await User.findOne({ 'verificationDocuments._id': fileId });
    if (!user) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = user.verificationDocuments.id(fileId);
    document.status = status;
    document.verifiedAt = Date.now();
    document.verifiedBy = req.user._id;
    document.note = note;

    await user.save();
    res.json({ message: 'Document verification status updated' });
  } catch (error) {
    console.error('Document verification failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete verification document
router.delete('/:fileId', auth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const user = await User.findById(req.user._id);
    const document = user.verificationDocuments.id(fileId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from storage
    await fs.unlink(document.path);

    // Remove document reference from user
    document.remove();
    await user.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Document deletion failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 