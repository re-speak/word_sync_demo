"use client";

import { useState, Suspense, useEffect } from "react";
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

  // Auto-join session if session ID is in URL - FIXED: useEffect for side effects
  useEffect(() => {
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
            <h2 className="text-2xl font-bold text-wordsync-navy mb-2">
              Ready to {role === "tutor" ? "Teach" : "Learn"}?
            </h2>
            <p className="text-gray-600">
              You're joining as a <strong>{roleDisplayName}</strong>
            </p>
          </div>

          {session && gameState?.gameMode === "waiting" && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                🎮 Session Created!
              </h3>

              {/* Session Code Display */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Share this code:</p>
                <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-3">
                  <div className="text-3xl font-mono font-bold text-blue-700 tracking-widest text-center">
                    {session.sessionId}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(session.sessionId);
                    // You could add a toast notification here
                  }}
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📋 Copy Session Code
                </button>
              </div>

              {/* OR Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500 bg-gray-50 rounded">
                  OR
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Share URL */}
              {sessionUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={sessionUrl}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(sessionUrl);
                        // You could add a toast notification here
                      }}
                      className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4 text-center">
                Waiting for {role === "tutor" ? "student" : "tutor"} to join...
              </p>
            </div>
          )}

          {!session && (
            <>
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    What happens next:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create a new game session</li>
                    <li>• Get a shareable code or link</li>
                    <li>• Share with your learning partner</li>
                    <li>• Start playing together!</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full bg-wordsync-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Create New Game</span>
              </button>
            </>
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
