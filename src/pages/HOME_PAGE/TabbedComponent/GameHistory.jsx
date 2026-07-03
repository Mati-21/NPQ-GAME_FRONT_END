import { useEffect, useState } from "react";
import axiosInstance from "../../../app/axios";
import { useNavigate } from "react-router-dom";

function GameHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Game history</h3>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">No completed games yet.</p>
      ) : (
        history.map((game) => {
          const players = game.players || [];
          const winner = game.winner?.username || "Unknown";
          const loser = game.loser?.username || "Unknown";
          
          // Format day played
          const dayPlayed = new Date(game.createdAt || game.startedAt).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={game._id}
              onClick={() => navigate("/Game", { state: { viewOnly: true, historyGame: game } })}
              className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {players.map((p) => p.username).join(" vs ")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {game.isDraw ? (
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">Draw Game</span>
                    ) : (
                      <>Winner: <span className="font-bold text-green-600">{winner}</span> · Loser: <span className="font-bold text-red-500">{loser}</span></>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 font-medium">
                    Played on {dayPlayed}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-slate-400">
                  <p className="font-semibold text-gray-700 dark:text-slate-300 capitalize">
                    {game.reason === "resign" ? "Resignation" : game.reason === "timeout" ? "Timeout" : game.reason === "draw" ? "Draw" : "Guess"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">+{game.pointsAwarded} pts</p>
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
