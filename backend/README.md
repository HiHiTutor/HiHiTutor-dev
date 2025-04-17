# TestTutor 後台管理系統

## 項目結構
```
testtutor_backend/
├── src/
│   ├── controllers/     # 控制器
│   ├── middlewares/     # 中間件
│   ├── models/         # 數據模型
│   ├── routes/         # 路由
│   ├── services/       # 服務
│   ├── utils/         # 工具函數
│   ├── views/         # 視圖文件
│   └── scripts/       # 腳本文件
├── .env               # 環境變量
├── .gitignore        # Git 忽略文件
├── package.json      # 項目依賴
└── server.js         # 服務器入口文件
```

## 安裝步驟

1. 安裝依賴：
```bash
npm install
```

2. 配置環境變量：
複製 `.env.example` 到 `.env` 並填寫相應的配置：
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/testtutor
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
```

3. 創建管理員賬戶：
```bash
node src/scripts/createAdmin.js
```
默認管理員賬戶：
- 郵箱：admin@testtutor.com
- 密碼：admin123

4. 啟動服務器：
```bash
node server.js
```

## 功能列表

- 用戶管理
- 導師管理
- 案件管理
- 系統概覽

## API 文檔

### 管理員接口
- POST /admin/login - 管理員登錄
- GET /admin/dashboard - 儀表板
- GET /admin/users - 用戶列表
- GET /admin/cases - 案件列表
- GET /admin/profiles - 導師列表

### 用戶接口
- POST /api/users/register - 用戶註冊
- POST /api/users/login - 用戶登錄
- GET /api/users/profile - 獲取用戶資料

### SMS 接口
- POST /api/sms/send - 發送驗證碼
- POST /api/sms/verify - 驗證驗證碼 