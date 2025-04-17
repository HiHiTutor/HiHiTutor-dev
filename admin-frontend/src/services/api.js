// API 服務
import axios from './axios';

// 用戶相關 API
export const userAPI = {
  // 獲取用戶列表
  getUsers: () => axios.get('/api/admin/users'),
  
  // 獲取單個用戶詳情
  getUser: (id) => axios.get(`/api/admin/users/${id}`),
  
  // 更新用戶狀態
  updateUserStatus: (id, status) => axios.patch(`/api/admin/users/${id}/status`, { status }),
  
  // 刪除用戶
  deleteUser: (id) => axios.delete(`/api/admin/users/${id}`),
};

// 案件相關 API
export const caseAPI = {
  // 獲取案件列表
  getCases: () => axios.get('/api/admin/cases'),
  
  // 獲取單個案件詳情
  getCase: (id) => axios.get(`/api/admin/cases/${id}`),
  
  // 更新案件狀態
  updateCaseStatus: (id, status) => axios.patch(`/api/admin/cases/${id}/status`, { status }),
  
  // 刪除案件
  deleteCase: (id) => axios.delete(`/api/admin/cases/${id}`),
};

// 廣告相關 API
export const adAPI = {
  // 獲取廣告列表
  getAds: () => axios.get('/api/admin/ads'),
  
  // 獲取單個廣告詳情
  getAd: (id) => axios.get(`/api/admin/ads/${id}`),
  
  // 創建廣告
  createAd: (data) => axios.post('/api/admin/ads', data),
  
  // 更新廣告
  updateAd: (id, data) => axios.put(`/api/admin/ads/${id}`, data),
  
  // 刪除廣告
  deleteAd: (id) => axios.delete(`/api/admin/ads/${id}`),
};

// 統計相關 API
export const statsAPI = {
  // 獲取統計數據
  getStats: () => axios.get('/api/admin/stats'),
};

// 認證相關 API
export const authAPI = {
  // 管理員登錄
  login: (data) => axios.post('/api/admin/login', data),
  
  // 獲取當前用戶信息
  getCurrentUser: () => axios.get('/api/admin/me'),
  
  // 登出
  logout: () => axios.post('/api/admin/logout'),
};

// 導出所有 API
export default {
  userAPI,
  caseAPI,
  adAPI,
  statsAPI,
  authAPI,
}; 