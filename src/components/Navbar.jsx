import { SunMedium, Moon, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/authSlice";

import { disconnectSocket } from "../utils/socket";
import { resetActiveTab } from "../features/UI_Slice/UI_Slice";

function Navbar() {
  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // get logged-in user from redux
  const user = useSelector((state) => state.auth.user);

  // handle logout
  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-screen px-20 bg-purple-secondary shadow-md p-3 text-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          onClick={() => dispatch(resetActiveTab())}
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
                className="w-10 h-10 rounded-full bg-black text-purple-secondary flex items-center justify-center font-semibold"
              >
                {user.name ? user.name[0].toUpperCase() : "U"}
              </Link>
              <div className="flex flex-col gap-0 text-black">
                <span className="font-medium">{user.email}</span>
                <span className="text-xs">{user.username}</span>
              </div>

              {/* Logout */}
              <LogOut
                onClick={handleLogout}
                className="cursor-pointer text-black"
              />

              {/* Theme toggle */}
              <SunMedium size={30} className="cursor-pointer text-black" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
