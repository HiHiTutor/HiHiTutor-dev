import axios from 'axios';

// 創建 Axios 實例
const instance = axios.create({
  baseURL: 'https://hihitutor-dev-backend.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 請求重試配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 秒

// 請求攔截器
instance.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 響應攔截器
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授權，清除 token 並跳轉到登入頁
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('權限不足');
          break;
        case 404:
          console.error('資源不存在');
          break;
        case 500:
          console.error('服務器錯誤');
          break;
        default:
          console.error('未知錯誤');
      }
    } else if (error.request) {
      console.error('網絡錯誤，請檢查網絡連接');
    } else {
      console.error('請求配置錯誤');
    }
    return Promise.reject(error);
  }
);

export default instance; 