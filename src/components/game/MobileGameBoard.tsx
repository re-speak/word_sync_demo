"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { useUserRole } from "@/hooks/useUserRole";
import { CheckCircle, Lightbulb, SkipForward } from "lucide-react";

interface MobileGameBoardProps {
  onTimeUp: () => void;
}

export default function MobileGameBoard({ onTimeUp }: MobileGameBoardProps) {
  const {
    session,
    gameState,
    words,
    currentWordIndex,
    useHint,
    skipWord,
    endRound,
    setTimeRemaining,
  } = useGameStore();
  const { role } = useUserRole();

  // Debug logging for session matching issues
  console.log("MobileGameBoard Debug:", {
    hasSession: !!session,
    sessionId: session?.sessionId,
    isGameActive: gameState?.isGameActive,
    gameMode: gameState?.gameMode,
    currentWordIndex,
    wordsLength: words.length,
    role,
    currentWord: words[currentWordIndex]?.word,
    sessionCurrentWord: session?.currentWord,
  });

  // More lenient condition - show board if session exists, regardless of isGameActive
  if (!session) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-500">Waiting for game session...</p>
      </div>
    );
  }

  // Only check if game is completed to show different state
  if (gameState?.gameMode === "completed") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-green-600 font-medium">Game Complete!</p>
      </div>
    );
  }

  const student = session.participants.find((p) => p.role === "student");
  const studentScore = student ? session.scores[student.id] || 0 : 0;
  const currentRoundPossibleScore = gameState.roundNumber * 10;
  const timeLeft = session.timeRemaining;
  const currentWord = words[currentWordIndex];

  // Timer logic (simplified from Timer component)
  const percentage = (timeLeft / 60) * 100;
  const isUrgent = timeLeft <= 10;
  const isWarning = timeLeft <= 20;

  // REACTIVE word display logic - tutors should NEVER see the real word
  const getDisplayWord = useMemo(() => {
    const wordToHide = currentWord?.word || session?.currentWord || "unknown";
    console.log("getDisplayWord recalculating:", {
      role,
      currentWordIndex,
      wordToHide,
      currentWord: currentWord?.word,
      sessionWord: session?.currentWord,
    });

    if (role === "tutor") {
      // Tutor sees question marks matching word length
      return wordToHide
        .split("")
        .map((char) => (char === " " ? " " : "?"))
        .join("");
    } else {
      // Student sees the actual word
      return wordToHide;
    }
  }, [role, currentWord?.word, session?.currentWord, currentWordIndex]); // Added currentWordIndex as dependency

  // REACTIVE word hint that updates with word changes
  const getWordHint = useMemo(() => {
    console.log("getWordHint recalculating:", {
      role,
      currentWordIndex,
      currentWord: currentWord?.word,
      category: currentWord?.category,
      difficulty: currentWord?.difficulty,
    });

    if (role === "tutor") {
      const wordToAnalyze = currentWord?.word || session?.currentWord || "";
      return `${wordToAnalyze.length} letters`;
    } else {
      return `${currentWord?.category || "general"} • ${
        currentWord?.difficulty || "medium"
      }`;
    }
  }, [
    role,
    currentWord?.word,
    currentWord?.category,
    currentWord?.difficulty,
    session?.currentWord,
    currentWordIndex,
  ]); // Added currentWordIndex as dependency

  // Game control handlers
  const handleCorrect = () => endRound(true);
  const handleHint = () => useHint();
  const handleSkip = () => skipWord();

  const canUseHint = gameState.hintsUsed < 3;
  const canSkip = currentWordIndex < words.length - 1;

  // Timer functionality (integrated from Timer component)
  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    // Don't run timer if game is not active or completed
    if (gameState?.gameMode === "completed" || !gameState?.isGameActive) {
      return;
    }

    // If already at 0 or less, trigger onTimeUp immediately
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      // Calculate new time directly since setTimeRemaining expects a number
      const newTime = Math.max(0, timeLeft - 1);
      setTimeRemaining(newTime);

      // Handle time up in next tick to avoid setState during render
      if (newTime === 0) {
        setTimeout(() => handleTimeUp(), 0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    timeLeft,
    handleTimeUp,
    setTimeRemaining,
    gameState?.isGameActive,
    gameState?.gameMode,
  ]);

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      key={`word-${currentWordIndex}`}
    >
      {/* Header: Timer + Score */}
      <div className="bg-gradient-to-r from-wordsync-orange to-wordsync-navy p-4">
        <div className="flex items-center justify-between text-white">
          {/* Timer */}
          <div className="flex items-center space-x-3">
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={
                    isUrgent ? "#ef4444" : isWarning ? "#f59e0b" : "#ffffff"
                  }
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${percentage * 2.827} 282.7`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {timeLeft}s
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-90">
                {!gameState?.isGameActive
                  ? "Game Complete!"
                  : timeLeft > 30
                  ? "Take your time"
                  : timeLeft > 10
                  ? "Hurry up!"
                  : "Almost out of time!"}
              </p>
            </div>
          </div>

          {/* Score Info */}
          <div className="text-right">
            <div className="text-2xl font-bold">{studentScore}</div>
            <div className="text-sm opacity-90">
              / {currentRoundPossibleScore} pts
            </div>
            <div className="text-xs opacity-75">
              Round {gameState.roundNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Current Word Display */}
      <div
        className="p-6 text-center bg-gray-50"
        key={`word-display-${currentWordIndex}`}
      >
        <div className="mb-2">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            {role === "tutor"
              ? "Mystery Word (Guess This!)"
              : "Your Word to Describe"}
          </span>
        </div>
        <div
          className={`text-3xl font-bold mb-2 ${
            role === "tutor"
              ? "text-red-600 font-mono tracking-widest"
              : "text-wordsync-navy"
          }`}
        >
          {getDisplayWord}
        </div>
        <div className="text-sm text-gray-600">{getWordHint}</div>
        <div className="text-xs text-gray-500 mt-1">
          {gameState.wordsCompleted} of {words.length} completed • Word #
          {currentWordIndex + 1}
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <div>
              Debug: Index={currentWordIndex} | Word="{currentWord?.word}" |
              Session="{session?.currentWord}"
            </div>
            <div>
              Role: {role} | Display: "{getDisplayWord}"
            </div>
          </div>
        )}

        {/* Tutor-specific guidance */}
        {role === "tutor" && (
          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-xs text-red-700">
              🎯 Listen to the student's description and make your guess in the
              chat!
            </p>
          </div>
        )}

        {/* Student-specific guidance */}
        {role === "student" && (
          <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
            <p className="text-xs text-orange-700">
              💡 Describe this word without saying it! Use the controls below.
            </p>
          </div>
        )}
      </div>

      {/* Controls - Only show for student */}
      {role === "student" && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3">
            {/* Correct Button */}
            <button
              onClick={handleCorrect}
              className="flex flex-col items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <CheckCircle className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Correct</span>
            </button>

            {/* Hint Button */}
            <button
              onClick={handleHint}
              disabled={!canUseHint}
              className={`flex flex-col items-center justify-center p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                canUseHint
                  ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Lightbulb className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">
                Hint ({3 - gameState.hintsUsed})
              </span>
            </button>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              disabled={!canSkip}
              className={`flex flex-col items-center justify-center p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                canSkip
                  ? "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <SkipForward className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium">Skip</span>
            </button>
          </div>
        </div>
      )}

      {/* Tutor Message */}
      {role === "tutor" && (
        <div className="p-4 bg-blue-50 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-blue-700 mb-1">
              💬 Make your guesses in the chat
            </p>
            <p className="text-xs text-blue-600">
              The student will mark if you're correct
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
