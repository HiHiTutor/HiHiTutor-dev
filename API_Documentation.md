# HiHiTutor API 文檔

## 目錄
1. [管理員 API](#管理員-api)
2. [用戶 API](#用戶-api)
3. [案例 API](#案例-api)
4. [申請 API](#申請-api)
5. [訂閱 API](#訂閱-api)
6. [支付 API](#支付-api)
7. [驗證 API](#驗證-api)
8. [通知 API](#通知-api)
9. [廣告 API](#廣告-api)
10. [簡訊 API](#簡訊-api)

## 通用說明

### 認證要求
- 大部分 API 需要認證
- 認證方式：Bearer Token
- 在請求頭中加入：`Authorization: Bearer <token>`

### 響應格式
#### 成功響應
```json
{
  "status": "success",
  "data": { ... }
}
```

#### 錯誤響應
```json
{
  "status": "error",
  "message": "錯誤信息"
}
```

## 管理員 API

### 獲取儀表板數據
```
GET /api/admin/dashboard
```
- 功能：獲取儀表板統計數據
- 返回：用戶、案例、廣告的統計數據

### 獲取廣告列表
```
GET /api/admin/advertisements
```
- 功能：獲取所有廣告列表
- 返回：廣告列表

### 獲取統計數據
```
GET /api/admin/stats
```
- 功能：獲取統計數據
- 返回：詳細統計信息

### 獲取用戶列表
```
GET /api/admin/users
```
- 功能：獲取所有用戶列表
- 返回：用戶列表

## 用戶 API

### 註冊
```
POST /api/users/register
```
- 功能：註冊新用戶
- Body:
```json
{
  "phone": "string",
  "password": "string",
  "name": "string",
  "role": "tutor|student"
}
```

### 登錄
```
POST /api/users/login
```
- 功能：用戶登錄
- Body:
```json
{
  "phone": "string",
  "password": "string"
}
```

### 獲取個人資料
```
GET /api/users/profile
```
- 功能：獲取用戶個人資料
- 需要認證

### 更新個人資料
```
PATCH /api/users/profile
```
- 功能：更新用戶個人資料
- Body:
```json
{
  "name": "string",
  "email": "string",
  "bio": "string"
}
```

## 案例 API

### 獲取案例列表
```
GET /api/cases
```
- 功能：獲取案例列表
- Query:
```json
{
  "status": "pending|active|completed",
  "page": number,
  "limit": number
}
```

### 創建案例
```
POST /api/cases
```
- 功能：創建新案例
- Body:
```json
{
  "title": "string",
  "description": "string",
  "subject": "string",
  "budget": number,
  "location": "string"
}
```

### 獲取案例詳情
```
GET /api/cases/:id
```
- 功能：獲取特定案例詳情
- 需要認證

### 更新案例
```
PATCH /api/cases/:id
```
- 功能：更新案例
- Body:
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|active|completed"
}
```

## 申請 API

### 申請案例
```
POST /api/applications
```
- 功能：申請案例
- Body:
```json
{
  "caseId": "string",
  "message": "string"
}
```

### 更新申請狀態
```
PATCH /api/applications/:id/status
```
- 功能：更新申請狀態
- Body:
```json
{
  "status": "pending|accepted|rejected"
}
```

## 訂閱 API

### 獲取訂閱套餐
```
GET /api/subscriptions/packages
```
- 功能：獲取訂閱套餐列表

### 創建訂單
```
POST /api/subscriptions/orders
```
- 功能：創建訂單
- Body:
```json
{
  "packageId": "string"
}
```

## 支付 API

### 創建支付意圖
```
POST /api/payments/create-payment-intent
```
- 功能：創建支付意圖
- Body:
```json
{
  "orderId": "string"
}
```

### 支付 Webhook
```
POST /api/payments/webhook
```
- 功能：處理支付 webhook
- Body: Stripe webhook 事件

## 驗證 API

### 上傳驗證文件
```
POST /api/verifications/upload
```
- 功能：上傳驗證文件
- Body: FormData
```json
{
  "file": File,
  "type": "id|certificate|other"
}
```

### 獲取驗證文件
```
GET /api/verifications/:fileId
```
- 功能：獲取驗證文件

### 刪除驗證文件
```
DELETE /api/verifications/:fileId
```
- 功能：刪除驗證文件

## 通知 API

### 獲取通知列表
```
GET /api/notifications
```
- 功能：獲取用戶通知列表

### 獲取未讀通知數量
```
GET /api/notifications/unread/count
```
- 功能：獲取未讀通知數量

### 標記通知為已讀
```
PATCH /api/notifications/:id/read
```
- 功能：標記通知為已讀

## 廣告 API

### 獲取廣告列表
```
GET /api/ads
```
- 功能：獲取廣告列表

### 創建廣告
```
POST /api/ads
```
- 功能：創建廣告
- Body:
```json
{
  "title": "string",
  "content": "string",
  "position": "string",
  "startDate": Date,
  "endDate": Date
}
```

### 更新廣告
```
PATCH /api/ads/:id
```
- 功能：更新廣告
- Body:
```json
{
  "title": "string",
  "content": "string",
  "status": "active|inactive"
}
```

## 簡訊 API

### 發送驗證碼
```
POST /api/sms/send
```
- 功能：發送驗證碼
- Body:
```json
{
  "phone": "string"
}
```

### 驗證簡訊驗證碼
```
POST /api/sms/verify
```
- 功能：驗證簡訊驗證碼
- Body:
```json
{
  "phone": "string",
  "code": "string"
}
``` 