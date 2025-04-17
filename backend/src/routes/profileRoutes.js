const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: '個人資料路由測試成功' });
});

module.exports = router; 