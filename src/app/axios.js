import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://npq-game-back-end-vsa8.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
