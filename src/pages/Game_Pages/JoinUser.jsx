import { Check } from "lucide-react";
import { useState } from "react";
import { connectSocket, getSocket } from "../../utils/socket";
import toast from "react-hot-toast";

/**
 * JoinUser — "Opponent Block"
 *
 * Shows the OPPONENT's guesses and the responses the current user gave.
 * Provides the P/Q response input when it is the current user's turn to respond.
 */
function JoinUser({
  currentUser,
  opponent,
  gameId,
  gameState,
  guesses = [],
  responses = [],
}) {
  const [place, setPlace] = useState("");
  const [quantity, setQuantity] = useState("");
  const socket = getSocket() || connectSocket();

  const myId = String(currentUser?._id || "");
  const opponentId = String(opponent?._id || "");

  const isMyResponseTurn =
    gameState?.phase === "response" &&
    String(gameState?.currentTurn || "") === myId;

  // The latest guess made by the opponent (the one I need to respond to)
  const opponentGuesses = guesses.filter((g) => String(g.playerId) === opponentId);
  const latestOpponentGuess = opponentGuesses[opponentGuesses.length - 1]?.guess || "";

  const handleSubmit = () => {
    if (!gameId || !myId) return;
    if (gameState?.winnerId) return;
    if (!isMyResponseTurn) {
      toast.error("It's not your turn to respond.");
      return;
    }
    if (!socket) return;
    if (place === "" || quantity === "") {
      toast.error("Enter both Place and Quantity.");
      return;
    }

    socket.emit("submit-response", {
      gameId,
      playerId: currentUser._id,
      place: Number(place),
      qty: Number(quantity),
    });
    setPlace("");
    setQuantity("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ── Build opponent's guess table: their guesses + my responses ──
  const guessRows = opponentGuesses.map((entry) => {
    // I responded to their guess — responderId === myId, forPlayerId === opponentId
    const matchingResponse = responses.find(
      (r) =>
        String(r.responderId) === myId &&
        r.forPlayerId === opponentId &&
        r.guess === entry.guess
    );
    return {
      guess: entry.guess,
      place: matchingResponse?.place ?? "",
      qty: matchingResponse?.qty ?? "",
    };
  });

  const isGameOver = Boolean(gameState?.winnerId || gameState?.loserId);

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-1">
            Opponent Block
          </span>
          <h2 className="text-lg font-bold text-gray-900 leading-none">
            {opponent?.username || "Opponent"}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-gray-400">
            {opponentGuesses.length} guess{opponentGuesses.length !== 1 ? "es" : ""}
          </span>
          {/* Turn indicator */}
          {!isGameOver && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                isMyResponseTurn
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {isMyResponseTurn ? "Respond Now" : "Waiting"}
            </span>
          )}
        </div>
      </div>

      {/* Opponent's Guesses Table */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {guessRows.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-300 font-semibold">
            No guesses yet
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Guess
                </th>
                <th className="pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  Place
                </th>
                <th className="pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {guessRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="py-2.5 text-sm font-semibold text-gray-800 tracking-wider">
                    {row.guess}
                  </td>
                  <td className="py-2.5 text-sm font-bold text-indigo-600 text-center">
                    {row.place !== "" ? row.place : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-2.5 text-sm font-bold text-gray-600 text-right pr-2">
                    {row.qty !== "" ? row.qty : <span className="text-gray-200">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Action Footer — shown only when it's my response turn */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        {isMyResponseTurn && !isGameOver ? (
          <div className="flex items-center gap-2">
            {/* Show the guess being responded to */}
            <div className="w-24 relative flex items-center">
              <input
                type="text"
                readOnly
                value={latestOpponentGuess}
                placeholder="No."
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-600 outline-none cursor-not-allowed text-center"
              />
            </div>

            {/* Place input */}
            <div className="flex-1">
              <input
                type="number"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="P"
                min="0"
                max="4"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-center"
                autoFocus
              />
            </div>

            {/* Quantity input */}
            <div className="flex-1">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Q"
                min="0"
                max="4"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-center"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={place === "" || quantity === ""}
              className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition shadow-sm cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check size={14} className="stroke-[3px]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-1.5 text-xs font-semibold text-gray-400">
            {isGameOver
              ? "Game over"
              : gameState?.phase === "guess" &&
                String(gameState?.currentTurn) === myId
              ? "← Make your guess in your block"
              : "Waiting for opponent…"}
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinUser;
