import { useEffect } from "react";
import { getSocket } from "../../../utils/socket";
import { useOnlineUsers } from "../../../hooks/useOnlineUsers";
import { useQueryClient } from "@tanstack/react-query";

const OnlineUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError } = useOnlineUsers();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleOnlineUsers = () => {
      queryClient.invalidateQueries({ queryKey: ["onlineUsers"] });
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [queryClient]);

  if (isLoading) return <p>Loading online users...</p>;
  if (isError) return <p>Failed to load users</p>;

  return (
    <div>
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
