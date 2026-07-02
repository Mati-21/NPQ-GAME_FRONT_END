import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "../api/user.api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { removeSentRequest } from "../features/Auth/authSlice";

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: (_, userId) => {
      toast("Friend request cancelled", { icon: "↩️" });
      // Optimistically remove from Redux sent list
      dispatch(removeSentRequest(userId));
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Failed to cancel request";
      toast.error(message);
    },
  });
};
