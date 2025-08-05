"use client";

import { useEffect, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";

interface TimerProps {
  onTimeUp: () => void;
}

export default function Timer({ onTimeUp }: TimerProps) {
  const { session, gameState, setTimeRemaining } = useGameStore();

  // Single source of truth: use store value directly
  const timeLeft = session?.timeRemaining ?? 60;
  const isGameActive = gameState?.isGameActive ?? true;

  // Memoize onTimeUp to prevent unnecessary effect re-runs
  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    // Don't run timer if game is not active (completed/paused)
    if (!isGameActive) {
      return;
    }

    // If already at 0 or less, trigger onTimeUp immediately
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      const newTime = timeLeft - 1;
      setTimeRemaining(newTime);

      // Don't call handleTimeUp here to avoid double calls
      // The next effect run will handle it when timeLeft becomes <= 0
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleTimeUp, setTimeRemaining, isGameActive]);

  const percentage = (timeLeft / 60) * 100;
  const isUrgent = timeLeft <= 10;
  const isWarning = timeLeft <= 20;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={isUrgent ? "#ef4444" : isWarning ? "#f59e0b" : "#38A169"}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${percentage * 2.827} 282.7`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-xl font-bold ${
              isUrgent
                ? "text-red-500"
                : isWarning
                ? "text-yellow-500"
                : "text-wordsync-green"
            }`}
          >
            {timeLeft}s
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {!isGameActive
          ? "Game Complete!"
          : timeLeft > 30
          ? "Take your time"
          : timeLeft > 10
          ? "Hurry up!"
          : "Almost out of time!"}
      </div>
    </div>
  );
}
