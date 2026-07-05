import { Eye, EyeOff, ShieldAlert, Flag, Trophy, RotateCcw, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket, connectSocket } from "../../utils/socket";

function GameDashboard({
  gameId,
  opponent,
  isHost,
  currentUser,
  gameState,
  secretNumber,
  viewOnly = false,
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState(viewOnly);
  const socket = getSocket();
  const [resigning, setResigning] = useState(false);
  const [showConfirmResign, setShowConfirmResign] = useState(false);

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
    if (s) {
      s.emit("resign-game", { gameId, playerId: currentUser._id });
    }
    sessionStorage.removeItem("activeGameId");
    navigate("/home");
  };

  const handleRematch = () => {
    navigate("/lobby", {
      state: {
        opponent,
        isHost,
      },
    });
  };

  const handleLeaveGame = () => {
    navigate("/home");
  };

  const isDraw = gameState?.isDraw;
  const isGameOver = Boolean(gameState?.winnerId || gameState?.loserId || isDraw);
  const isWinner = String(gameState?.winnerId) === myId;

  // Get last guess and response for display
  const lastGuess = guesses.length > 0 ? guesses[guesses.length - 1] : null;
  const lastResponse = lastGuess
    ? responses.find(r => r.guess === lastGuess.guess && r.forPlayerId === lastGuess.playerId)
    : null;

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex-1 flex flex-col gap-6 p-5 overflow-y-auto">
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
        {isGameOver ? (
          <div className={`${isDraw ? "bg-amber-50 border-2 border-amber-200" : isWinner ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"} rounded-xl p-6 flex flex-col items-center justify-center gap-3`}>
            <div className="flex items-center gap-2">
              <Trophy size={20} className={isDraw ? "text-amber-600" : isWinner ? "text-green-600" : "text-red-600"} />
              <span className={`text-sm font-bold uppercase tracking-widest ${isDraw ? "text-amber-700" : isWinner ? "text-green-700" : "text-red-700"}`}>
                {isDraw ? "Draw" : isWinner ? "Winner" : "Loser"}
              </span>
            </div>
            <div className="text-center">
              {isDraw ? (
                <span className="text-lg font-bold text-amber-700">The Game Endup Draw</span>
              ) : isWinner ? (
                <span className="text-lg font-bold text-green-700">Congratulations you won the game!</span>
              ) : (
                <span className="text-lg font-bold text-red-700">You Lost! Try harder next time</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <div className="flex gap-4 justify-center text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Total Guesses</span>
                  <span className={`font-bold ${isDraw ? "text-amber-700" : isWinner ? "text-green-700" : "text-red-700"}`}>{gameState?.totalGuesses || guesses.length}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Total Responses</span>
                  <span className={`font-bold ${isDraw ? "text-amber-700" : isWinner ? "text-green-700" : "text-red-700"}`}>{gameState?.totalResponses || responses.length}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}

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

      {/* Resign Button / Game Over Buttons */}
      {!viewOnly && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          {isGameOver ? (
            <div className="flex gap-2">
              <button
                onClick={handleRematch}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                <RotateCcw size={14} />
                Rematch
              </button>
              <button
                onClick={handleLeaveGame}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-100 transition cursor-pointer"
              >
                <Home size={14} />
                Leave Game
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmResign(true)}
              disabled={resigning}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag size={14} />
              {resigning ? "Resigning…" : "Resign Game"}
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal Overlay */}
      {showConfirmResign && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Resign Game?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to resign? You will immediately lose this round and forfeit points.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowConfirmResign(false)}
                className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResign}
                disabled={resigning}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
              >
                {resigning ? "Resigning..." : "Yes, Resign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameDashboard;
