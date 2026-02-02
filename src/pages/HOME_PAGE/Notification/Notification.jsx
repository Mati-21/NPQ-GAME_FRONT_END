import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeNotificationModal } from "../../../features/UI_Slice/UI_Slice";

function Notification({ searchedUsers = [] }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(closeNotificationModal());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div
      ref={modalRef}
      className="absolute top-[120%] right-0 shadow-lg  rounded-md p-4 z-50 bg-white max-h-96 overflow-y-auto flex flex-col gap-2 w-96"
      onClick={(e) => e.stopPropagation()} // 🔥 key line
    >
      {searchedUsers.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No New Notification</p>
      ) : (
        searchedUsers.map((searchedUser, index) => (
          <div key={index} className="flex justify-between items-center">
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

export default Notification;
