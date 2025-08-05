"use client";

import { useState, Suspense, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { useUserRole } from "@/hooks/useUserRole";
import { Player } from "@/types/game";
import MobileGameBoard from "./MobileGameBoard";
import ChatInterface from "./ChatInterface";
import GameReview from "./GameReview";
import RoleSelection from "./RoleSelection";
import { Users, Play } from "lucide-react";

function GameSessionContent() {
  const [showSetup, setShowSetup] = useState(true);
  const [sessionUrl, setSessionUrl] = useState<string>("");
  const { session, gameState, createSession, joinSession, endRound } =
    useGameStore();
  const { role, isValidRole, roleDisplayName, sessionId } = useUserRole();

  // Debug logging for session flow
  console.log("GameSession Debug:", {
    showSetup,
    hasSession: !!session,
    sessionId: session?.sessionId,
    urlSessionId: sessionId,
    gameMode: gameState?.gameMode,
    role,
    isValidRole,
    roleDisplayName,
  });

  // Auto-join session if session ID is in URL
  useMemo(() => {
    if (sessionId && isValidRole && !session) {
      const player: Player = {
        id: `${role}-${Date.now()}`,
        name: roleDisplayName,
        role: role as "tutor" | "student",
        isConnected: true,
      };

      console.log("Attempting to join session:", sessionId, "as", role);
      const joinSuccess = joinSession(sessionId, player);

      if (joinSuccess) {
        setShowSetup(false);
      } else {
        console.warn("Failed to join session:", sessionId);
      }
    }
  }, [sessionId, isValidRole, role, roleDisplayName, session, joinSession]);

  // Show role selection if no valid role is specified
  if (!isValidRole) {
    return <RoleSelection />;
  }

  const handleStartGame = () => {
    // Create new session if no session ID in URL
    if (!sessionId) {
      const creatorPlayer: Player = {
        id: `${role}-${Date.now()}`,
        name: roleDisplayName,
        role: role as "tutor" | "student",
        isConnected: true,
      };

      console.log("Creating new session as:", role);
      const newSessionId = createSession(creatorPlayer);

      // Generate shareable URL
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?role=${
        role === "tutor" ? "student" : "tutor"
      }&session=${newSessionId}`;
      setSessionUrl(shareUrl);

      setShowSetup(false);
    }
  };

  const handleTimeUp = () => {
    endRound(false);
  };

  const handlePlayAgain = () => {
    setShowSetup(true);
  };

  // Show game review if game is completed
  if (session && gameState?.gameMode === "completed") {
    return <GameReview onPlayAgain={handlePlayAgain} />;
  }

  if (showSetup || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wordsync-orange to-wordsync-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-wordsync-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-wordsync-navy mb-2">
              WordSync
            </h1>
            <p className="text-gray-600">
              {sessionId
                ? `Joining session as ${roleDisplayName}`
                : "Ready to start playing?"}
            </p>
          </div>

          {/* Role Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">You are joining as:</p>
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  role === "tutor" ? "bg-wordsync-navy" : "bg-wordsync-orange"
                }`}
              />
              <span className="font-semibold text-gray-800">
                {roleDisplayName}
              </span>
            </div>
          </div>

          {/* Session Info */}
          {sessionId ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">Session ID:</p>
              <p className="font-mono text-lg font-bold text-blue-900">
                {sessionId}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Waiting for game session to load...
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Click "Start Game" to create a new session that others can join.
              </p>
            </div>
          )}

          {/* Session URL sharing - shown after creating session */}
          {sessionUrl && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 mb-2">
                🎉 Session created! Share this link with your partner:
              </p>
              <div className="bg-white p-3 rounded border mb-3">
                <p className="font-mono text-xs text-green-900 break-all">
                  {sessionUrl}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(sessionUrl)}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                📋 Copy Link
              </button>
            </div>
          )}

          {/* Session Status */}
          {session && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                👥 Players: {session.participants.length}/2
              </p>
              <div className="text-xs text-yellow-600 mt-2">
                {session.participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.role === "tutor" ? "bg-blue-500" : "bg-orange-500"
                      }`}
                    ></span>
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
              {session.participants.length < 2 && (
                <p className="text-xs text-yellow-600 mt-2">
                  Waiting for{" "}
                  {session.participants.some((p) => p.role === "tutor")
                    ? "student"
                    : "tutor"}{" "}
                  to join...
                </p>
              )}
            </div>
          )}

          {/* Start Game Button */}
          {!sessionId && !session && (
            <button
              onClick={handleStartGame}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-wordsync-orange text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-wordsync-orange focus:ring-offset-2 transition-colors font-semibold"
            >
              <Play className="w-5 h-5" />
              <span>Start Game</span>
            </button>
          )}

          {/* Instructions */}
          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>💡 Tip: Share the session link with friends to play together!</p>
            <p>
              🎮{" "}
              {role === "tutor"
                ? "You'll guess the words"
                : "You'll describe the words"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Simplified Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  role === "tutor" ? "bg-wordsync-navy" : "bg-wordsync-orange"
                }`}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-wordsync-navy">
                  WordSync Game
                </h1>
                <p className="text-sm text-gray-500">
                  Playing as {roleDisplayName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Game Area */}
        <div className="space-y-6">
          {/* Unified Game Board */}
          <MobileGameBoard onTimeUp={handleTimeUp} />

          {/* Chat Interface */}
          <div className="h-[400px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GameSession() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-wordsync-orange rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600">Loading WordSync...</p>
          </div>
        </div>
      }
    >
      <GameSessionContent />
    </Suspense>
  );
}
