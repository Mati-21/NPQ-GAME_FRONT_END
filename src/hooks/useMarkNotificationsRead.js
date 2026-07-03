import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsRead, markOneNotificationRead } from "../api/notification.api";
import { useDispatch } from "react-redux";
import {
  markAllNotificationsRead as markAllReadRedux,
  markNotificationRead as markOneReadRedux,
} from "../features/Notification/notificationSlice";

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Mutation to mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      dispatch(markAllReadRedux());
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mutation to mark a single notification as read
  const markOneReadMutation = useMutation({
    mutationFn: markOneNotificationRead,
    onSuccess: (_, notificationId) => {
      dispatch(markOneReadRedux(notificationId));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    markAllRead: markAllReadMutation.mutate,
    markOneRead: markOneReadMutation.mutate,
    isMarkingAllPending: markAllReadMutation.isPending,
    isMarkingOnePending: markOneReadMutation.isPending,
  };
};
