import axios from 'axios';

// 創建 axios 實例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：添加 token 到請求頭
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 處理 401 未授權錯誤
    if (error.response && error.response.status === 401) {
      // 可以選擇在這裡清除本地存儲的認證資訊
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const testConnection = () => api.get('/');

export default api; 