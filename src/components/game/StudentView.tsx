"use client";

import { useGameStore } from "@/store/gameStore";
import {
  BookOpen,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  Zap,
  Target,
  Users,
  CheckCircle,
  X,
} from "lucide-react";
import { useState } from "react";

export default function StudentView() {
  const { session, gameState, words, currentWordIndex } = useGameStore();
  const [showAdvancedTips, setShowAdvancedTips] = useState(false);

  if (!session) return null;

  const currentWord = words[currentWordIndex];
  const tutor = session.participants.find((p) => p.role === "tutor");
  const hintsRemaining = 3 - gameState.hintsUsed;
  const isFirstRound = gameState.roundNumber === 1;

  // Dynamic tips based on word difficulty and category
  const getContextualTips = () => {
    const difficulty = currentWord?.difficulty;
    const category = currentWord?.category;

    if (difficulty === "easy") {
      return [
        "Start with what it looks like",
        "Mention where you'd find it",
        "Describe its size or color",
      ];
    } else if (difficulty === "hard") {
      return [
        "Use analogies and comparisons",
        "Describe its purpose or function",
        "Give specific examples",
      ];
    }

    return [
      "Use synonyms and similar words",
      "Describe what it looks like or feels like",
      "Explain how it's used or where you find it",
    ];
  };

  return (
    <div className="bg-gradient-to-br from-wordsync-orange to-orange-600 rounded-xl p-6 text-white space-y-6">
      {/* Header with Encouragement */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-wordsync-orange" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">Describe & Guide!</h3>
          <p className="text-orange-100 text-sm">
            {isFirstRound
              ? "Help your tutor guess the word"
              : `Round ${gameState.roundNumber} - Keep describing!`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{hintsRemaining}</div>
          <div className="text-xs text-orange-100">hints left</div>
        </div>
      </div>

      {/* Word Card with Enhanced Visibility */}
      <div className="bg-white bg-opacity-20 rounded-xl p-6 border-2 border-white border-opacity-30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-yellow-300">
              Your Secret Word
            </span>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-medium">
              {currentWord?.difficulty || "medium"}
            </span>
            <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-xs font-medium">
              {currentWord?.category || "general"}
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold mb-2 text-yellow-100">
            {currentWord?.word || "Loading..."}
          </div>
          <p className="text-sm text-orange-100">
            Describe this word to {tutor?.name || "your tutor"} - they can't see
            it!
          </p>
        </div>
      </div>

      {/* Quick Action Prompt */}
      {isFirstRound && (
        <div className="bg-yellow-400 bg-opacity-20 rounded-lg p-4 border border-yellow-400 border-opacity-30">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="font-medium text-yellow-300">Quick Start:</span>
          </div>
          <p className="text-sm text-yellow-100">
            Start typing in the chat below! Try: "This is something that..." or
            "You use this when..."
          </p>
        </div>
      )}

      {/* Contextual Tips */}
      <div className="bg-white bg-opacity-15 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-yellow-300" />
            <span className="font-medium">
              Smart Tips for "{currentWord?.word}":
            </span>
          </div>
          <button
            onClick={() => setShowAdvancedTips(!showAdvancedTips)}
            className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
          >
            {showAdvancedTips ? "Basic" : "More"}
          </button>
        </div>

        <div className="space-y-2 text-sm text-orange-100">
          {getContextualTips().map((tip, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
              <p>{tip}</p>
            </div>
          ))}

          {showAdvancedTips && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                <p>Break it down: describe parts separately</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                <p>Use emotions: how does it make you feel?</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                <p>Tell a story: when do you use this?</p>
              </div>
            </>
          )}

          <div className="flex items-center space-x-2 pt-2 border-t border-white border-opacity-20">
            <AlertCircle className="w-4 h-4 text-red-300" />
            <p className="text-red-200 font-medium">
              Remember: Don't say the word "{currentWord?.word}"!
            </p>
          </div>
        </div>
      </div>

      {/* Student Controls - YOU decide when tutor is correct */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20 rounded-lg p-4 border border-green-400 border-opacity-30">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-300" />
          <span className="font-medium text-green-300">
            You Control the Game:
          </span>
        </div>
        <p className="text-sm text-green-100 mb-3">
          When {tutor?.name || "your tutor"} guesses correctly, click "Correct!"
          to award points.
        </p>
        <div className="flex items-center space-x-2 text-xs text-green-200">
          <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
          <p>Listen for their guesses in the chat</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-green-200">
          <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
          <p>Use "Miss" if they guess wrong</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-green-200">
          <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
          <p>Give hints if they're struggling</p>
        </div>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">{gameState.roundNumber}</div>
          <div className="text-xs text-orange-100">Round</div>
        </div>
        <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">{gameState.wordsCompleted}</div>
          <div className="text-xs text-orange-100">Guessed</div>
        </div>
        <div className="bg-white bg-opacity-15 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">
            {Math.round(
              (gameState.wordsCompleted / gameState.roundNumber) * 100
            ) || 0}
            %
          </div>
          <div className="text-xs text-orange-100">Success</div>
        </div>
      </div>

      {/* Encouragement Based on Progress */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-pink-300" />
          <span className="font-medium text-pink-300">Teaching Together:</span>
        </div>
        <div className="text-sm text-pink-100">
          {gameState.wordsCompleted === 0 && (
            <p>
              You're the teacher now! Help guide {tutor?.name || "your tutor"}{" "}
              to the answer.
            </p>
          )}
          {gameState.wordsCompleted > 0 && gameState.wordsCompleted < 3 && (
            <p>
              Great describing! You're helping {tutor?.name || "your tutor"}{" "}
              understand your communication style.
            </p>
          )}
          {gameState.wordsCompleted >= 3 && (
            <p>
              Excellent teaching! You're becoming a master at guiding others to
              understanding.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
