@echo off
echo 正在建立 TestTutor 後端專案結構...

:: 建立主目錄
mkdir D:\testtutor_backend
cd D:\testtutor_backend

:: 建立資料夾結構
mkdir src
cd src
mkdir config controllers middlewares models routes services utils
cd ..

:: 建立 package.json
echo {^
  "name": "testtutor_backend",^
  "version": "1.0.0",^
  "description": "TestTutor 教育配對平台後端",^
  "main": "server.js",^
  "scripts": {^
    "start": "node server.js",^
    "dev": "nodemon server.js"^
  },^
  "dependencies": {^
    "express": "^4.18.2",^
    "mongoose": "^7.0.0",^
    "cors": "^2.8.5",^
    "dotenv": "^16.0.3",^
    "bcryptjs": "^2.4.3",^
    "jsonwebtoken": "^9.0.0",^
    "multer": "^1.4.5-lts.1",^
    "express-validator": "^7.0.1"^
  },^
  "devDependencies": {^
    "nodemon": "^2.0.22"^
  }^
} > package.json

:: 建立 .env
echo PORT=3000> .env
echo MONGODB_URI=mongodb://localhost:27017/testtutor>> .env
echo JWT_SECRET=testtutor_secret_key>> .env
echo JWT_EXPIRES_IN=1d>> .env

:: 建立 .gitignore
echo node_modules/> .gitignore
echo .env>> .gitignore
echo .DS_Store>> .gitignore
echo uploads/>> .gitignore

:: 建立主要檔案
cd src

:: 建立 models
cd models
echo const mongoose = require('mongoose');> User.js
echo const mongoose = require('mongoose');> Case.js
echo const mongoose = require('mongoose');> Profile.js
cd ..

:: 建立 controllers
cd controllers
echo const User = require('../models/User');> userController.js
echo const twilio = require('twilio');> smsController.js
echo const Case = require('../models/Case');> caseController.js
echo const Profile = require('../models/Profile');> profileController.js
echo const User = require('../models/User');> selfUserController.js
cd ..

:: 建立 routes
cd routes
echo const express = require('express');> userRoutes.js
echo const express = require('express');> smsRoutes.js
echo const express = require('express');> caseRoutes.js
echo const express = require('express');> profileRoutes.js
echo const express = require('express');> selfUserRoutes.js
cd ..

:: 建立 middlewares
cd middlewares
echo const jwt = require('jsonwebtoken');> auth.js
echo const multer = require('multer');> upload.js
cd ..

cd ..

:: 建立 server.js
echo const express = require('express');> server.js
echo const cors = require('cors');>> server.js
echo const mongoose = require('mongoose');>> server.js
echo require('dotenv').config();>> server.js

:: 安裝依賴
npm install

echo.
echo 專案結構已建立完成！
echo 請執行 npm install 安裝依賴
echo 然後執行 npm run dev 啟動伺服器
pause