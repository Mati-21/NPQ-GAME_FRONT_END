// import { useState } from "react";

// import { useSelector } from "react-redux";
import TopPlayers from "./Top_Players/TopPlayers.jsx";
import GameHistory from "./TabbedComponent/GameHistory.jsx";
import OnlineUsers from "./TabbedComponent/OnlineUsers.jsx";
import FriendRequest from "./TabbedComponent/FriendRequest.jsx";
import PlayWithFriend from "./TabbedComponent/PlayWithFriend.jsx";
import TopNavigation from "./TopNavigation/TopNavigation.jsx";
import { useState } from "react";
import ListofFriends from "./TabbedComponent/ListofFriends.jsx";
import { useEffect } from "react";
import { getSocket } from "../../utils/socket.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addFriend,
  addFriendRequest,
  Unfriend,
} from "../../features/Auth/authSlice.js";

function Home() {
  const [activeTabLocal, setActiveTabLocal] = useState("none");
  const user = useSelector((state) => state.auth.user);
  const socket = getSocket();
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

    socket.on("friend-request", handleFriendRequest);
    socket.on("new-friend", handleNewFriend);
    socket.on("unfriend", handleUnfriend);

    return () => {
      socket.off("friend-request", handleFriendRequest);
      socket.off("new-friend", handleNewFriend);
      socket.off("unfriend", handleUnfriend);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const handleNotification = () => {

    };
    
    socket.on("friend-request", handleFriendRequest);
  }, [socket]);

  return (
    <div className="flex-1 bg-white-background pb-4 overflow-y-auto flex flex-col">
      {/* Header Navigation */}
      <TopNavigation setActiveTabLocal={setActiveTabLocal} />

      {activeTabLocal === "none" && <TopPlayers />}
      {activeTabLocal === "List_of_Friends" && <ListofFriends />}
      {activeTabLocal === "play_With_Friend" && <PlayWithFriend />}
      {activeTabLocal === "Game_History" && <GameHistory />}
      {activeTabLocal === "Online_Users" && <OnlineUsers />}
      {activeTabLocal === "Friend_Request" && <FriendRequest />}
    </div>
  );
}

export default Home;
