import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../api/user.api";

export const useAcceptFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data, friendId) => {
      console.log(data);

      // Refresh authenticated user
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      console.error("Failed to accept friend:", error);
    },
  });
};
