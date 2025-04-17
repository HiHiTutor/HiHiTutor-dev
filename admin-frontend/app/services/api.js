// API 服務
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

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
  getUsers: () => fetchAPI('/api/admin/users'),
  
  // 獲取單個用戶詳情
  getUser: (id) => fetchAPI(`/api/admin/users/${id}`),
  
  // 更新用戶狀態（如審核）
  updateUserStatus: (id, status) => 
    fetchAPI(`/api/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 廣告相關 API
export const adAPI = {
  // 獲取廣告列表
  getAds: () => fetchAPI('/api/admin/ads'),
  
  // 獲取單個廣告詳情
  getAd: (id) => fetchAPI(`/api/admin/ads/${id}`),
  
  // 創建新廣告
  createAd: (adData) => 
    fetchAPI('/api/admin/ads', {
      method: 'POST',
      body: JSON.stringify(adData),
    }),
  
  // 更新廣告
  updateAd: (id, adData) => 
    fetchAPI(`/api/admin/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adData),
    }),
  
  // 更新廣告狀態（啟用/停用）
  updateAdStatus: (id, active) => 
    fetchAPI(`/api/admin/ads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    }),
  
  // 刪除廣告
  deleteAd: (id) => 
    fetchAPI(`/api/admin/ads/${id}`, {
      method: 'DELETE',
    }),
};

// 個案相關 API
export const caseAPI = {
  // 獲取個案列表
  getCases: () => fetchAPI('/api/admin/cases'),
  
  // 獲取單個個案詳情
  getCase: (id) => fetchAPI(`/api/admin/cases/${id}`),
  
  // 更新個案狀態（如審核）
  updateCaseStatus: (id, status) => 
    fetchAPI(`/api/admin/cases/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// 認證相關 API
export const authAPI = {
  // 管理員登入
  login: (credentials) => 
    fetchAPI('/api/users/adminLogin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  // 獲取當前管理員信息
  getCurrentAdmin: () => fetchAPI('/api/users/me'),
};

export default {
  userAPI,
  adAPI,
  caseAPI,
  authAPI,
}; 