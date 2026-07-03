import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMarkNotificationsRead } from "../../hooks/useMarkNotificationsRead";
import { UserPlus, CheckCircle2, Gamepad2, RefreshCw, CheckCheck, Search, Calendar } from "lucide-react";
import { markAllNotificationsRead } from "../../features/Notification/notificationSlice";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  };
  return date.toLocaleDateString('en-US', options);
};

function NotificationDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { markAllRead } = useMarkNotificationsRead();

  const notifications = useSelector((state) => state.notification.notifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    const sender = notification.sender || {};
    const senderName = sender.firstName
      ? `${sender.firstName} ${sender.lastName || ""}`.trim()
      : sender.username || "Someone";
    
    const matchesSearch = senderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const notificationDate = new Date(notification.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") matchesDate = diffDays === 0;
      else if (dateFilter === "week") matchesDate = diffDays <= 7;
      else if (dateFilter === "month") matchesDate = diffDays <= 30;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleMarkAll = () => {
    markAllRead();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAllNotificationsRead());
    }
    
    if (notification.type === "friend_request") {
      navigate("/", { state: { activeTab: "Friend_Request" } });
    } else if (notification.type === "Game_request") {
      navigate("/", { state: { activeTab: "Game_Requests" } });
    } else if (notification.type === "friend_accept") {
      navigate("/", { state: { activeTab: "List_of_Friends" } });
    }
  };

  const getNotificationTitle = (notification) => {
    const sender = notification.sender || {};
    const senderName = sender.firstName
      ? `${sender.firstName} ${sender.lastName || ""}`.trim()
      : sender.username || "Someone";

    if (notification.type === "friend_request") {
      return "Friend Request";
    } else if (notification.type === "friend_accept") {
      return "Friend Request Accepted";
    } else if (notification.type === "Game_request") {
      return "Game Request";
    }
    return "Notification";
  };

  const getNotificationDescription = (notification) => {
    const sender = notification.sender || {};
    const senderName = sender.firstName
      ? `${sender.firstName} ${sender.lastName || ""}`.trim()
      : sender.username || "Someone";

    if (notification.type === "friend_request") {
      return `${senderName} sent you a friend request`;
    } else if (notification.type === "friend_accept") {
      return `${senderName} accepted your friend request`;
    } else if (notification.type === "Game_request") {
      return `${senderName} requested a game match`;
    }
    return "New notification";
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] dark:bg-slate-900 p-6">
      <div className="w-full  mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Monitor and manage notifications
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                <CheckCheck size={16} />
                Mark All
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-6">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                Date
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="friend_request">Friend Request</option>
                <option value="friend_accept">Friend Accepted</option>
                <option value="Game_request">Game Request</option>
              </select>
            </div>
            <div className="flex-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 dark:text-slate-400">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.isRead ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {getNotificationTitle(notification)}
                  </h3>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
                <p className="text-gray-600 dark:text-slate-300 text-sm mb-3">
                  {getNotificationDescription(notification)}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
                  <Calendar size={14} />
                  <span>{formatDateTime(notification.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationDetail;
