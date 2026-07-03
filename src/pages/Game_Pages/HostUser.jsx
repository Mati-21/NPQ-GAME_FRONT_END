import { Swords } from "lucide-react";
import { useState } from "react";
import { connectSocket, getSocket } from "../../utils/socket";
import toast from "react-hot-toast";

/**
 * HostUser — "My Block"
 *
 * Shows the CURRENT USER's guesses and the responses the opponent gave back.
 * Provides the guess input when it is the current user's turn to guess.
 */
function HostUser({
  currentUser,
  opponent,
  gameId,
  gameState,
  guesses = [],
  responses = [],
  viewOnly = false,
}) {
  const [guess, setGuess] = useState("");
  const socket = getSocket() || connectSocket();

  const myId = String(currentUser?._id || "");
  const isMyGuessTurn =
    !viewOnly &&
    gameState?.phase === "guess" &&
    String(gameState?.currentTurn || "") === myId;

  const handleGuessChange = (val) => {
    const digits = val.replace(/\D/g, "");
    let unique = "";
    for (let char of digits) {
      if (!unique.includes(char)) {
        unique += char;
      }
    }
    setGuess(unique.slice(0, 4));
  };

  const handleSubmit = () => {
    if (!gameId || !myId || !guess.trim()) return;
    if (gameState?.winnerId) {
      toast.error("The game already ended.");
      return;
    }
    if (!socket) {
      toast.error("Connection is not ready yet.");
      return;
    }
    if (!isMyGuessTurn) {
      toast.error("Wait for your turn to guess.");
      return;
    }
    if (guess.length !== 4) {
      toast.error("Guess must be exactly 4 unique digits.");
      return;
    }
    socket.emit("submit-guess", {
      gameId,
      playerId: currentUser._id,
      guess: guess.trim(),
    });
    setGuess("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // ── Build guess table: only MY guesses, paired with the opponent's response ──
  const myGuesses = guesses.filter((g) => String(g.playerId) === myId);

  const guessRows = myGuesses.map((entry) => {
    // The opponent responded to my guess — forPlayerId === myId
    const matchingResponse = responses.find(
      (r) => r.forPlayerId === myId && r.guess === entry.guess
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
            My Block
          </span>
          <h2 className="text-lg font-bold text-gray-900 leading-none">
            {currentUser?.username || "You"}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-gray-400">
            {myGuesses.length} guess{myGuesses.length !== 1 ? "es" : ""}
          </span>
          {/* Turn indicator */}
          {!isGameOver && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                isMyGuessTurn
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {isMyGuessTurn ? "Your Turn" : "Waiting"}
            </span>
          )}
        </div>
      </div>

      {/* Guesses Table */}
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

      {/* Action Footer — shown only when it's my guess turn */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        {isMyGuessTurn && !isGameOver ? (
          <div className="flex gap-2">
            <div className="flex-1 relative flex items-center">
              <span className="absolute left-3 text-gray-400 text-xs font-bold">@</span>
              <input
                type="text"
                value={guess}
                onChange={(e) => handleGuessChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your guess"
                className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                autoFocus
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!guess.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Swords size={14} />
              Guess
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-1.5 text-xs font-semibold text-gray-400">
            {isGameOver
              ? "Game over"
              : gameState?.phase === "response" &&
                String(gameState?.currentTurn) === myId
              ? "Give your response in the opponent block →"
              : "Waiting for opponent…"}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostUser;
