// hooks/useCheckAuth.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { checkAuth } from "../api/user.api.js";
import { logout, setCredentials } from "../features/Auth/authSlice.js";

export const useCheckAuth = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false, // don't retry on 401
    staleTime: 5 * 60 * 1000, // optional
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user }));
    },
    onError: () => {
      dispatch(logout());
    },
  });
};
