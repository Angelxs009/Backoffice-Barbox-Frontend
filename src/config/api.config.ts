import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipo para respuestas del backend
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

// Request interceptor: agregar token de localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: manejar errores 401 y extraer data
api.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene el formato {status, message, data}, extraer data
    if (response.data && typeof response.data === 'object' && 'status' in response.data && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar token y redirigir a login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Extraer mensaje de error del formato del backend
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
