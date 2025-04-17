# HiHiTutor Admin Frontend

這是 HiHiTutor 的管理後台前端應用程式。

## 功能

- 用戶管理：查看、審核用戶
- 個案管理：查看、審核個案
- 貼文管理：查看、審核導師貼文
- 廣告管理：新增、編輯、刪除廣告
- 統計數據：查看系統使用統計

## 技術棧

- Next.js
- React
- Tailwind CSS

## 開發環境設置

1. 安裝依賴：
   ```bash
   npm install
   ```

2. 創建 `.env.local` 文件並設置環境變數：
   ```
   NEXT_PUBLIC_API_BASE=https://hihitutor-dev-backend.onrender.com
   ```

3. 啟動開發服務器：
   ```bash
   npm run dev
   ```

## 部署

此專案使用 Vercel 進行自動部署。當推送到 main 分支時，Vercel 會自動觸發部署流程。

## API 整合
# Update to trigger Vercel
前端應用程式通過 API 與後端服務進行通信，API 基礎 URL 通過環境變數 `NEXT_PUBLIC_API_BASE` 配置。 
