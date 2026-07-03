import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://npq-game-back-end.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
