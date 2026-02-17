import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../api/user.api";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
