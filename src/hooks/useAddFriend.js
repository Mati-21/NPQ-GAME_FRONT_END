import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFriend } from "../api/user.api";

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      console.log("Friend request sent");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};
