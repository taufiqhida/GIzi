import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Admin API
export const adminAPI = {
  getUsers: (role) => api.get('/admin/users', { params: { role } }),
  createUser: (data) => api.post('/admin/users', data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  createArtikel: (data) => api.post('/admin/artikel', data),
  getArtikel: () => api.get('/admin/artikel'),
  updateArtikel: (id, data) => api.put(`/admin/artikel/${id}`, data),
  deleteArtikel: (id) => api.delete(`/admin/artikel/${id}`),
  createResep: (data) => api.post('/admin/resep', data),
  getResep: () => api.get('/admin/resep'),
  updateResep: (id, data) => api.put(`/admin/resep/${id}`, data),
  deleteResep: (id) => api.delete(`/admin/resep/${id}`),
};

// Pasien API
export const pasienAPI = {
  getBalita: () => api.get('/pasien/balita'),
  createBalita: (data) => api.post('/pasien/balita', data),
  getKonsultasi: () => api.get('/pasien/konsultasi'),
  requestKonsultasi: (data) => api.post('/pasien/konsultasi', data),
};

// Dokter API
export const dokterAPI = {
  getKonsultasi: (status) => api.get('/dokter/konsultasi', { params: { status } }),
  acceptKonsultasi: (id) => api.put(`/dokter/konsultasi/${id}/accept`),
  rejectKonsultasi: (id) => api.put(`/dokter/konsultasi/${id}/reject`),
};

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
  getMessages: (konsultasiId) => api.get(`/chat/${konsultasiId}`),
};

// Public API
export const publicAPI = {
  getArtikel: () => api.get('/artikel/public'),
  getArtikelBySlug: (slug) => api.get(`/artikel/public/${slug}`),
  getResep: () => api.get('/resep/public'),
  getDokter: () => api.get('/dokter/public'),
};

export default api;