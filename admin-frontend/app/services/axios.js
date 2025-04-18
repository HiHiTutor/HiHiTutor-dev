import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://hihitutor-dev-backend.onrender.com/api/admin',
  timeout: 10000,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  retry: 3,
  retryDelay: 1000
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
      return Promise.reject(error);
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Permission denied');
      return Promise.reject(new Error('您沒有權限執行此操作'));
    }

    if (error.response?.status === 404) {
      console.error('Resource not found');
      return Promise.reject(new Error('找不到資源'));
    }

    if (error.response?.status === 500) {
      console.error('Server error');
      return Promise.reject(new Error('伺服器錯誤，請稍後再試'));
    }

    if (!error.response) {
      console.error('Network error');
      return Promise.reject(new Error('網路錯誤，請檢查您的網路連線'));
    }

    return Promise.reject(error);
  }
); 