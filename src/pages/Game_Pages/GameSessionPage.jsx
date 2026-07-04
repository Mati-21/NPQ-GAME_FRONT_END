import { ArrowLeft, Swords, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ChatComponent from "./ChatComponent";
import GameDashboard from "./GameDashboard";
import HostUser from "./HostUser";
import JoinUser from "./JoinUser";
import { connectSocket, getSocket } from "../../utils/socket";
import toast from "react-hot-toast";

/** Convert seconds to MM:SS display */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function GameSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.auth.user);
  const socket = getSocket() || connectSocket();
  const {
    gameId,
    opponent: initOpponent,
    isHost: initIsHost,
    secretNumber: initSecretNumber,
    initCurrentTurn,
    initPhase,
    initGuessingTimer,
    initResponseTimer,
    viewOnly,
    historyGame,
  } = location.state || {};

  const isHost = viewOnly ? (historyGame?.hostId === currentUser?._id) : initIsHost;
  const opponent = viewOnly ? historyGame?.players?.find(p => String(p._id) !== String(currentUser?._id)) : initOpponent;
  const secretNumber = viewOnly
    ? (isHost ? historyGame?.hostSecretNumber : historyGame?.guestSecretNumber)
    : (initIsHost ? initSecretNumber : "");

  // ── Game state ──
  const [gameState, setGameState] = useState(() => {
    if (viewOnly && historyGame) {
      return {
        winnerId: historyGame.winner,
        loserId: historyGame.loser,
        reason: historyGame.reason,
        pointsAwarded: historyGame.pointsAwarded,
        currentTurn: null,
        phase: "finished",
        guesses: historyGame.guesses || [],
        responses: historyGame.responses || [],
        guessingTimer: historyGame.guessingTimer || 3,
        responseTimer: historyGame.responseTimer || 3,
        autoCheck: historyGame.autoCheck || false,
        isDraw: historyGame.isDraw || false,
      };
    }
    return {
      winnerId: null,
      loserId: null,
      reason: null,
      pointsAwarded: 0,
      currentTurn: initCurrentTurn || null,
      phase: initPhase || "guess",
      latestResponse: null,
      guesses: [],
      responses: [],
      guessingTimer: initGuessingTimer || 3,
      responseTimer: initResponseTimer || 3,
      isDraw: false,
    };
  });

  // ── Active countdown in seconds ──
  // Only the player whose turn it is sees a ticking timer
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const isMyTurn =
    String(gameState.currentTurn || "") === String(currentUser?._id || "");

  // ── Determine the active timer duration in seconds ──
  const getTimerSeconds = (phase, gs) => {
    if (phase === "guess") return (gs.guessingTimer || 3) * 60;
    if (phase === "response") return (gs.responseTimer || 3) * 60;
    return null;
  };

  // ── Start / stop countdown ──
  useEffect(() => {
    // Clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isMyTurn || !gameState.currentTurn || gameState.winnerId) {
      setTimeLeft(null);
      return;
    }

    const duration = getTimerSeconds(gameState.phase, gameState);
    setTimeLeft(duration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          // Emit timer expired to server — forfeit
          if (socket && gameId && currentUser?._id) {
            socket.emit("timer-expired", {
              gameId,
              playerId: currentUser._id,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentTurn, gameState.phase, isMyTurn, gameState.winnerId]);

  // ── Register secret number on mount so server can check win ──
  useEffect(() => {
    if (viewOnly) return;
    if (!socket || !gameId || !currentUser?._id || !secretNumber) return;
    socket.emit("register-secret", {
      gameId,
      playerId: currentUser._id,
      secretNumber,
    });
  }, [socket, gameId, currentUser?._id, secretNumber, viewOnly]);

  // ── Persist active game id ──
  useEffect(() => {
    if (viewOnly) return;
    if (gameId) sessionStorage.setItem("activeGameId", gameId);
    return () => {
      if (sessionStorage.getItem("activeGameId") === gameId)
        sessionStorage.removeItem("activeGameId");
    };
  }, [gameId, viewOnly]);

  useEffect(() => {
    if (viewOnly) return;
    if (gameState?.winnerId || gameState?.loserId)
      sessionStorage.removeItem("activeGameId");
  }, [gameState?.winnerId, gameState?.loserId, viewOnly]);

  // ── Socket listeners ──
  useEffect(() => {
    if (viewOnly) return;
    if (!socket || !gameId) return;

    const handleGameResult = (payload) => {
      setGameState((prev) => ({ ...prev, ...payload }));
      sessionStorage.removeItem("activeGameId");

      if (payload.winnerId === currentUser?._id) {
        toast.success(`You won! +${payload.pointsAwarded} points`);
      } else if (payload.loserId === currentUser?._id) {
        const reasonMsg =
          payload.reason === "timeout"
            ? "Time ran out — you lost!"
            : "You lost the round.";
        toast.error(reasonMsg);
      }
    };

    const handleResignAck = (payload) => {
      if (!payload) return;
      if (payload.success) toast.success(payload.message || "You resigned the game.");
      else toast.error(payload.message || "Failed to resign the game.");
    };

    const handleTurnUpdated = (payload) => {
      setGameState((prev) => ({
        ...prev,
        ...payload,
        // Always merge arrays properly
        guesses: payload.guesses ?? prev.guesses,
        responses: payload.responses ?? prev.responses,
      }));
    };

    socket.on("game-result", handleGameResult);
    socket.on("turn-updated", handleTurnUpdated);
    socket.on("resign-ack", handleResignAck);

    return () => {
      socket.off("game-result", handleGameResult);
      socket.off("turn-updated", handleTurnUpdated);
      socket.off("resign-ack", handleResignAck);
    };
  }, [socket, gameId, currentUser?._id, navigate, viewOnly]);

  const handleLeaveAttempt = () => {
    if (viewOnly || gameState?.winnerId || gameState?.loserId) {
      if (viewOnly) {
        navigate("/home", { state: { activeTab: "Game_History" } });
      } else {
        navigate("/home");
      }
      return;
    }
    toast.error("Resign the game first if you want to leave this session.");
  };

  // ── Timer badge content ──
  const timerBadge = () => {
    if (viewOnly) {
      if (gameState.isDraw) return "Result · Draw";
      const wId = String(historyGame?.winner?._id || historyGame?.winner || "");
      const winnerName = wId === String(currentUser?._id) 
        ? "You Won" 
        : historyGame?.winner?.username 
          ? `${historyGame.winner.username} Won` 
          : "Opponent Won";
      return `Result · ${winnerName}`;
    }
    if (!gameState.currentTurn) return "Starting...";
    if (isMyTurn) {
      const label = gameState.phase === "guess" ? "Your Guess" : "Your Response";
      const time = timeLeft !== null ? formatTime(timeLeft) : "--:--";
      return `${label} · ${time}`;
    }
    const label = gameState.phase === "guess" ? "Opponent Guessing" : "Opponent Responding";
    return label;
  };

  const isActiveTimer = isMyTurn && timeLeft !== null && timeLeft > 0;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-0 overflow-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveAttempt}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-500 border border-gray-100 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Swords size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-1">
              Cipher Room · {isHost ? "Host" : "Guest"}
            </span>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              Live Round
            </h1>
          </div>
        </div>

        {/* Turn Timer Badge */}
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
            isActiveTimer
              ? "bg-amber-50 border-amber-100 text-amber-700"
              : "bg-gray-50 border-gray-100 text-gray-500"
          }`}
        >
          <Clock
            size={12}
            className={isActiveTimer ? "animate-pulse text-amber-500" : "text-gray-400"}
          />
          <span>{timerBadge()}</span>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="flex-1 p-6 flex gap-5 min-h-0 overflow-hidden">
        {/* Leftmost Dashboard */}
        <div className="w-72 shrink-0 flex flex-col">
          <GameDashboard
            gameId={gameId}
            opponent={opponent}
            isHost={isHost}
            currentUser={currentUser}
            gameState={gameState}
            secretNumber={secretNumber}
            viewOnly={viewOnly}
          />
        </div>

        {/* My Block — current user's guesses & received responses */}
        <div className="flex-1 flex flex-col">
          <HostUser
            currentUser={currentUser}
            opponent={opponent}
            gameId={gameId}
            isHost={isHost}
            gameState={gameState}
            guesses={gameState.guesses}
            responses={gameState.responses}
            latestResponse={gameState.latestResponse}
            viewOnly={viewOnly}
          />
        </div>

        {/* Opponent Block — opponent's guesses & my responses */}
        <div className="flex-1 flex flex-col">
          <JoinUser
            currentUser={currentUser}
            opponent={opponent}
            gameId={gameId}
            isHost={isHost}
            gameState={gameState}
            guesses={gameState.guesses}
            responses={gameState.responses}
            latestResponse={gameState.latestResponse}
            viewOnly={viewOnly}
          />
        </div>

        {/* Chat Panel */}
        <div className="w-80 shrink-0 flex flex-col">
          <ChatComponent gameId={gameId} viewOnly={viewOnly} historyChat={historyGame?.chat} />
        </div>
      </div>
    </div>
  );
}

export default GameSessionPage;
