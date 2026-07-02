import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectFriendRequest } from "../api/user.api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { removeReceivedRequest } from "../features/Auth/authSlice";

export const useRejectFriend = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: (_, userId) => {
      toast("Friend request rejected", { icon: "❌" });
      dispatch(removeReceivedRequest(userId));
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Failed to reject request";
      toast.error(message);
    },
  });
};
