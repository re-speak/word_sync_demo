"use client";

import { useGameStore } from "@/store/gameStore";
import { Trophy, Star, Target } from "lucide-react";

export default function ScoreBoard() {
  const { session, gameState } = useGameStore();

  if (!session) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No active game</p>
      </div>
    );
  }

  const student = session.participants.find((p) => p.role === "student");
  const studentScore = student ? session.scores[student.id] || 0 : 0;
  const currentRoundPossibleScore = gameState.roundNumber * 10;
  const completedWordsScore = gameState.wordsCompleted * 10;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-wordsync-orange" />
        <h3 className="font-semibold text-wordsync-navy">Student Score</h3>
      </div>

      {/* Student Score Display */}
      <div className="text-center mb-6">
        <div className="mb-3">
          <span className="text-4xl font-bold text-wordsync-navy">
            {studentScore}
          </span>
          <span className="text-lg text-gray-500 ml-2">
            / {currentRoundPossibleScore} pts
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {student?.name || "Student"} Performance
        </p>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-wordsync-orange h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  currentRoundPossibleScore > 0
                    ? (studentScore / currentRoundPossibleScore) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Progress:{" "}
            {currentRoundPossibleScore > 0
              ? Math.round((studentScore / currentRoundPossibleScore) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-wordsync-green" />
            </div>
            <p className="text-lg font-semibold text-wordsync-navy">
              {gameState.roundNumber}
            </p>
            <p className="text-xs text-gray-500">Round</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-wordsync-orange" />
            </div>
            <p className="text-lg font-semibold text-wordsync-navy">
              {gameState.wordsCompleted}
            </p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-lg font-semibold text-wordsync-navy">
              {studentScore}
            </p>
            <p className="text-xs text-gray-500">Score</p>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Game Status:{" "}
          <span className="font-medium capitalize text-wordsync-navy">
            {gameState.gameMode}
          </span>
        </p>
      </div>
    </div>
  );
}
