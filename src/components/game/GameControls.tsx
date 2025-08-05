"use client";

import { useGameStore } from "@/store/gameStore";
import { Lightbulb, SkipForward, RefreshCw, Play, Pause } from "lucide-react";

export default function GameControls() {
  const {
    session,
    gameState,
    useHint,
    skipWord,
    switchRoles,
    endRound,
    words,
    currentWordIndex,
  } = useGameStore();

  const handleCorrectGuess = () => {
    endRound(true);
  };

  const handleIncorrectGuess = () => {
    endRound(false);
  };

  const canUseHint = gameState.hintsUsed < 3;
  const canSkip = currentWordIndex < words.length - 1;

  if (!session) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">Start a game to see controls</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-wordsync-navy mb-4">Game Controls</h3>

      {/* Current Word Display */}
      <div className="mb-6 p-4 bg-wordsync-orange bg-opacity-10 rounded-lg">
        <h4 className="text-sm text-gray-600 mb-1">Current Word:</h4>
        <p className="text-2xl font-bold text-wordsync-navy">
          {session.currentWord}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Round {gameState.roundNumber} • {gameState.wordsCompleted} completed
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleCorrectGuess}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-wordsync-green text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-wordsync-green focus:ring-offset-2 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Correct!</span>
        </button>

        <button
          onClick={handleIncorrectGuess}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          <Pause className="w-4 h-4" />
          <span>Miss</span>
        </button>
      </div>

      {/* Helper Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={useHint}
          disabled={!canUseHint}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Hint</span>
        </button>

        <button
          onClick={skipWord}
          disabled={!canSkip}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <SkipForward className="w-4 h-4" />
          <span>Skip</span>
        </button>

        <button
          onClick={switchRoles}
          className="flex items-center justify-center space-x-1 px-3 py-2 bg-wordsync-navy text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-wordsync-navy focus:ring-offset-2 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Switch</span>
        </button>
      </div>

      {/* Hints Used Indicator */}
      <div className="text-sm text-gray-600">
        <p>Hints used: {gameState.hintsUsed}/3</p>
        {!canUseHint && (
          <p className="text-yellow-600 mt-1">No more hints available</p>
        )}
      </div>
    </div>
  );
}
