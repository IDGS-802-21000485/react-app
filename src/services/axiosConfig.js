import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/', // URL del backend Express
});

export default api;
