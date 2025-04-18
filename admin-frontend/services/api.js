// API 服務
import axios from './axios';

// 用戶相關 API
export const userAPI = {
  // 獲取用戶列表
  getUsers: async () => {
    try {
      const response = await axios.get('/admin/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取用戶列表失敗');
    }
  },
  
  // 獲取單個用戶詳情
  getUser: async (id) => {
    try {
      const response = await axios.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取用戶詳情失敗');
    }
  },
  
  // 更新用戶狀態
  updateUserStatus: async (id, status) => {
    try {
      const response = await axios.patch(`/admin/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新用戶狀態失敗');
    }
  },
  
  // 刪除用戶
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '刪除用戶失敗');
    }
  },
};

// 案件相關 API
export const caseAPI = {
  // 獲取案件列表
  getCases: async () => {
    try {
      const response = await axios.get('/admin/cases');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取案件列表失敗');
    }
  },
  
  // 獲取單個案件詳情
  getCase: async (id) => {
    try {
      const response = await axios.get(`/admin/cases/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取案件詳情失敗');
    }
  },
  
  // 更新案件狀態
  updateCaseStatus: async (id, status) => {
    try {
      const response = await axios.patch(`/admin/cases/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新案件狀態失敗');
    }
  },
  
  // 刪除案件
  deleteCase: async (id) => {
    try {
      const response = await axios.delete(`/admin/cases/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '刪除案件失敗');
    }
  },
};

// 廣告相關 API
export const adAPI = {
  // 獲取廣告列表
  getAds: async () => {
    try {
      const response = await axios.get('/admin/ads');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取廣告列表失敗');
    }
  },
  
  // 獲取單個廣告詳情
  getAd: async (id) => {
    try {
      const response = await axios.get(`/admin/ads/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取廣告詳情失敗');
    }
  },
  
  // 創建廣告
  createAd: async (data) => {
    try {
      const response = await axios.post('/admin/ads', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '創建廣告失敗');
    }
  },
  
  // 更新廣告
  updateAd: async (id, data) => {
    try {
      const response = await axios.put(`/admin/ads/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新廣告失敗');
    }
  },
  
  // 刪除廣告
  deleteAd: async (id) => {
    try {
      const response = await axios.delete(`/admin/ads/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '刪除廣告失敗');
    }
  },
};

// 統計相關 API
export const statsAPI = {
  // 獲取統計數據
  getStats: async () => {
    try {
      const response = await axios.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取統計數據失敗');
    }
  },
};

// 認證相關 API
export const authAPI = {
  // 管理員登錄
  login: async (data) => {
    try {
      const response = await axios.post('/admin/login', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '登錄失敗');
    }
  },
  
  // 獲取當前用戶信息
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/admin/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取用戶信息失敗');
    }
  },
  
  // 登出
  logout: async () => {
    try {
      const response = await axios.post('/admin/logout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '登出失敗');
    }
  },
};

// 貼文相關 API
export const postAPI = {
  // 獲取貼文列表
  getPosts: async (params) => {
    try {
      const response = await axios.get('/admin/posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取貼文列表失敗');
    }
  },
  
  // 獲取單個貼文詳情
  getPost: async (id) => {
    try {
      const response = await axios.get(`/admin/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '獲取貼文詳情失敗');
    }
  },
  
  // 更新貼文狀態
  updatePostStatus: async (id, status) => {
    try {
      const response = await axios.patch(`/admin/posts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新貼文狀態失敗');
    }
  },
  
  // 更新貼文審核狀態
  updatePostVerification: async (id, verified) => {
    try {
      const response = await axios.patch(`/admin/posts/${id}/verify`, { verified });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新貼文審核狀態失敗');
    }
  },
  
  // 更新貼文廣告等級
  updatePostAdLevel: async (id, adLevel) => {
    try {
      const response = await axios.patch(`/admin/posts/${id}/ad-level`, { adLevel });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '更新貼文廣告等級失敗');
    }
  },
};

// 導出所有 API
export default {
  userAPI,
  caseAPI,
  adAPI,
  statsAPI,
  authAPI,
  postAPI,
}; 