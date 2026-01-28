import axiosInstance from "../app/axios";

// Registration API call

export const registerUser = async (data) => {
  const { name, email, username, password } = data;

  const res = await axiosInstance.post("/auth/register", {
    name,
    email,
    username,
    password,
  });

  return res.data;
};

// Login API call

export const loginUser = async (data) => {
  const { email, password } = data;
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data;
};






// Fetch online user details API call
export const fetchOnlineUsers = async () => {
  const res = await axiosInstance.get("/user/onlineusers", {
    withCredentials: true, 
  });
  return res.data.users; // only return the array of users
};