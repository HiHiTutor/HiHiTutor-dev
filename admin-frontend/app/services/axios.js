import axios from 'axios';

// 創建 Axios 實例
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 秒超時
  validateStatus: (status) => status >= 200 && status < 300, // 只接受 2xx 的狀態碼
});

// 請求重試配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 秒

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 從 localStorage 獲取 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 如果有 token，添加到請求頭
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加重試計數器
    config.retryCount = 0;
    
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
  async (error) => {
    const config = error.config;
    
    // 處理 401 未授權錯誤
    if (error.response && error.response.status === 401) {
      // 如果在客戶端，清除 token 並重定向到登入頁面
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
      return Promise.reject({ message: '登入已過期，請重新登入' });
    }
    
    // 處理 403 權限錯誤
    if (error.response && error.response.status === 403) {
      return Promise.reject({ message: '您沒有權限執行此操作' });
    }
    
    // 處理 404 錯誤
    if (error.response && error.response.status === 404) {
      return Promise.reject({ message: '請求的資源不存在' });
    }
    
    // 處理 500 錯誤
    if (error.response && error.response.status === 500) {
      return Promise.reject({ message: '伺服器內部錯誤，請稍後再試' });
    }
    
    // 處理網絡錯誤
    if (!error.response) {
      return Promise.reject({ message: '網絡連接失敗，請檢查您的網絡連接' });
    }
    
    // 處理非 JSON 響應
    if (error.response && error.response.data && typeof error.response.data === 'string') {
      return Promise.reject({ message: '伺服器返回了非預期的響應格式' });
    }
    
    // 請求重試邏輯
    if (config && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      
      // 延遲重試
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * config.retryCount));
      
      // 重新發送請求
      return axiosInstance(config);
    }
    
    // 返回錯誤信息
    return Promise.reject(error.response?.data || { message: '請求失敗，請稍後再試' });
  }
);

export default axiosInstance; 