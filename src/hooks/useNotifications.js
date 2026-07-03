import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../api/notification.api";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../features/Notification/notificationSlice";
import { useEffect } from "react";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60, // 1 minute
    enabled: !!user?._id,
  });

  // Sync to Redux when data is fetched
  useEffect(() => {
    if (query.data?.notifications) {
      dispatch(setNotifications(query.data.notifications));
    }
  }, [query.data, dispatch]);

  return query;
};
