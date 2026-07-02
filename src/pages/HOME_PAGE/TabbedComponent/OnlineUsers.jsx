import { useSelector } from "react-redux";
import { useFriends } from "../../../hooks/useFriends";
import { getSocket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";

const OnlineUsers = () => {
  const user = useSelector((state) => state.auth.user);
  const onlineUserIds = useSelector((state) => state.UI_Slice.onlineUsers);
  const navigate = useNavigate();

  // Get the IDs of friends who are currently online
  const friendIds = user?.friends || [];
  const onlineFriendIds = friendIds.filter((id) => onlineUserIds.includes(id));

  const { data: onlineFriends = [], isLoading, isError } = useFriends(onlineFriendIds);

  const socket = getSocket();

  const handleRequestMatch = (friend) => {
    socket.emit("send-game-request", {
      toUserId: friend._id,
      fromUser: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    });

    // Navigate to lobby, passing opponent info via router state
    navigate("/lobby", {
      state: {
        opponent: {
          _id: friend._id,
          username: friend.username,
          firstName: friend.firstName,
          lastName: friend.lastName,
          avatar: friend.avatar,
        },
        isHost: true,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-14 py-6 text-sm text-gray-500">
        Loading online friends...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-14 py-6 text-sm text-red-500">
        Failed to load online friends.
      </div>
    );
  }

  return (
    <div className="mx-14 my-2">
      <h2 className="text-xl font-semibold mb-4 tracking-widest">
        Online Friends ({onlineFriends.length})
      </h2>

      {onlineFriends.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-6">
          None of your friends are online right now 🌙
        </div>
      ) : (
        <div className="space-y-3">
          {onlineFriends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between bg-white shadow-all rounded-lg p-3 hover:bg-gray-50 transition"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={friend.avatar || "/user.png"}
                    alt={friend.username}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200"
                  />
                  {/* Green online dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{friend.username}</div>
                  <div className="text-xs text-green-500 font-medium">Online</div>
                </div>
              </div>

              {/* Action */}
              <div
                onClick={() => handleRequestMatch(friend)}
                className="bg-blue-500 hover:bg-blue-600 transition py-1 px-4 rounded text-white font-semibold text-sm cursor-pointer"
              >
                Request Match
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineUsers;

