import { useSelector } from "react-redux";
import { useAddFriend } from "../../../hooks/useAddFriend";

function SearchResult({ searchedUsers = [], Clearvalue }) {
  const user = useSelector((state) => state.auth.user);
  // const socket = getSocket();

  const { mutate, isLoading } = useAddFriend();

  function handleAddFriend(userId) {
    mutate(userId);
    Clearvalue();
  }

  return (
    <div className="absolute top-[120%] right-0 shadow-lg w-full rounded-md p-4 z-50 bg-white max-h-96 overflow-y-auto flex flex-col gap-2">
      {searchedUsers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No users found</p>
      ) : (
        searchedUsers.map((searchedUser) => {
          const isFriend = user?.friends?.includes(searchedUser._id);

          const isRequested = user?.friendRequests?.sent?.includes(
            searchedUser._id,
          );

          const hasIncomingRequest = user?.friendRequests?.received?.includes(
            searchedUser._id,
          );

          return (
            <div
              key={searchedUser._id}
              className="flex justify-between items-center hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <img
                  src={searchedUser.avatar}
                  alt={searchedUser.username}
                  className="w-8 h-8 rounded-full bg-amber-200"
                />
                <span className="text-black text-xs">
                  {searchedUser.username}
                </span>
              </div>

              {isFriend ? (
                <button className="text-xs p-2 rounded bg-gray-400 text-white cursor-pointer">
                  Send Message
                </button>
              ) : hasIncomingRequest ? (
                <button className="text-xs p-2 rounded bg-blue-600 text-white cursor-pointer">
                  Accept Request
                </button>
              ) : isRequested ? (
                <button
                  disabled
                  className="text-xs p-2 rounded bg-gray-300 text-gray-700 cursor-not-allowed"
                >
                  Requested
                </button>
              ) : (
                <button
                  onClick={() => handleAddFriend(searchedUser._id)}
                  disabled={isLoading}
                  className="text-xs p-2 rounded bg-blue-600 text-white font-semibold cursor-pointer"
                >
                  {isLoading ? "Sending..." : "Add Friend"}
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
