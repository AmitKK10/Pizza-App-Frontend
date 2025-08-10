import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://pizza-app-backend-vert.vercel.app/api'
    : 'http://localhost:55000/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// ✅ Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle unauthorized errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
