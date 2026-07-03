import { SunMedium, Moon, LogOut, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/authSlice";
import { disconnectSocket, getSocket } from "../utils/socket";
import {
  resetActiveTab,
  toggleNotificationModal,
  toggleDarkMode,
} from "../features/UI_Slice/UI_Slice";
import Notification from "../pages/HOME_PAGE/Notification/Notification";
import { useNotifications } from "../hooks/useNotifications";

import { useLogout } from "../hooks/useLogout";
import toast from "react-hot-toast";

function Navbar() {
  const location = useLocation();
  const { pathname } = location;
  const { mutate: logoutS } = useLogout();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = getSocket();

  // get logged-in user from redux
  const user = useSelector((state) => state.auth.user);
  
  // Call hook to fetch and keep notifications in sync
  useNotifications();

  const notifications = useSelector((state) => state.notification.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const NotificationModal = useSelector(
    (state) => state.UI_Slice.NotificationModal,
  );
  const isDarkMode = useSelector((state) => state.UI_Slice.isDarkMode);

  const handleNavigationGuard = (event) => {
    const activeGameId = sessionStorage.getItem("activeGameId");
    if (pathname === "/Game" && activeGameId) {
      event.preventDefault();
      toast.error("Resign the game first if you want to leave this session.");
    }
  };

  // handle logout
  const handleLogout = () => {
    const activeGameId = sessionStorage.getItem("activeGameId");

    if (pathname === "/Game" && activeGameId && user?._id) {
      socket?.emit("resign-game", { gameId: activeGameId, playerId: user._id });
      toast.success("You resigned the active game. Logging out...");

      setTimeout(() => {
        logoutS();
        disconnectSocket();
        dispatch(logout());
        navigate("/login", { replace: true });
      }, 800);
      return;
    }

    logoutS();
    disconnectSocket();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-screen px-4 sm:px-8 md:px-12 bg-white dark:bg-slate-800 shadow-md py-2.5 text-white sticky top-0 z-50 border-b border-transparent dark:border-slate-700 transition-colors duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          onClick={(event) => {
            dispatch(resetActiveTab());
            handleNavigationGuard(event);
          }}
          to="/"
          className="cursor-pointer"
        >
          <h1 className="text-xl sm:text-2xl font-semibold font-inter tracking-widest text-black dark:text-white">
            NPQ
          </h1>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            // NOT logged in
            <>
              {pathname === "/login" && (
                <Link
                  to="/register"
                  className="bg-[#5959B3] text-white px-4 sm:px-6 py-1 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  Join us
                </Link>
              )}
              {(pathname === "/register" || pathname === "/") && (
                <Link
                  to="/login"
                  className="bg-white dark:bg-slate-700 text-black dark:text-white border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md px-4 sm:px-6 py-1 rounded-full font-bold transition-all text-sm"
                >
                  Sign in
                </Link>
              )}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="cursor-pointer text-black dark:text-white p-1"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <SunMedium size={22} /> : <Moon size={22} />}
              </button>
            </>
          ) : (
            // LOGGED IN
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Avatar */}
              <Link
                to="/profile"
                onClick={handleNavigationGuard}
                className="w-9 h-9 sm:w-11 sm:h-11 overflow-hidden shadow-all rounded-full bg-black text-purple-secondary flex items-center justify-center font-semibold shrink-0"
              >
                <img
                  src={user.avatar || "/user.png"}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </Link>

              {/* Name – hidden on xs screens */}
              <div className="hidden sm:flex flex-col gap-0 text-black dark:text-white">
                <span className="font-medium text-sm leading-tight">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "N/A"}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400">{user.username}</span>
              </div>

              {/* Notification */}
              <div
                onClick={() => dispatch(toggleNotificationModal())}
                className="relative cursor-pointer flex items-center justify-center p-1"
              >
                <Bell size={20} className="text-black dark:text-white" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 min-w-[16px] h-4 rounded-full flex justify-center items-center text-[10px] text-white font-semibold px-0.5">
                    {unreadCount}
                  </div>
                )}
                {NotificationModal && <Notification />}
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="cursor-pointer text-black dark:text-white p-1"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <SunMedium size={20} /> : <Moon size={20} />}
              </button>

              {/* Logout */}
              <LogOut
                size={20}
                onClick={handleLogout}
                className="cursor-pointer text-black dark:text-white p-0.5"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
