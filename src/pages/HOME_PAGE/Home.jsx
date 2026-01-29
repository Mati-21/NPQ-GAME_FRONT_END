// import { useState } from "react";

import { users } from "../../MockData/Mockdata.js";
// import { useSelector } from "react-redux";
import TopPlayers from "./Top_Players/TopPlayers.jsx";
import GameHistory from "./TabbedComponent/GameHistory.jsx";
import OnlineUsers from "./TabbedComponent/OnlineUsers.jsx";
import FriendRequest from "./TabbedComponent/FriendRequest.jsx";
import PlayWithFriend from "./TabbedComponent/PlayWithFriend.jsx";
import TopNavigation from "./TopNavigation/TopNavigation.jsx";
import { useState } from "react";

function Home() {
  const [activeTabLocal, setActiveTabLocal] = useState("none");

  return (
    <div className="flex-1 bg-white-background pb-10 overflow-y-auto">
      {/* Header Navigation */}
      <TopNavigation setActiveTabLocal={setActiveTabLocal} />

      {activeTabLocal === "none" && <TopPlayers />}
      {activeTabLocal === "play_With_Friend" && <PlayWithFriend />}
      {activeTabLocal === "Game_History" && <GameHistory />}
      {activeTabLocal === "Online_Users" && <OnlineUsers />}
      {activeTabLocal === "Friend_Request" && <FriendRequest />}
    </div>
  );
}

export default Home;
