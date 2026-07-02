import { useSelector } from "react-redux";
import { useAddFriend } from "../../../hooks/useAddFriend";
import { useCancelFriendRequest } from "../../../hooks/useCancelFriendRequest";

function SearchResult({ searchedUsers = [], Clearvalue }) {
  const user = useSelector((state) => state.auth.user);

  const { mutate: sendRequest, isPending: isSending } = useAddFriend();
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelFriendRequest();

  return (
    <div className="absolute top-[120%] right-0 shadow-lg w-full rounded-md p-4 z-50 bg-white max-h-96 overflow-y-auto flex flex-col gap-2">
      {searchedUsers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No users found</p>
      ) : (
        searchedUsers.map((searchedUser) => {
          const isFriend = user?.friends?.includes(searchedUser._id);

          // Check both DB state and optimistic Redux state
          const isRequested =
            user?.friendRequests?.sent?.includes(searchedUser._id);

          const hasIncomingRequest =
            user?.friendRequests?.received?.includes(searchedUser._id);

          const handleToggle = () => {
            if (isRequested) {
              cancelRequest(searchedUser._id);
            } else {
              sendRequest(searchedUser._id);
            }
          };

          return (
            <div
              key={searchedUser._id}
              className="flex justify-between items-center p-1 rounded hover:bg-gray-50"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <img
                  src={searchedUser.avatar || "/user.png"}
                  alt={searchedUser.username}
                  className="w-8 h-8 rounded-full bg-amber-200 object-cover"
                />
                <div>
                  <p className="text-black text-sm font-medium">
                    {searchedUser.username}
                  </p>
                  {searchedUser.firstName && (
                    <p className="text-xs text-gray-400">
                      {searchedUser.firstName} {searchedUser.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Action button */}
              {isFriend ? (
                <button className="text-xs px-3 py-1.5 rounded bg-gray-300 text-gray-700 cursor-default">
                  Friends
                </button>
              ) : hasIncomingRequest ? (
                <button className="text-xs px-3 py-1.5 rounded bg-green-500 text-white font-semibold cursor-pointer hover:bg-green-600 transition">
                  Accept
                </button>
              ) : (
                <button
                  onClick={handleToggle}
                  disabled={isSending || isCancelling}
                  className={`text-xs px-3 py-1.5 rounded font-semibold cursor-pointer transition ${
                    isRequested
                      ? "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSending || isCancelling
                    ? "..."
                    : isRequested
                    ? "Requested"
                    : "Add Friend"}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default SearchResult;

