import axios from 'axios';

// Singleton API instance directed cleanly to the Express server we just finished
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor automating Firebase tokens onto every outbound request
api.interceptors.request.use(async (config) => {
  // We will assume token is managed via a global localStorage cache or fetched from FB directly.
  const token = localStorage.getItem('erp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
