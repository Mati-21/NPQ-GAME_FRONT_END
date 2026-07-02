import { useDispatch, useSelector } from "react-redux";
import { removeGameRequest } from "../../../features/UI_Slice/UI_Slice";
import { getSocket } from "../../../utils/socket";
import { useNavigate } from "react-router-dom";

function GameRequests() {
  const dispatch = useDispatch();
  const gameRequests = useSelector((state) => state.UI_Slice.gameRequests);
  const currentUser = useSelector((state) => state.auth.user);
  const socket = getSocket();
  const navigate = useNavigate();

  const handleAccept = (request) => {
    // Notify the sender that the request was accepted
    socket.emit("accept-game-request", {
      toUserId: request.fromUser._id,
      requestId: request.requestId,
      acceptedBy: {
        _id: currentUser._id,
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        avatar: currentUser.avatar,
      },
    });
    // Remove from local list
    dispatch(removeGameRequest(request.requestId));

    // Navigate the accepter (guest) to the lobby
    navigate("/lobby", {
      state: {
        opponent: {
          _id: request.fromUser._id,
          username: request.fromUser.username,
          firstName: request.fromUser.firstName,
          lastName: request.fromUser.lastName,
          avatar: request.fromUser.avatar,
        },
        isHost: false,
      },
    });
  };

  const handleDecline = (request) => {
    // Notify the sender that the request was declined
    socket.emit("decline-game-request", {
      toUserId: request.fromUser._id,
      requestId: request.requestId,
    });
    // Remove from local list
    dispatch(removeGameRequest(request.requestId));
  };

  return (
    <div className="mx-14 my-2">
      <h2 className="text-xl font-semibold mb-4 tracking-widest">
        Game Requests ({gameRequests.length})
      </h2>

      {gameRequests.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-10">
          No game requests yet 🎮
        </div>
      ) : (
        <div className="space-y-3">
          {gameRequests.map((request) => (
            <div
              key={request.requestId}
              className="flex items-center justify-between bg-white shadow-all rounded-lg p-4 hover:bg-gray-50 transition"
            >
              {/* Sender info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={request.fromUser?.avatar || "/user.png"}
                    alt={request.fromUser?.username}
                    className="w-11 h-11 rounded-full object-cover bg-gray-200"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {request.fromUser?.firstName
                      ? `${request.fromUser.firstName} ${request.fromUser.lastName || ""}`.trim()
                      : request.fromUser?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{request.fromUser?.username}
                  </p>
                  <p className="text-xs text-blue-500 font-medium mt-0.5">
                    wants to play with you!
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request)}
                  className="bg-green-500 hover:bg-green-600 transition text-white text-sm font-semibold px-4 py-1.5 rounded cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(request)}
                  className="bg-red-400 hover:bg-red-500 transition text-white text-sm font-semibold px-4 py-1.5 rounded cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameRequests;
