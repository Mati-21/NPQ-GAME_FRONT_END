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

// src/api/auth.js
export const checkAuth = async () => {
  try {
    const response = await axiosInstance.get("/auth/checkAuth", {
      withCredentials: true,
    });

    return response.data; // goes to onSuccess
  } catch (error) {
    console.log("Axios error:", error.response?.status, error.response?.data);
    throw error; // important: rethrow so onError triggers
  }
};

export const fetchSearchUsers = async (query) => {
  const res = await axiosInstance.get(`/user/searchuser?q=${query}`);
  return res.data;
};

export const getSomeUsers = async (usersId) => {
  const res = await axiosInstance.post("/user/getSomeUsers", {
    usersId,
  });
  return res.data;
};

// get friends
export const getFriends = async (FriendsId) => {
  console.log("from Gete Freinds");
  const res = await axiosInstance.post("/user/getFriends", {
    FriendsId,
  });
  return res.data;
};

// API call
export const acceptFriendRequest = async (friendId) => {
  const res = await axiosInstance.put(`/friends/accept/${friendId}`);
  return res.data;
};

// add friend
export const addFriend = async (userId) => {
  const res = await axiosInstance.post(`/friends/request/${userId}`);
  return res.data;
};

export const unfriend = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/unfriend/${friendId}`);
  return res.data;
};
