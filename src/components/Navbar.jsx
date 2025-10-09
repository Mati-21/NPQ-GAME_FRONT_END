import { SunMedium } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="w-screen px-20 text-white bg-purple-secondary shadow-xl p-3 ">
      {/* container */}
      <div className="flex justify-between">
        {/* logo */}
        <Link to="/" className="cursor-pointer">
          <h1 className="text-2xl font-semibold font-lobster tracking-wider">
            NPQ
          </h1>
        </Link>
        {/* Right */}
        <div className="flex items-center justify-center gap-4">
          {pathname === "/login" && (
            <Link
              to="/register"
              className=" bg-[#5959B3] px-8 py-1 rounded-full font-semibold"
            >
              Join us
            </Link>
          )}
          {(pathname === "/register" || pathname === "/") && (
            <Link
              to="/login"
              className="bg-[#5959B3] px-8 py-1 rounded-full font-semibold"
            >
              Sign in
            </Link>
          )}

          <SunMedium size={30} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
