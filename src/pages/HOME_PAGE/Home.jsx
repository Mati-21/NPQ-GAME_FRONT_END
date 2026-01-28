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
  // const { activeTab } = useSelector((state) => state.UI_Slice);
  const [activeTab, setActiveTabLocal] = useState("none");

  const topPlayers = users.slice(0, 5); // top 5 users
  console.log(topPlayers);

  return (
    <div className="flex-1 bg-white-background pb-10 overflow-y-auto">
      {/* Header Navigation */}
      <TopNavigation setActiveTabLocal={setActiveTabLocal} />

      {activeTab === "none" && <TopPlayers />}
      {activeTab === "play_With_Friend" && <PlayWithFriend />}
      {activeTab === "Game_History" && <GameHistory />}
      {activeTab === "Online_Users" && <OnlineUsers />}
      {activeTab === "Friend_Request" && <FriendRequest />}
    </div>
  );
}

export default Home;
