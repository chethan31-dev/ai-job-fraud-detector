import axios from "axios";

// Frontend should call backend with explicit Render base URL
// Keep this value pointed at your Render deployment as requested
const API_BASE_URL = "https://ai-job-fraud-detector.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const analyzeJob = async (formData) => {
  const response = await api.post("/api/analyze-job", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/api/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await api.get(`/api/analysis/${id}`);
  return response.data;
};

export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/api/analysis/${id}`);
  return response.data;
};

export default api;
