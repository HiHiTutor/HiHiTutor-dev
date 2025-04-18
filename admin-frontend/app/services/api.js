import axiosInstance from './axios';

export const userAPI = {
  getUsers: () => axiosInstance.get('/admin/users'),
  getUser: (id) => axiosInstance.get(`/admin/users/${id}`),
  updateUser: (id, data) => axiosInstance.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`)
};

export const caseAPI = {
  getCases: () => axiosInstance.get('/admin/cases'),
  getCase: (id) => axiosInstance.get(`/admin/cases/${id}`),
  updateCase: (id, data) => axiosInstance.patch(`/admin/cases/${id}`, data),
  deleteCase: (id) => axiosInstance.delete(`/admin/cases/${id}`)
};

export const adAPI = {
  getAds: () => axiosInstance.get('/admin/ads'),
  createAd: (data) => axiosInstance.post('/admin/ads', data),
  updateAd: (id, data) => axiosInstance.patch(`/admin/ads/${id}`, data),
  deleteAd: (id) => axiosInstance.delete(`/admin/ads/${id}`)
};

export const statsAPI = {
  getStats: () => axiosInstance.get('/admin/stats')
};

export const authAPI = {
  login: (data) => axiosInstance.post('/admin/auth/login', data),
  logout: () => axiosInstance.post('/admin/auth/logout'),
  getProfile: () => axiosInstance.get('/admin/auth/profile')
}; 