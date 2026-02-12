import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-job-fraud-detector.onrender.com/api",
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
  const response = await api.post("/analyze-job", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/analysis/${id}`);
  return response.data;
};

export default api;
