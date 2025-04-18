import axiosInstance from './axios';

export const userAPI = {
  getAll: () => axiosInstance.get('/users'),
  getOne: (id) => axiosInstance.get(`/users/${id}`),
  update: (id, data) => axiosInstance.patch(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`)
};

export const caseAPI = {
  getAll: () => axiosInstance.get('/cases'),
  getOne: (id) => axiosInstance.get(`/cases/${id}`),
  update: (id, data) => axiosInstance.patch(`/cases/${id}`, data),
  delete: (id) => axiosInstance.delete(`/cases/${id}`)
};

export const adAPI = {
  getAll: () => axiosInstance.get('/advertisements'),
  create: (data) => axiosInstance.post('/advertisements', data),
  update: (id, data) => axiosInstance.patch(`/advertisements/${id}`, data),
  delete: (id) => axiosInstance.delete(`/advertisements/${id}`)
};

export const statsAPI = {
  getDashboard: () => axiosInstance.get('/stats/dashboard'),
  getStats: () => axiosInstance.get('/stats')
};

export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile')
}; 