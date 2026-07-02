import { SunMedium, Moon, LogOut, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/authSlice";

import { disconnectSocket, getSocket } from "../utils/socket";
import {
  resetActiveTab,
  toggleNotificationModal,
} from "../features/UI_Slice/UI_Slice";
import Notification from "../pages/HOME_PAGE/Notification/Notification";

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
  const NotificationModal = useSelector(
    (state) => state.UI_Slice.NotificationModal,
  );

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
    <div className="w-screen px-20 bg-purple-secondary shadow-md p-3 text-white sticky top-0 z-50 bg-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          onClick={(event) => {
            dispatch(resetActiveTab());
            handleNavigationGuard(event);
          }}
          to="/"
          className="cursor-pointer"
        >
          <h1 className="text-2xl font-semibold font-inter tracking-widest text-black">
            NPQ
          </h1>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {!user ? (
            // NOT logged in
            <>
              {pathname === "/login" && (
                <Link
                  to="/register"
                  className="bg-[#5959B3] px-6 py-1 rounded-full font-semibold"
                >
                  Join us
                </Link>
              )}
              {(pathname === "/register" || pathname === "/") && (
                <Link
                  to="/login"
                  className="bg-white text-black shadow-md px-6 py-1 rounded-full font-bold"
                >
                  Sign in
                </Link>
              )}
              <SunMedium size={30} className="cursor-pointer text-black" />
            </>
          ) : (
            // LOGGED IN
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Link
                to="/profile"
                onClick={handleNavigationGuard}
                className="w-12 h-12 overflow-hidden shadow-all rounded-full bg-black text-purple-secondary flex items-center justify-center font-semibold"
              >
                <img
                  src={user.avatar || "/user.png"}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-col gap-0 text-black">
                <span className="font-medium">
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "N/A"}
                </span>
                <span className="text-xs text-gray-500">{user.username}</span>
              </div>

              {/* Notification */}
              <div
                onClick={() => dispatch(toggleNotificationModal())}
                className="relative cursor-pointer"
              >
                <Bell className="text-black" />
                <div className="absolute bottom-[60%] right-0  bg-red-500 size-4 rounded-full flex justify-center items-center text-xs text-white font-semibold">
                  2
                </div>
                {NotificationModal && <Notification />}
              </div>

              {/* Theme toggle */}
              <SunMedium size={30} className="cursor-pointer text-black" />

              {/* Logout */}
              <LogOut
                onClick={handleLogout}
                className="cursor-pointer text-black"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
