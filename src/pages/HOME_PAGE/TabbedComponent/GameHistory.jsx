import { useEffect, useState } from "react";
import axiosInstance from "../../../app/axios";

function GameHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await axiosInstance.get("/game/history");
        setHistory(data || []);
      } catch (error) {
        console.error("Failed to load game history", error);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="mx-14 py-4 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Game history</h3>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500">No completed games yet.</p>
      ) : (
        history.map((game) => {
          const players = game.players || [];
          const winner = game.winner?.username || "Unknown";
          const loser = game.loser?.username || "Unknown";
          return (
            <div
              key={game._id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {players.map((p) => p.username).join(" vs ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Winner: {winner} · Loser: {loser}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>
                    {game.reason === "resign" ? "Resignation" : "Correct guess"}
                  </p>
                  <p>+{game.pointsAwarded} pts</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default GameHistory;
