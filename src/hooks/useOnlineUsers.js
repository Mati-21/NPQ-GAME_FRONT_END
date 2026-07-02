import { useQuery } from "@tanstack/react-query";
import { fetchOnlineUsers, getSomeUsers } from "../api/user.api";

export const useOnlineUsers = () => {
  return useQuery({
    queryKey: ["onlineUsers"], // ✅ array of keys
    queryFn: getSomeUsers, // ✅ function
    staleTime: 1000 * 60, // optional
  });
};
