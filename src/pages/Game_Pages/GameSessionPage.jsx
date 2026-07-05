import { ArrowLeft, Swords, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
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
    : initSecretNumber;

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

    if (!isMyTurn || !gameState.currentTurn || gameState.winnerId || gameState.isDraw) {
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
  }, [gameState.currentTurn, gameState.phase, isMyTurn, gameState.winnerId, gameState.isDraw]);

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
    if (gameState?.winnerId || gameState?.loserId || gameState?.isDraw)
      sessionStorage.removeItem("activeGameId");
  }, [gameState?.winnerId, gameState?.loserId, gameState?.isDraw, viewOnly]);

  // Holds the game-result payload until the final guess is confirmed in state
  const pendingResultRef = useRef(null);
  // Mirror of gameState so socket handlers can read latest guesses without stale closure
  const gameStateRef = useRef(null);

  // Applies the stored game-result payload and shows the toast
  const applyGameResult = useCallback(
    (payload) => {
      console.log("\n========== [CLIENT] GAME RESULT RECEIVED ==========");
      console.log("Winner:", payload.winnerId, "| Loser:", payload.loserId, "| Draw:", payload.isDraw);
      console.log("Total Guesses:", payload.totalGuesses, "| Total Responses:", payload.totalResponses);
      console.log("[CLIENT] Guesses array:", JSON.stringify(payload.guesses, null, 2));
      console.log("[CLIENT] Responses array:", JSON.stringify(payload.responses, null, 2));
      console.log("====================================================\n");

      setGameState((prev) => ({
        ...prev,
        ...payload,
        guesses: payload.guesses?.length ? payload.guesses : prev.guesses,
        responses: payload.responses?.length ? payload.responses : prev.responses,
      }));
      sessionStorage.removeItem("activeGameId");

      if (payload.winnerId === currentUser?._id) {
        toast.success(`You won! +${payload.pointsAwarded} points`);
      } else if (payload.isDraw) {
        toast.success("The Game Endup Draw");
      } else if (payload.loserId === currentUser?._id) {
        const reasonMsg =
          payload.reason === "timeout"
            ? "Time ran out — you lost!"
            : "You lost the round.";
        toast.error(reasonMsg);
      }
    },
    [currentUser?._id],
  );

  // ── Socket listeners ──
  useEffect(() => {
    if (viewOnly) return;
    if (!socket || !gameId) return;

    const handleGameResult = (payload) => {
      pendingResultRef.current = payload;

      // ── Normal path: turn-updated always arrives BEFORE game-result ──
      // By the time game-result fires, gameStateRef already holds the
      // final guesses from the preceding turn-updated. Check immediately.
      const currentGuesses = gameStateRef.current?.guesses || [];
      const expected = payload.totalGuesses || 0;

      if (expected === 0 || currentGuesses.length >= expected) {
        // State is already up to date — apply after React commits the last render
        setTimeout(() => {
          if (pendingResultRef.current) {
            applyGameResult(pendingResultRef.current);
            pendingResultRef.current = null;
          }
        }, 0);
      }
      // else: game-result arrived before turn-updated (rare)
      // handleTurnUpdated will trigger applyGameResult when the count matches
    };

    const handleResignAck = (payload) => {
      if (!payload) return;
      if (payload.success) toast.success(payload.message || "You resigned the game.");
      else toast.error(payload.message || "Failed to resign the game.");
    };

    const handleTurnUpdated = (payload) => {
      setGameState((prev) => {
        const newGuesses = payload.guesses ?? prev.guesses;
        const newResponses = payload.responses ?? prev.responses;
        const newState = {
          ...prev,
          ...payload,
          guesses: newGuesses,
          responses: newResponses,
        };

        // Update the ref so handleGameResult can read the latest guesses
        gameStateRef.current = newState;

        // ── Fallback path: game-result arrived before turn-updated ──
        // Apply the pending result now that the guesses are in state.
        const pending = pendingResultRef.current;
        if (
          pending &&
          pending.totalGuesses > 0 &&
          newGuesses.length >= pending.totalGuesses
        ) {
          setTimeout(() => {
            if (pendingResultRef.current) {
              applyGameResult(pendingResultRef.current);
              pendingResultRef.current = null;
            }
          }, 0);
        }

        return newState;
      });
    };

    socket.on("game-result", handleGameResult);
    socket.on("turn-updated", handleTurnUpdated);
    socket.on("resign-ack", handleResignAck);

    return () => {
      socket.off("game-result", handleGameResult);
      socket.off("turn-updated", handleTurnUpdated);
      socket.off("resign-ack", handleResignAck);
    };
  }, [socket, gameId, currentUser?._id, navigate, viewOnly, applyGameResult]);

  const handleLeaveAttempt = () => {
    if (viewOnly || gameState?.winnerId || gameState?.loserId || gameState?.isDraw) {
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
    if (gameState.isDraw) return "Result · Draw";
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

  const myId = String(currentUser?._id || "");
  const opponentId = String(opponent?._id || "");
  const allGuesses = gameState.guesses || [];
  const allResponses = gameState.responses || [];

  // Pre-split so each block receives exactly its own data — no filtering bugs in children
  const myGuesses = allGuesses.filter((g) => String(g.playerId) === myId);
  const opponentGuesses = allGuesses.filter((g) => String(g.playerId) === opponentId);
  const responsesForMe = allResponses.filter((r) => String(r.forPlayerId) === myId);
  const responsesForOpponent = allResponses.filter((r) => String(r.forPlayerId) === opponentId);

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
            guesses={myGuesses}
            responses={responsesForMe}
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
            guesses={opponentGuesses}
            responses={responsesForOpponent}
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
