import { Eye, EyeOff, ShieldAlert, Flag } from "lucide-react";
import { useState } from "react";
import { getSocket, connectSocket } from "../../utils/socket";

function GameDashboard({
  gameId,
  opponent,
  isHost,
  currentUser,
  gameState,
  secretNumber,
}) {
  const [show, setShow] = useState(false);
  const socket = getSocket();
  const [resigning, setResigning] = useState(false);

  const myId = String(currentUser?._id || "");
  const opponentId = String(opponent?._id || "");

  // ── Compute real stats from gameState ──
  const guesses = gameState?.guesses || [];
  const responses = gameState?.responses || [];

  const myGuessCount = guesses.filter((g) => String(g.playerId) === myId).length;
  const opponentGuessCount = guesses.filter((g) => String(g.playerId) === opponentId).length;

  // Best "place" value from responses given TO me (for my guesses)
  const myReceivedResponses = responses.filter((r) => r.forPlayerId === myId);
  const bestPlace =
    myReceivedResponses.length > 0
      ? Math.max(...myReceivedResponses.map((r) => r.place ?? 0))
      : "—";

  const handleResign = () => {
    if (!gameId || !currentUser?._id) return;
    const s = socket || connectSocket();
    if (!s) return;
    setResigning(true);
    s.emit("resign-game", { gameId, playerId: currentUser._id }, (ack) => {
      setResigning(false);
      if (!ack) return;
      if (!ack.success) {
        console.error("Resign failed:", ack.message);
      }
    });
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden">
      <div className="flex-1 flex flex-col gap-6 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <ShieldAlert size={14} />
            Secret Number
          </div>
          <button
            onClick={() => setShow((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Display Box */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Only visible to you
          </span>
          <div className="flex gap-2">
            {show ? (
              <span className="text-2xl font-bold tracking-widest text-gray-800">
                {secretNumber || "—"}
              </span>
            ) : (
              <div className="flex gap-3">
                <span className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
                <span className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
                <span className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
                <span className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Stats — live from gameState */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-white shadow-xs">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              My Guesses
            </span>
            <span className="text-sm font-bold text-gray-900">{myGuessCount}</span>
          </div>

          <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-white shadow-xs">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Opp. Guesses
            </span>
            <span className="text-sm font-bold text-gray-900">{opponentGuessCount}</span>
          </div>

          <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3 bg-white shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Best Place
            </span>
            <span className="text-sm font-bold text-blue-600">{bestPlace}</span>
          </div>
        </div>
      </div>

      {/* Resign Button */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleResign}
          disabled={resigning || Boolean(gameState?.winnerId)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Flag size={14} />
          {resigning ? "Resigning…" : "Resign Game"}
        </button>
      </div>
    </div>
  );
}

export default GameDashboard;
