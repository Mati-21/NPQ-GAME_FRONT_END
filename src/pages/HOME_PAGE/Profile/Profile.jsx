import { Calendar, MapPin } from "lucide-react";
import UserTimeline from "./UserTimeline";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { formatData } from "../../../utils/formatData";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const { isEditProfileOpen } = useSelector((state) => state.UI_Slice);

  const userJoinDate = formatData(user.createdAt);

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-auto min-h-0">
      {/* ── Sidebar ── */}
      <div className="w-full md:w-64 lg:w-72 shrink-0 bg-white dark:bg-slate-800 shadow-all flex flex-col">
        {/* Cover / Avatar */}
        <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
          <img
            src={user.avatar || "/user.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 w-full px-4 sm:px-6 pb-4 pt-4 overflow-y-auto scrollbar-custom dark:text-slate-100">
          <h2 className="font-semibold text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            Name
          </h2>
          <p className="text-sm font-medium border-b border-gray-200 dark:border-slate-600 pb-2">
            {user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "N/A"}
          </p>

          <h2 className="font-semibold text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mt-2">
            Email
          </h2>
          <p className="text-sm border-b border-gray-200 dark:border-slate-600 pb-2 break-all">
            {user.email || "N/A"}
          </p>

          <h2 className="font-semibold text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mt-2">
            About Me
          </h2>
          <p className="text-sm border-b border-gray-200 dark:border-slate-600 pb-2">
            {user.aboutMe || "N/A"}
          </p>

          <h2 className="font-semibold text-xs text-gray-400 dark:text-slate-400 uppercase tracking-wider mt-2">
            Bio
          </h2>
          <p className="text-sm border-b border-gray-200 dark:border-slate-600 pb-2">
            {user.bio || "N/A"}
          </p>

          <div className="flex items-center gap-2 mt-3 text-gray-600 dark:text-slate-300">
            <Calendar size={16} className="shrink-0" />
            <p className="text-xs font-semibold">
              Joined: {userJoinDate.month}-{userJoinDate.day}-{userJoinDate.year}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-slate-300">
            <MapPin size={16} className="shrink-0" />
            <p className="text-xs font-semibold">
              {user.location?.country || user.location?.region
                ? `${user.location.country || "N/A"}, ${user.location.region || "N/A"}`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content (timeline or edit) ── */}
      <div className="flex-1 min-w-0 overflow-auto">
        {isEditProfileOpen ? <EditProfile /> : <UserTimeline />}
      </div>
    </div>
  );
}

export default Profile;

