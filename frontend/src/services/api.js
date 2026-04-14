import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Users
export const getUsers = () => API.get('/users');
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Donors
export const createDonor = (data) => API.post('/donors', data);
export const getDonors = (params) => API.get('/donors', { params });
export const getDonor = (id) => API.get(`/donors/${id}`);
export const updateDonor = (id, data) => API.put(`/donors/${id}`, data);
export const deleteDonor = (id) => API.delete(`/donors/${id}`);

// Requests
export const createRequest = (data) => API.post('/requests', data);
export const getRequests = (params) => API.get('/requests', { params });
export const updateRequestStatus = (id, status) => API.put(`/requests/${id}/status`, { status });
export const deleteRequest = (id) => API.delete(`/requests/${id}`);

export default API;
