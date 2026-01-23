import axios from 'axios';

const api = axios.create({
  // Sesuaikan dengan URL server backend 
  baseURL: 'http://localhost:3000', 
});

// Interceptor: Otomatis menempelkan Token ke setiap request jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;



