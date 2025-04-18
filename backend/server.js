require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// 引入路由
const userRoutes = require('./src/routes/userRoutes');
const smsRoutes = require('./src/routes/smsRoutes');
const caseRoutes = require('./src/routes/caseRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const adRoutes = require('./src/routes/adRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// 中間件
app.use(cors({
  origin: true, // 允許所有來源
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// 調試中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 設置 EJS 視圖引擎
app.set('view engine', 'ejs');
app.set('views', './src/views');

// 基本路由
app.get('/', (req, res) => {
  console.log('收到根路徑請求');
  res.json({ 
    message: 'Welcome to TestTutor API',
    status: 'running',
    timestamp: new Date()
  });
});

// 使用路由
app.use('/api/users', userRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('錯誤:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    status: 'error',
    message: err.message || '伺服器內部錯誤'
  });
});

// 連接資料庫
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB 連接成功');
  // 啟動伺服器
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB 連接失敗:', err);
  process.exit(1);
});
