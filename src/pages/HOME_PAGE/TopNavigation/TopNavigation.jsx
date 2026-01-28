import { Search } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { setActiveTab } from "../../../features/UI_Slice/UI_Slice";

function TopNavigation({ setActiveTabLocal }) {
  // const dispatch = useDispatch();

  const handleTabClick = (tabName) => {
    // dispatch(setActiveTab(tabName));
    setActiveTabLocal(tabName);
  };

  return (
    <div className=" w-full flex justify-between items-center bg-white-background  px-14 py-4  gap-4 mt-6">
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

      <div className="shadow-all white rounded-full py-2 w-sm outline-none px-6 text-black flex gap-2">
        <input
          type="text"
          className="flex-1 outline-none placeholder:text-sm placeholder:text-gray-500/50 "
          placeholder="Search for a user"
        />
        <Search className="cursor-pointer" />
      </div>
    </div>
  );
}

export default TopNavigation;
