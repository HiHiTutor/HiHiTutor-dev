// API 服務
import axios from './axios';

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