import { useSelector } from "react-redux";
import { useUnfriend } from "../../../hooks/useUnfriend";
import { useFriends } from "../../../hooks/useFriends";
import { useState } from "react";

function ListofFriends() {
  const user = useSelector((state) => state.auth.user);
  const friendIds = user?.friends || [];
  const onlineUserIds = useSelector((state) => state.UI_Slice.onlineUsers) || [];

  const { data: friends = [], isLoading, isError } = useFriends(friendIds);
  const [friendToUnfriend, setFriendToUnfriend] = useState(null);

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
          {friends.map((friend) => {
            const isOnline = onlineUserIds.includes(friend._id);
            return (
              <div
                key={friend._id}
                className="flex items-center justify-between bg-white shadow-card rounded-lg p-3 hover:bg-gray-50 transition"
              >
                {/* Left: avatar + info */}
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatar || "/user.png"}
                    alt={friend.username}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-100"
                  />

                  <div>
                    <div className="text-sm font-semibold">{friend.username}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                        }`}
                      ></span>
                      {isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>


              {/* Right: actions */}
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer">
                  Message
                </button>

                <button
                  onClick={() => setFriendToUnfriend(friend)}
                  disabled={isUnfriending}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition duration-200 cursor-pointer disabled:opacity-50"
                >
                  Unfriend
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {friendToUnfriend && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unfriend {friendToUnfriend.username}?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-gray-700">{friendToUnfriend.username}</span> from your friends list? You won't be able to chat or play together until you add them again.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setFriendToUnfriend(null)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  unfriendMutate(friendToUnfriend._id);
                  setFriendToUnfriend(null);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
              >
                Unfriend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListofFriends;

