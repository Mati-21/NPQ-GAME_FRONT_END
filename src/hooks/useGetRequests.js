// hooks/useGetSomeUsers.js
import { useQuery } from "@tanstack/react-query";
import { getSomeUsers } from "../api/user.api";

export const useGetRequests = (usersId = []) => {
  return useQuery({
    queryKey: ["friend-requests", usersId], // 🔑 include IDs
    queryFn: () => getSomeUsers(usersId),
    staleTime: 1000 * 60,
    enabled: Array.isArray(usersId) && usersId.length > 0,
  });
};
