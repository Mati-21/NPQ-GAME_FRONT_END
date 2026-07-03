// import { useState } from "react";

// import { useSelector } from "react-redux";
import TopPlayers from "./Top_Players/TopPlayers.jsx";
import GameHistory from "./TabbedComponent/GameHistory.jsx";
import OnlineUsers from "./TabbedComponent/OnlineUsers.jsx";
import FriendRequest from "./TabbedComponent/FriendRequest.jsx";
import GameRequests from "./TabbedComponent/GameRequests.jsx";
import TopNavigation from "./TopNavigation/TopNavigation.jsx";
import { useState } from "react";
import ListofFriends from "./TabbedComponent/ListofFriends.jsx";
import { useEffect } from "react";
import { getSocket } from "../../utils/socket.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFriend,
  addFriendRequest,
  Unfriend,
  removeSentRequest,
  removeReceivedRequest,
} from "../../features/Auth/authSlice.js";
import { setOnlineUsers, addGameRequest, removeGameRequestsByUser } from "../../features/UI_Slice/UI_Slice.js";
import { addOneNotification } from "../../features/Notification/notificationSlice.js";

function Home() {
  const location = useLocation();
  const [activeTabLocal, setActiveTabLocal] = useState(
    location.state?.activeTab || "none"
  );
  const user = useSelector((state) => state.auth.user);
  const socket = getSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      socket.emit("user-loggedIn", user._id);
    }
  }, [socket, user?._id]);

  useEffect(() => {
    const handleFriendRequest = (data) => {
      dispatch(addFriendRequest(data.senderId));
    };

    const handleNewFriend = (data) => {
      console.log(data.receiverId);
      dispatch(addFriend(data.receiverId));
    };

    const handleUnfriend = (data) => {
      console.log("unfriend", data);
      dispatch(Unfriend(data.userId));
    };
    const handleOnlineFriends = (onlineUsers) => {
      console.log("Friends", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    };

    const handleCancelFriendRequest = (data) => {
      dispatch(removeReceivedRequest(data.senderId));
    };

    const handleRejectFriendRequest = (data) => {
      dispatch(removeSentRequest(data.receiverId));
    };

    socket.on("friend-request", handleFriendRequest);
    socket.on("new-friend", handleNewFriend);
    socket.on("unfriend", handleUnfriend);
    socket.on("online-users", handleOnlineFriends);
    socket.on("cancel-friend-request", handleCancelFriendRequest);
    socket.on("reject-friend-request", handleRejectFriendRequest);

    // 🎮 Incoming game request from another user
    const handleGameRequest = (data) => {
      dispatch(addGameRequest(data));
    };
    socket.on("game-request", handleGameRequest);

    // ✅ The other user accepted our game request — take us to the lobby
    const handleGameRequestAccepted = (data) => {
      navigate("/lobby", {
        state: {
          opponent: data.byUser,
          isHost: true,
        },
      });
    };
    socket.on("game-request-accepted", handleGameRequestAccepted);

    // ❌ Opponent (host) left the lobby before guest accepted — remove their pending request
    const handleOpponentLeftLobby = ({ wasHost, leavingUserId }) => {
      if (wasHost) {
        // The host (original sender) cancelled — clear their game request from our list
        dispatch(removeGameRequestsByUser(leavingUserId));
      }
    };
    socket.on("opponent-left-lobby", handleOpponentLeftLobby);

    return () => {
      socket.off("friend-request", handleFriendRequest);
      socket.off("new-friend", handleNewFriend);
      socket.off("unfriend", handleUnfriend);
      socket.off("online-users", handleOnlineFriends);
      socket.off("cancel-friend-request", handleCancelFriendRequest);
      socket.off("reject-friend-request", handleRejectFriendRequest);
      socket.off("game-request", handleGameRequest);
      socket.off("game-request-accepted", handleGameRequestAccepted);
      socket.off("opponent-left-lobby", handleOpponentLeftLobby);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const handleNotification = (notification) => {
      console.log("Real-time notification received:", notification);
      dispatch(addOneNotification(notification));
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTabLocal(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <div className="flex-1 bg-[#f5f6f7] dark:bg-slate-900 pb-4 overflow-y-auto flex flex-col transition-colors duration-300">
      {/* Header Navigation */}
      <TopNavigation setActiveTabLocal={setActiveTabLocal} />

      {activeTabLocal === "none" && <TopPlayers />}
      {activeTabLocal === "List_of_Friends" && <ListofFriends />}
      {activeTabLocal === "Game_Requests" && <GameRequests />}
      {activeTabLocal === "Game_History" && <GameHistory />}
      {activeTabLocal === "Online_Users" && <OnlineUsers />}
      {activeTabLocal === "Friend_Request" && <FriendRequest />}
    </div>
  );
}

export default Home;
