// hooks/useGetSomeUsers.js
import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../api/user.api";

export const useFriends = (friendsId = []) => {
  return useQuery({
    queryKey: ["friends", friendsId], // 🔑 include IDs
    queryFn: () => getFriends(friendsId),
    staleTime: 1000 * 60,
    enabled: Array.isArray(friendsId) && friendsId.length > 0,
  });
};
