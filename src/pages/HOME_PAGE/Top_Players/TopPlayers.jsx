import { useState, useEffect } from "react";
import { fetchTopPlayers } from "../../../api/user.api";

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
      <div className="px-14 mt-6">
        <h1 className="text-4xl font-semibold tracking-wider">Loading...</h1>
      </div>
    );
  }

  return topPlayers.length > 0 ? (
    <div className="px-14 mt-6">
      <h1 className="text-4xl font-semibold tracking-wider ">Top Players</h1>
      {topPlayers.map((user) => {
        const displayName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username;
        const displayLetter = (displayName || "").charAt(0).toUpperCase();

        return (
          <div
            key={user._id}
            className="mt-4 p-4 bg-white shadow-all rounded-lg flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-black text-purple-secondary flex items-center justify-center font-semibold text-lg">
              {displayLetter}
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{displayName}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-sm">
                {user.stats?.points || 0} pts
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="px-14 mt-6">
      <h1 className="text-4xl font-semibold tracking-tighter ">
        there is no player who has point yet
      </h1>
    </div>
  );
}

export default TopPlayers;

