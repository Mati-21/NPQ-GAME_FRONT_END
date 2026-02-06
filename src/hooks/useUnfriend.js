// hooks/useUnfriend.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfriend } from "../api/user.api";

export const useUnfriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfriend,
    onSuccess: (data) => {
      console.log(data);
      // Refresh the authenticated user to update friends list
      queryClient.invalidateQueries({ queryKey: ["auth"] });

      // Optionally, refresh friends data if using another query
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
  });
};
