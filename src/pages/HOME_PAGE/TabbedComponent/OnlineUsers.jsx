import { useEffect } from "react";
import { getSocket } from "../../../utils/socket";
import { useOnlineUsers } from "../../../hooks/useOnlineUsers";
import { useQueryClient } from "@tanstack/react-query";

const OnlineUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError } = useOnlineUsers();
  console.log(users);

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
    <div className="bg-green-400 mx-14 py-2">
      <h3>Online Users ({users.length})</h3>
      <ul className="">
        {users.map((user) => (
          <li key={user._id} className=" flex  items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full mt-2 mr-2"></div>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
