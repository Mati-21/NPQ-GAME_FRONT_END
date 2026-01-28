// src/hooks/useLogin.js
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/user.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
