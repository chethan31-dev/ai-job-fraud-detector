import axios from 'axios';

console.log("API URL:", process.env.REACT_APP_API_URL);


// Production backend URL (Render)
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://ai-job-fraud-detector.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
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

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================= API METHODS =================

// Analyze Job
export const analyzeJob = async (formData) => {
  const response = await api.post('/analyze-job', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get History
export const getHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/history?page=${page}&limit=${limit}`);
  return response.data;
};

// Get Single Analysis
export const getAnalysis = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

// Delete Analysis
export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/analysis/${id}`);
  return response.data;
};

export default api;
