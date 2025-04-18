import axiosInstance from './axios';

export const userAPI = {
  getUsers: () => axiosInstance.get('/users'),
  getUser: (id) => axiosInstance.get(`/users/${id}`),
  updateUser: (id, data) => axiosInstance.patch(`/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`)
};

export const caseAPI = {
  getCases: () => axiosInstance.get('/cases'),
  getCase: (id) => axiosInstance.get(`/cases/${id}`),
  updateCase: (id, data) => axiosInstance.patch(`/cases/${id}`, data),
  deleteCase: (id) => axiosInstance.delete(`/cases/${id}`)
};

export const adAPI = {
  getAds: () => axiosInstance.get('/ads'),
  createAd: (data) => axiosInstance.post('/ads', data),
  updateAd: (id, data) => axiosInstance.patch(`/ads/${id}`, data),
  deleteAd: (id) => axiosInstance.delete(`/ads/${id}`)
};

export const statsAPI = {
  getStats: () => axiosInstance.get('/stats'),
  getDashboardStats: () => axiosInstance.get('/stats/dashboard')
};

export const authAPI = {
  login: (data) => axiosInstance.post('/users/adminLogin', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile')
}; 