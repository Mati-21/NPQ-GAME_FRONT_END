import { useSelector } from "react-redux";
import { useGetRequests } from "../../../hooks/useGetRequests";
import { useAcceptFriend } from "../../../hooks/useAcceptFriend";

function FriendRequest() {
  const user = useSelector((state) => state.auth.user);
  const requestIds = user?.friendRequests?.received ?? [];

  

  const { data: users, isLoading } = useGetRequests(requestIds);

  const acceptFriendMutation = useAcceptFriend();

  if (isLoading) return <p>Loading friend requests...</p>;

  return (
    <div className="flex-1">
      <div className="mx-14 py-2 w-1/3 rounded flex-1">
        <div className="w-full flex flex-col gap-3 mb-2">
          <h1 className="text-xl mb-5">Friend Requests</h1>
          {users?.map((u) => (
            <div key={u._id} className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold cursor-pointer">
                  {u.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold mb-0.5">{u.username}</div>
                  <div className="text-xs font-bold">{u.email}</div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => acceptFriendMutation.mutate(u._id)}
                  className="bg-blue-500 px-4 py-2 rounded text-xs text-white font-bold cursor-pointer"
                  disabled={acceptFriendMutation.isLoading}
                >
                  {acceptFriendMutation.isLoading ? "Accepting..." : "Accept"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FriendRequest;
