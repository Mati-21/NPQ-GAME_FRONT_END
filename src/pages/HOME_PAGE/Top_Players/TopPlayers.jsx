import { useState, useEffect } from "react";
import { fetchTopPlayers } from "../../../api/user.api";
import { Trophy, Medal } from "lucide-react";

const RANK_STYLES = [
  { bg: "bg-amber-400",    text: "text-white", label: "🥇" },
  { bg: "bg-gray-400",     text: "text-white", label: "🥈" },
  { bg: "bg-amber-700",    text: "text-white", label: "🥉" },
  { bg: "bg-purple-100",   text: "text-purple-700", label: "4" },
  { bg: "bg-purple-100",   text: "text-purple-700", label: "5" },
];

function TopPlayers() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const data = await fetchTopPlayers();
        setTopPlayers(data || []);
      } catch (err) {
        console.error("Error fetching top players:", err);
      } finally {
        setLoading(false);
      }
    };
    getPlayers();
  }, []);

  if (loading) {
    return (
      <div className="px-14 mt-8 space-y-3">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (topPlayers.length === 0) {
    return (
      <div className="px-14 mt-10 flex flex-col items-center gap-3 text-center">
        <Trophy size={48} className="text-gray-300 dark:text-slate-600" />
        <h2 className="text-2xl font-semibold text-gray-400 dark:text-slate-500">No Rankings Yet</h2>
        <p className="text-gray-400 dark:text-slate-500 text-sm max-w-xs">
          Complete games to earn points and appear on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="px-14 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Trophy size={26} className="text-amber-500" />
        <h1 className="text-2xl font-bold tracking-wide text-gray-900">
          Top Players
        </h1>
      </div>

      <div className="space-y-3">
        {topPlayers.map((user, index) => {
          const rank = RANK_STYLES[index] || RANK_STYLES[4];
          const displayName =
            user.firstName
              ? `${user.firstName} ${user.lastName || ""}`.trim()
              : user.username;
          const initials = displayName.charAt(0).toUpperCase();

          return (
            <div
              key={user._id}
              className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Rank badge */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${rank.bg} ${rank.text}`}
              >
                {rank.label}
              </div>

              {/* Avatar */}
              <div className="w-11 h-11 rounded-full overflow-hidden bg-black text-purple-secondary flex items-center justify-center font-semibold text-lg shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-slate-100 truncate">{displayName}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 truncate">@{user.username}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm shrink-0">
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-slate-500">W / L</p>
                  <p className="font-semibold text-gray-700 dark:text-slate-300">
                    {user.stats?.wins ?? 0} / {user.stats?.losses ?? 0}
                  </p>
                </div>
                <div
                  className={`px-4 py-1.5 rounded-full font-bold text-sm ${
                    index === 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {user.stats?.points ?? 0} pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopPlayers;
