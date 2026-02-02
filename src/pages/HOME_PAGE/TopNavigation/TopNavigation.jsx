import { useRef, useState } from "react";
import SearchComponent from "../Search/SearchComponent";

function TopNavigation({ setActiveTabLocal }) {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const InpRef = useRef();

  const handleTabClick = (tabName) => {
    setSearchedUsers([]);
    setActiveTabLocal(tabName);
    CleanSearch();
  };

  const CleanSearch = () => {
    if (InpRef.current) {
      InpRef.current.value = "";
    }
  };

  return (
    <div className="relative w-full flex justify-between items-center 0  px-14 py-4  gap-4 mt-6">
      {/* Tapped Components */}
      <div className="flex gap-4">
        <div
          onClick={() => handleTabClick("play_With_Friend")}
          className="px-4 py-2 shadow-all rounded-full cursor-pointer hover:bg-purple-100 duration-500"
        >
          Play with a friend
        </div>
        <div
          onClick={() => handleTabClick("Game_History")}
          className="px-4 py-2 shadow-all rounded-full cursor-pointer hover:bg-purple-100"
        >
          Game History
        </div>
        <div
          onClick={() => handleTabClick("Online_Users")}
          className="px-4 py-2 shadow-all rounded-full cursor-pointer hover:bg-purple-100"
        >
          Online Users
        </div>
        <div
          onClick={() => handleTabClick("Friend_Request")}
          className="px-4 py-2 shadow-all rounded-full cursor-pointer hover:bg-purple-100"
        >
          Friend Request
        </div>
      </div>

      {/* Search Components  */}
      <SearchComponent
        searchedUsers={searchedUsers}
        setSearchedUsers={setSearchedUsers}
        InpRef={InpRef}
      />
    </div>
  );
}

export default TopNavigation;
