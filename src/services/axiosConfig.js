import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/', // URL del backend Express
  timeout: 10000,
});

// Interceptor para manejar FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

export default api;