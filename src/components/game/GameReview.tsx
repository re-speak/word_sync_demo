"use client";

import { useGameStore } from "@/store/gameStore";
import { useUserRole } from "@/hooks/useUserRole";
import { Trophy, CheckCircle, XCircle, RotateCcw, Home } from "lucide-react";

interface GameReviewProps {
  onPlayAgain: () => void;
}

export default function GameReview({ onPlayAgain }: GameReviewProps) {
  const { session, gameState, words } = useGameStore();
  const { role } = useUserRole();

  if (!session || gameState.gameMode !== "completed") {
    return null;
  }

  const student = session.participants.find((p) => p.role === "student");
  const finalScore = student ? session.scores[student.id] || 0 : 0;
  const totalPossibleScore = words.length * 10;
  const percentageScore = Math.round((finalScore / totalPossibleScore) * 100);
  const wordsCorrect = Math.floor(finalScore / 10);
  const wordsIncorrect = words.length - wordsCorrect;

  // Calculate average time per word (mock data for now)
  const averageTime = Math.round(45 + Math.random() * 20); // 45-65 seconds average

  const getPerformanceMessage = () => {
    if (percentageScore >= 90) return "Outstanding performance! 🌟";
    if (percentageScore >= 80) return "Excellent work! 🎉";
    if (percentageScore >= 70) return "Great job! 👏";
    if (percentageScore >= 60) return "Good effort! 👍";
    return "Keep practicing! 💪";
  };

  const getScoreColor = () => {
    if (percentageScore >= 80) return "text-green-600";
    if (percentageScore >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-wordsync-orange to-wordsync-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-wordsync-navy mb-2">
            Game Complete!
          </h1>
          <p className="text-gray-600">{getPerformanceMessage()}</p>
        </div>

        {/* Final Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="mb-2">
              <span className={`text-5xl font-bold ${getScoreColor()}`}>
                {finalScore}
              </span>
              <span className="text-xl text-gray-500 ml-2">
                / {totalPossibleScore} pts
              </span>
            </div>
            <div className="text-lg text-gray-600 mb-3">
              {student?.name || "Student"} Final Score
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-wordsync-orange to-wordsync-navy h-3 rounded-full transition-all duration-1000"
                style={{ width: `${percentageScore}%` }}
              ></div>
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {percentageScore}% Complete
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-xl font-bold text-green-600">{wordsCorrect}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xl font-bold text-red-600">{wordsIncorrect}</p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="w-5 h-5 text-wordsync-orange" />
              </div>
              <p className="text-xl font-bold text-wordsync-orange">
                {averageTime}s
              </p>
              <p className="text-xs text-gray-500">Avg Time</p>
            </div>
          </div>
        </div>

        {/* Word Review */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-wordsync-navy mb-4">
            Word Review
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {words.map((word, index) => {
              // For now, simulate results based on score
              // In a real implementation, this would come from wordResults state
              const isCorrect = index < wordsCorrect;

              return (
                <div
                  key={word.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{word.word}</p>
                      <p className="text-sm text-gray-500">
                        Round {index + 1} • {word.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? "+10 pts" : "0 pts"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-wordsync-orange text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-wordsync-orange focus:ring-offset-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          <a
            href="/"
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
