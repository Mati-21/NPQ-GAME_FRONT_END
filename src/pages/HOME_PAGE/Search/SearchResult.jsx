import { useSelector } from "react-redux";

function SearchResult({ searchedUsers = [] }) {
  const user = useSelector((state) => state.auth.user);
 

  return (
    <div className="absolute top-[120%] right-0 shadow-lg w-full rounded-md p-4 z-50 bg-white max-h-96 overflow-y-auto flex flex-col gap-2">
      {searchedUsers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No users found</p>
      ) : (
        searchedUsers.map((searchedUser) => (
          <div
            key={searchedUser._id}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-3 mb-3 last:mb-0">
              <img
                src={searchedUser?.avatar}
                alt={searchedUser?.username}
                className="w-8 h-8 rounded-full bg-amber-200"
              />
              <span className="text-black text-xs">
                {searchedUser.username}
              </span>
            </div>
            {user?.friends?.includes(searchedUser._id) ? (
              <div>
                <button className="text-xs p-2 rounded bg-blue-600 text-white font-semibold">
                  Send Message
                </button>
              </div>
            ) : (
              <div>
                <button className="text-xs p-2 rounded bg-blue-600 text-white font-semibold">
                  Add Friend
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default SearchResult;
