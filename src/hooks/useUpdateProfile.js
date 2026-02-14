import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/user.api";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      console.error("Profile update failed:", error);
      // Optionally, you can show a toast or notification here
      alert(error?.response?.data?.message || "Something went wrong");
    },
  });
};
