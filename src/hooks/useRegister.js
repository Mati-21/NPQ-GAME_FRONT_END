import { useDispatch } from "react-redux";
import { setCredentials } from "../features/Auth/authSlice.js";
// import { useSocket } from "./useSocket";
import { registerUser } from "../api/user.api.js";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const socket = useSocket();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      // 1️⃣ Store user in Redux
      console.log(data);
      dispatch(setCredentials(data));
      navigate("/home", { replace: true });

      //   // 2️⃣ Connect socket after registration
      //   // socket.connect();

      //   // 3️⃣ Notify server user is online
      //   // socket.emit("user:online", {
      //   //   userId: data.user.id,
      //   // });
    },
  });
};
