import axiosInstance from "../app/axios";

// Fetch all notifications for the user
export const fetchNotifications = async () => {
  const res = await axiosInstance.get("/notifications");
  return res.data;
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  const res = await axiosInstance.put("/notifications/mark-read");
  return res.data;
};

// Mark a single notification as read
export const markOneNotificationRead = async (id) => {
  const res = await axiosInstance.put(`/notifications/${id}/read`);
  return res.data;
};
