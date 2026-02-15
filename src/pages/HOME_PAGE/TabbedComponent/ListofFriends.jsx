import { useSelector } from "react-redux";
import { useUnfriend } from "../../../hooks/useUnfriend";
import { useFriends } from "../../../hooks/useFriends";

function ListofFriends() {
  const user = useSelector((state) => state.auth.user);
  const friendIds = user?.friends || [];

  const { data: friends = [], isLoading, isError } = useFriends(friendIds);

  const { mutate: unfriendMutate, isLoading: isUnfriending } = useUnfriend();

  if (isLoading) {
    return (
      <div className="mx-14 py-6 text-center text-sm text-gray-500">
        Loading friends...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-14 py-6 text-center text-sm text-red-500">
        Failed to load friends
      </div>
    );
  }

  return (
    <div className="mx-14 my-2">
      <h2 className="text-xl font-semibold mb-4 tracking-widest">Friends</h2>

      {friends.length === 0 ? (
        <div className="text-sm text-gray-500 text-center">
          You have no friends yet 🤝
        </div>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between bg-white shadow-card rounded-lg p-3 hover:bg-gray-50 transition"
            >
              {/* Left: avatar + info */}
              <div className="flex items-center gap-3">
                <img
                  src={friend.avatar || "/avatar-placeholder.png"}
                  alt={friend.username}
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />

                <div>
                  <div className="text-sm font-semibold">{friend.username}</div>
                  <div className="text-xs text-gray-500">
                    {friend.status === "online" ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">
                  Message
                </button>

                <button
                  onClick={() => unfriendMutate(friend._id)}
                  disabled={isUnfriending}
                >
                  {isUnfriending ? "Removing..." : "Unfriend"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListofFriends;
