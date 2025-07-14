import axios from 'axios';

const api = axios.create({ // Create an Axios instance
  baseURL: 'http://localhost:5000/api',
  // withCredentials: true // This allows cookies to be sent with requests
});

// Attach JWT token to every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// =======================
// AUTH APIs
// =======================

// POST /api/auth/register
export const registerUser = (data) => api.post('/auth/register', data);

// POST /api/auth/login
export const loginUser = (data) => api.post('/auth/login', data);

// GET /api/auth/profile
export const getProfile = () => api.get('/auth/profile');

// =======================
// TRANSACTION APIs
// =======================

// GET /api/transactions?category=&type=&startDate=&endDate=&page=&limit=
export const getTransactions = (params) => api.get('/transactions', { params });

// POST /api/transactions
export const createTransaction = (data) => api.post('/transactions', data);

// PUT /api/transactions/:id
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);

// DELETE /api/transactions/:id
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// GET /api/transactions/stats
export const getStats = () => api.get('/transactions/stats');

// =======================
// Health Check (Optional)
// =======================
export const checkServer = () => api.get('/health');

// Export default axios instance in case you want raw use elsewhere
export default api;