import { useLocation, useNavigate, useBlocker } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Clock, Play, Users, Timer, Eye, LogOut, UserX } from "lucide-react";
import { getSocket } from "../../utils/socket";
import toast from "react-hot-toast";

function LobbyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const socket = getSocket();

  const { opponent, isHost } = location.state || {};

  const [secretNumber, setSecretNumber] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [guessingTimer, setGuessingTimer] = useState(3);   // minutes
  const [responseTimer, setResponseTimer] = useState(3);   // minutes
  const [autoCheck, setAutoCheck] = useState(false);

  // Track whether opponent is currently in the lobby.
  // Host arrives first so the guest is NOT in yet; guest arrives second so the host IS already there.
  const [opponentInLobby, setOpponentInLobby] = useState(!isHost);

  // Used to allow intentional navigations (Exit Lobby, Game Start) past the blocker
  const exitingRef = useRef(false);

  // ── Block ALL router navigation unless we are intentionally exiting ──
  // This prevents back-button, link clicks, or accidental navigation away.
  useBlocker(() => !exitingRef.current);

  // ── Also block browser refresh / tab close ──
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ── Announce entry to the lobby so the server can:
  //    1) replay the opponent's ready state if they locked in before us
  //    2) notify the opponent that we have arrived
  useEffect(() => {
    if (opponent?._id) {
      socket.emit("join-lobby", { opponentId: opponent._id });
    }
  }, [socket, opponent]);

  // ── Listen for lobby lifecycle + game start events ──
  useEffect(() => {
    const handleOpponentReady = () => setOpponentReady(true);
    const handleOpponentNotReady = () => setOpponentReady(false);

    const handleOpponentJoined = () => {
      setOpponentInLobby(true);
      toast.success(`${opponent?.username || "Opponent"} joined the lobby!`);
    };

    const handleOpponentLeft = ({ wasHost: opponentWasHost }) => {
      setOpponentInLobby(false);
      setOpponentReady(false);
      toast.error(
        `${opponent?.username || "Opponent"} left the lobby.`,
        { duration: 4000 }
      );
      // If the host left we also clear their ready lock so the Start button stays disabled
    };

    /**
     * Both host AND guest navigate here — removes the race condition
     * where the host navigated immediately before the server confirmed.
     */
    const handleGameStarted = ({
      gameId,
      opponentId,
      role,
      currentTurn,
      phase,
      guessingTimer: gt,
      responseTimer: rt,
      autoCheck: ac,
    }) => {
      // Allow navigation to the game page
      exitingRef.current = true;
      navigate("/Game", {
        state: {
          gameId,
          opponent: opponent || { _id: opponentId },
          isHost: role === "host",
          secretNumber,
          initCurrentTurn: currentTurn,
          initPhase: phase || "guess",
          initGuessingTimer: gt || 3,
          initResponseTimer: rt || 3,
          initAutoCheck: ac || false,
        },
      });
    };

    socket.on("opponent-ready", handleOpponentReady);
    socket.on("opponent-not-ready", handleOpponentNotReady);
    socket.on("opponent-joined-lobby", handleOpponentJoined);
    socket.on("opponent-left-lobby", handleOpponentLeft);
    socket.on("game-session-started", handleGameStarted);

    return () => {
      socket.off("opponent-ready", handleOpponentReady);
      socket.off("opponent-not-ready", handleOpponentNotReady);
      socket.off("opponent-joined-lobby", handleOpponentJoined);
      socket.off("opponent-left-lobby", handleOpponentLeft);
      socket.off("game-session-started", handleGameStarted);
    };
  }, [socket, opponent, secretNumber, navigate]);

  // ── Exit Lobby — the ONLY sanctioned way to leave this page ──
  const handleExitLobby = () => {
    if (opponent?._id) {
      socket.emit("leave-lobby", { opponentId: opponent._id, isHost });
    }
    exitingRef.current = true;
    navigate("/");
  };

  const handleSecretChange = (val) => {
    const digits = val.replace(/\D/g, "");
    let unique = "";
    for (let char of digits) {
      if (!unique.includes(char)) unique += char;
    }
    setSecretNumber(unique.slice(0, 4));
  };

  const handleReady = () => {
    if (!secretNumber || secretNumber.length !== 4) {
      toast.error("Secret number must be exactly 4 unique digits.");
      return;
    }
    setIsReady(true);
    if (opponent?._id) {
      socket.emit("player-ready", { toUserId: opponent._id });
    }
  };

  const handleUnlock = () => {
    setIsReady(false);
    if (opponent?._id) {
      socket.emit("player-not-ready", { toUserId: opponent._id });
    }
  };

  /**
   * Host clicks "Start Game" — emit to server only.
   * Navigation happens inside the game-session-started handler above.
   */
  const handleStartGame = () => {
    if (!secretNumber || secretNumber.length !== 4) {
      toast.error("Choose a valid secret number (4 unique digits) before starting.");
      return;
    }
    if (!isReady) {
      toast.error("Lock in your secret number first.");
      return;
    }
    if (!opponentReady) {
      toast.error("Waiting for your opponent to lock in.");
      return;
    }
    socket.emit("start-game-session", {
      hostId: currentUser?._id,
      guestId: opponent?._id,
      secretNumber,
      guessingTimer: Number(guessingTimer) || 3,
      responseTimer: Number(responseTimer) || 3,
      autoCheck: autoCheck,
    });
  };

  // ── Build player list ──
  const players = [
    {
      id: currentUser?._id,
      username: currentUser?.username,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      avatar: currentUser?.avatar,
      isYou: true,
      isHost,
      ready: isReady,
      inLobby: true,
      subtitle: isHost
        ? isReady ? "Locked in · Host" : "Host · setting the round"
        : isReady ? "Locked in" : "Choosing a number…",
    },
    opponent
      ? {
          id: opponent._id,
          username: opponent.username,
          firstName: opponent.firstName,
          lastName: opponent.lastName,
          avatar: opponent.avatar,
          isYou: false,
          isHost: !isHost,
          ready: opponentReady,
          inLobby: opponentInLobby,
          subtitle: !opponentInLobby
            ? "Not joined"
            : opponentReady
              ? "Locked in"
              : "Choosing a number…",
        }
      : null,
  ].filter(Boolean);

  const readyCount = players.filter((p) => p.ready).length;
  const totalCount = players.length;

  const getInitials = (p) =>
    p.firstName && p.lastName
      ? `${p.firstName[0]}${p.lastName[0]}`.toUpperCase()
      : p.username?.slice(0, 2).toUpperCase();

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-gray-50 min-h-0 overflow-auto p-3 sm:p-4 md:p-6 gap-4 md:gap-5">
      {/* ─── LEFT: Players Panel ─── */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            <Users size={13} />
            Players
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-900">
              {totalCount}{" "}
              <span className="text-base font-normal text-gray-400">/ 2 in the room</span>
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {readyCount}/{totalCount}
              </p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Ready
              </p>
            </div>
          </div>
        </div>

        {/* Player list */}
        <div className="flex-1 px-4 py-4 flex flex-col gap-2">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
                !player.inLobby
                  ? "border-dashed border-gray-200 bg-gray-50 opacity-60"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-semibold text-gray-300 w-5 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden">
                {player.avatar ? (
                  <img
                    src={player.avatar}
                    alt={player.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(player)
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {player.firstName
                      ? `${player.firstName} ${player.lastName || ""}`.trim()
                      : player.username}
                  </span>
                  {player.isYou && (
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 uppercase tracking-wide">
                      YOU
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{player.subtitle}</p>
              </div>

              {/* Status badge */}
              {!player.inLobby ? (
                <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                  <UserX size={11} />
                  Not Joined
                </span>
              ) : player.ready ? (
                <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Ready
                </span>
              ) : player.isHost ? (
                <span className="shrink-0 text-xs font-semibold text-white bg-blue-600 rounded-full px-3 py-1">
                  Host
                </span>
              ) : (
                <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                  <Clock size={11} />
                  Waiting
                </span>
              )}
            </div>
          ))}

          {totalCount < 2 && (
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 px-4 py-3">
              <span className="text-xs font-semibold text-gray-200 w-5 shrink-0">
                {String(totalCount + 1).padStart(2, "0")}
              </span>
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                +
              </div>
              <p className="text-sm text-gray-400">Open seat — waiting for opponent</p>
            </div>
          )}
        </div>

        {/* ─── Exit Lobby button at the bottom of the player panel ─── */}
        <div className="px-4 pb-4">
          <button
            onClick={handleExitLobby}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm transition cursor-pointer"
          >
            <LogOut size={14} />
            Exit Lobby
          </button>
        </div>
      </div>

      {/* ─── RIGHT: Round Setup Panel ─── */}
      <div className="w-full md:w-80 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
        {/* Panel header */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            <Timer size={13} />
            Round Setup
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your move</h2>
        </div>

        <div className="flex-1 flex flex-col gap-5 px-6 py-5">
          {/* Guessing Timer (Host Only) */}
          {isHost && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Guessing Timer
                </label>
                <span className="text-xs text-gray-400">minutes per turn</span>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                <Clock size={15} className="text-gray-400 shrink-0" />
                <input
                  type="number"
                  value={guessingTimer}
                  min="1"
                  max="10"
                  onChange={(e) => setGuessingTimer(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                />
                <span className="text-xs font-semibold text-gray-400">MIN</span>
              </div>
            </div>
          )}

          {/* Response Timer (Host Only) */}
          {isHost && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Response Timer
                </label>
                <span className="text-xs text-gray-400">minutes per turn</span>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50">
                <Clock size={15} className="text-gray-400 shrink-0" />
                <input
                  type="number"
                  value={responseTimer}
                  min="1"
                  max="10"
                  onChange={(e) => setResponseTimer(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                />
                <span className="text-xs font-semibold text-gray-400">MIN</span>
              </div>
            </div>
          )}

          {/* Secret Number */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Secret Number
              </label>
              <span className="text-xs text-gray-400">only you can see this</span>
            </div>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secretNumber}
                onChange={(e) => handleSecretChange(e.target.value)}
                placeholder="• • • •"
                disabled={isReady}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <Eye size={15} />
              </button>
            </div>
          </div>

          {/* Automatic Check Toggle (Host Only) */}
          {isHost && (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Automatic check</p>
                <p className="text-xs text-gray-400">Reveal on every guess</p>
              </div>
              <button
                onClick={() => setAutoCheck((v) => !v)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                  autoCheck ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    autoCheck ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          {isHost ? (
            /* HOST: Start Game button (enabled only when both are ready) */
            <button
              onClick={handleStartGame}
              disabled={!isReady || !opponentReady || !opponentInLobby}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Play size={15} className="fill-white" />
              Start Game
            </button>
          ) : isReady ? (
            /* GUEST locked in */
            <div className="flex flex-col gap-2">
              <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 border border-green-200 text-green-600 font-bold text-sm">
                ✓ Locked In — waiting for host
              </div>
              <button
                onClick={handleUnlock}
                className="w-full py-2 text-xs font-semibold border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Edit Secret Number
              </button>
            </div>
          ) : (
            /* GUEST not yet locked in */
            <button
              onClick={handleReady}
              disabled={!secretNumber}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Lock In &amp; Ready
            </button>
          )}

          {/* HOST: secondary Lock In button */}
          {isHost &&
            (!isReady ? (
              <button
                onClick={handleReady}
                disabled={!secretNumber}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Clock size={14} />
                Lock In My Number
              </button>
            ) : (
              <div className="flex flex-col gap-1.5 items-center">
                <p className="text-center text-xs text-gray-400">
                  ✓ Your number is locked.{" "}
                  {!opponentInLobby
                    ? "Waiting for opponent to join…"
                    : opponentReady
                      ? "Both ready — start when you want!"
                      : "Waiting for opponent…"}
                </p>
                <button
                  onClick={handleUnlock}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Edit Secret Number
                </button>
              </div>
            ))}

          {isHost && (
            <p className="text-center text-xs text-gray-400 mt-1">
              Host starts the round when all players are ready.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LobbyPage;
