import { useEffect } from "react";
import { getSocket } from "../../../utils/socket";
import { useOnlineUsers } from "../../../hooks/useOnlineUsers";
import { useQueryClient } from "@tanstack/react-query";
import { excludeUserById } from "../../../utils/OtherUsers";
import { useSelector } from "react-redux";

const OnlineUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError } = useOnlineUsers();

  const { user } = useSelector((state) => state.auth);

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

  const cleanedUsers = excludeUserById(user._id, users);

  return (
    <div className="mx-14 py-2">
      <h3 className="text-xl">Online Users ({cleanedUsers.length})</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {cleanedUsers.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between shadow-card rounded-lg p-3 mb-2 bg-white"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full mr-2 overflow-hidden">
                <img src={user.avatar} alt="" />
              </div>
              <div>
                <p>{user.username}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-blue-500 py-1 px-4 rounded text-white font-semibold cursor-pointer">
              Request Match
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
