import axiosInstance from './axios';

export const userAPI = {
  getAll: () => axiosInstance.get('/api/admin/users'),
  getOne: (id) => axiosInstance.get(`/api/admin/users/${id}`),
  update: (id, data) => axiosInstance.patch(`/api/admin/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/admin/users/${id}`)
};

export const caseAPI = {
  getAll: () => axiosInstance.get('/api/admin/cases'),
  getOne: (id) => axiosInstance.get(`/api/admin/cases/${id}`),
  update: (id, data) => axiosInstance.patch(`/api/admin/cases/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/admin/cases/${id}`)
};

export const adAPI = {
  getAll: () => axiosInstance.get('/api/ads'),
  create: (data) => axiosInstance.post('/api/ads', data),
  update: (id, data) => axiosInstance.patch(`/api/ads/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/ads/${id}`)
};

export const statsAPI = {
  getDashboard: () => axiosInstance.get('/api/admin/stats'),
  getStats: () => axiosInstance.get('/api/admin/stats')
};

export const authAPI = {
  login: (data) => axiosInstance.post('/api/admin/auth/login', data),
  logout: () => axiosInstance.post('/api/admin/auth/logout'),
  getProfile: () => axiosInstance.get('/api/admin/auth/profile')
}; 