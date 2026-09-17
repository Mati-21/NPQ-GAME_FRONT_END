import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "https://npq-game-back-end-vsa8.onrender.com";
    socket = io(SOCKET_URL, {
      withCredentials: true, // 🔥 sends HttpOnly cookies
      transports: ["websocket", "polling"],
    });

    // Optional but VERY useful for debugging
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected");
  }
};

export const getSocket = () => socket;
