// API 服務
import axios from './axios';

// 通用請求函數
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 從 localStorage 獲取 token
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // 設置默認請求頭
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // 處理 401 未授權錯誤
    if (response.status === 401) {
      // 如果在客戶端，清除 token 並重定向到登入頁面
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
      throw new Error('未授權，請重新登入');
    }
    
    // 解析 JSON 響應
    const data = await response.json();
    
    // 如果響應不成功，拋出錯誤
    if (!response.ok) {
      throw new Error(data.message || '請求失敗');
    }
    
    return data;
  } catch (error) {
    console.error('API 請求錯誤:', error);
    throw error;
  }
}

// 用戶相關 API
export const userAPI = {
  // 獲取用戶列表
  getUsers: () => axios.get('/api/admin/users'),
  
  // 獲取單個用戶詳情
  getUser: (id) => axios.get(`/api/admin/users/${id}`),
  
  // 更新用戶狀態（如審核）
  updateUserStatus: (id, status) => 
    axios.patch(`/api/admin/users/${id}/status`, { status }),
};

// 廣告相關 API
export const adAPI = {
  // 獲取廣告列表
  getAds: () => axios.get('/api/admin/ads'),
  
  // 獲取單個廣告詳情
  getAd: (id) => axios.get(`/api/admin/ads/${id}`),
  
  // 創建新廣告
  createAd: (adData) => 
    axios.post('/api/admin/ads', adData),
  
  // 更新廣告
  updateAd: (id, adData) => 
    axios.put(`/api/admin/ads/${id}`, adData),
  
  // 更新廣告狀態（啟用/停用）
  updateAdStatus: (id, active) => 
    axios.patch(`/api/admin/ads/${id}/status`, { active }),
  
  // 刪除廣告
  deleteAd: (id) => 
    axios.delete(`/api/admin/ads/${id}`),
};

// 個案相關 API
export const caseAPI = {
  // 獲取個案列表
  getCases: () => axios.get('/api/admin/cases'),
  
  // 獲取單個個案詳情
  getCase: (id) => axios.get(`/api/admin/cases/${id}`),
  
  // 更新個案狀態（如審核）
  updateCaseStatus: (id, status) => 
    axios.patch(`/api/admin/cases/${id}/status`, { status }),
};

// 統計相關 API
export const statsAPI = {
  // 獲取統計數據
  getStats: () => axios.get('/api/admin/stats'),
};

// 認證相關 API
export const authAPI = {
  // 管理員登入
  login: (credentials) => 
    axios.post('/api/users/adminLogin', credentials),
  
  // 獲取當前管理員信息
  getCurrentAdmin: () => axios.get('/api/users/me'),
};

export default {
  userAPI,
  adAPI,
  caseAPI,
  statsAPI,
  authAPI,
}; 