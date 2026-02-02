import { useQuery } from "@tanstack/react-query";
import { fetchSearchUsers } from "../api/user.api";

export const useSearchUsers = (query) => {
  return useQuery({
    queryKey: ["search-users", query],
    queryFn: () => fetchSearchUsers(query),
    enabled: !!query && query.length >= 2, // don't call if empty
    keepPreviousData: true,
    staleTime: 30 * 1000,
    select: (data) => data.users, 
  });
};
