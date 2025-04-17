const express = require('express');
const router = express.Router();
const redis = require('redis');
const { promisify } = require('util');

// Redis 客戶端設置
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// 發送驗證碼
router.post('/send', async (req, res) => {
  try {
    const { phone } = req.body;

    // 檢查冷卻時間
    const cooldownKey = `sms:cooldown:${phone}`;
    const cooldown = await getAsync(cooldownKey);
    if (cooldown) {
      const remainingTime = Math.ceil((parseInt(cooldown) - Date.now()) / 1000);
      return res.status(429).json({
        message: '請稍後再試',
        remainingTime
      });
    }

    // 生成驗證碼
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 儲存驗證碼和時間戳
    const verificationKey = `sms:verification:${phone}`;
    await setAsync(verificationKey, JSON.stringify({
      code: verificationCode,
      timestamp: Date.now()
    }), 'EX', 600); // 10分鐘有效期

    // 設置冷卻時間
    await setAsync(cooldownKey, Date.now() + 60000, 'EX', 60); // 60秒冷卻

    // TODO: 整合實際的簡訊發送服務
    console.log(`向 ${phone} 發送驗證碼: ${verificationCode}`);

    res.json({ message: '驗證碼已發送' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 驗證碼比對
router.post('/verify', async (req, res) => {
  try {
    const { phone, code } = req.body;

    // 獲取儲存的驗證碼
    const verificationKey = `sms:verification:${phone}`;
    const storedData = await getAsync(verificationKey);

    if (!storedData) {
      return res.status(400).json({ message: '驗證碼已過期或不存在' });
    }

    const { code: storedCode, timestamp } = JSON.parse(storedData);

    // 檢查驗證碼是否正確
    if (code !== storedCode) {
      return res.status(400).json({ message: '驗證碼錯誤' });
    }

    // 檢查是否在10分鐘有效期內
    const now = Date.now();
    if (now - timestamp > 600000) { // 10分鐘
      await client.del(verificationKey);
      return res.status(400).json({ message: '驗證碼已過期' });
    }

    // 驗證成功，刪除驗證碼
    await client.del(verificationKey);

    res.json({ message: '驗證成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 