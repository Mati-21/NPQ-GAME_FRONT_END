import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeNotificationModal } from "../../../features/UI_Slice/UI_Slice";
import { useMarkNotificationsRead } from "../../../hooks/useMarkNotificationsRead";
import { useNavigate } from "react-router-dom";
import { UserPlus, CheckCircle2, Gamepad2, CheckCheck } from "lucide-react";

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
};

function Notification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const notifications = useSelector((state) => state.notification.notifications);
  const { markAllRead, markOneRead } = useMarkNotificationsRead();

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

  const handleNotificationClick = (notification) => {
    // Close modal
    dispatch(closeNotificationModal());

    // Navigate to notification detail page
    navigate(`/notification/${notification._id}`);
  };

  const hasUnread = notifications.some((n) => !n.isRead);
  const recentNotifications = notifications.slice(0, 10);

  return (
    <div
      ref={modalRef}
      className="
        fixed right-2 left-2 top-16
        sm:absolute sm:left-auto sm:right-0 sm:top-[120%]
        shadow-2xl border border-gray-100 dark:border-slate-700 rounded-xl p-4 z-[999]
        bg-white dark:bg-slate-800 max-h-96 overflow-y-auto flex flex-col gap-2
        sm:w-96 text-black dark:text-white transition-all duration-300
      "
      onClick={(e) => e.stopPropagation()} // 🔥 key line
    >
      <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-700 mb-2">
        <h3 className="font-bold text-sm tracking-wider">Notifications</h3>
        {hasUnread && (
          <button
            onClick={() => markAllRead()}
            className="text-xs text-blue-500 hover:text-blue-650 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-6">No New Notifications</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {recentNotifications.map((notification) => {
            const sender = notification.sender || {};
            const senderName = sender.firstName
              ? `${sender.firstName} ${sender.lastName || ""}`.trim()
              : sender.username || "Someone";

            // Determine notification content based on type
            let icon = <UserPlus size={14} className="text-blue-500" />;
            let text = "sent you a friend request";
            if (notification.type === "friend_accept") {
              icon = <CheckCircle2 size={14} className="text-green-500" />;
              text = "accepted your friend request";
            } else if (notification.type === "Game_request") {
              icon = <Gamepad2 size={14} className="text-purple-500" />;
              text = "requested a game match";
            }

            return (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex gap-3 items-start p-2.5 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                  !notification.isRead ? "bg-blue-50/50 dark:bg-slate-700/30" : ""
                }`}
              >
                {/* Sender Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={sender.avatar || "/user.png"}
                    alt={sender.username}
                    className="w-9 h-9 rounded-full object-cover bg-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                    {icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-slate-200 leading-tight">
                    <span className="font-semibold text-gray-900 dark:text-white mr-1">
                      {senderName}
                    </span>
                    {text}
                  </p>
                  <span className="text-[10px] text-gray-400 dark:text-slate-400 mt-1 block">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>

                {/* Unread dot */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notification;
