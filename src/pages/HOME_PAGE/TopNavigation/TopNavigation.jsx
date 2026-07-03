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
    <div className="relative w-full flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-8 md:px-12 py-3 gap-3 mt-2 sm:mt-4">
      {/* Tapped Components */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0 flex-nowrap">
        <div
          onClick={() => handleTabClick("List_of_Friends")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-purple-100 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap text-sm flex-shrink-0"
        >
          Friends
        </div>
        <div
          onClick={() => handleTabClick("Game_Requests")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-purple-100 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors duration-500 whitespace-nowrap text-sm flex-shrink-0"
        >
          Game Requests
        </div>
        <div
          onClick={() => handleTabClick("Game_History")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-purple-100 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap text-sm flex-shrink-0"
        >
          History
        </div>
        <div
          onClick={() => handleTabClick("Online_Users")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-purple-100 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap text-sm flex-shrink-0"
        >
          Online
        </div>
        <div
          onClick={() => handleTabClick("Friend_Request")}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-purple-100 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap text-sm flex-shrink-0"
        >
          Requests
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
