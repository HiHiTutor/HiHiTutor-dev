import axios from 'axios';

// 創建 Axios 實例
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 從 localStorage 獲取 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 如果有 token，添加到請求頭
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 處理 401 未授權錯誤
    if (error.response && error.response.status === 401) {
      // 如果在客戶端，清除 token 並重定向到登入頁面
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }
    
    // 返回錯誤信息
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance; 