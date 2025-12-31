import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: `${base}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
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

export default api;
