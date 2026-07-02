import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfriend } from "../api/user.api";
import { useDispatch } from "react-redux";
import { Unfriend } from "../features/Auth/authSlice";
import toast from "react-hot-toast";

export const useUnfriend = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: unfriend,
    onSuccess: (data, friendId) => {
      toast("User unfriended successfully", { icon: "👋" });
      dispatch(Unfriend(friendId));
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Failed to unfriend";
      toast.error(message);
    },
  });
};

