"use client";

import { useGameStore } from "@/store/gameStore";
import {
  Crown,
  HelpCircle,
  MessageSquare,
  Headphones,
  Brain,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

export default function TutorView() {
  const { session, gameState, words, currentWordIndex, messages } =
    useGameStore();
  const [isStudentTyping, setIsStudentTyping] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());

  if (!session) return null;

  const currentWord = words[currentWordIndex];
  const student = session.participants.find((p) => p.role === "student");
  const isFirstRound = gameState.roundNumber === 1;
  const recentMessages = messages.slice(-3);

  // Simulate student activity detection (in real app, this would come from socket events)
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastMessage = Date.now() - lastMessageTime;
      setIsStudentTyping(timeSinceLastMessage < 3000 && Math.random() > 0.7);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastMessageTime]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessageTime(Date.now());
    }
  }, [messages.length]);

  const getListeningPrompt = () => {
    if (isFirstRound) {
      return "Listen carefully for clues and context. What category might this word belong to?";
    }

    if (recentMessages.length === 0) {
      return `${
        student?.name || "The student"
      } is thinking... Be ready to listen!`;
    }

    if (isStudentTyping) {
      return "Student is typing... Listen for new clues!";
    }

    return "What patterns do you notice in their description style?";
  };

  // Generate question marks based on word length - REACTIVE to word changes
  const getHiddenWord = useMemo(() => {
    // Try to get word from multiple sources and always hide it
    const wordToHide = currentWord?.word || session?.currentWord || "unknown";
    console.log("getHiddenWord recalculating:", {
      currentWordIndex,
      wordToHide,
      currentWord: currentWord?.word,
      sessionWord: session?.currentWord,
    });

    return wordToHide
      .split("")
      .map((char) => {
        if (char === " ") return " ";
        if (char === "-") return "-";
        if (char === "'") return "'";
        return "?";
      })
      .join("");
  }, [currentWord?.word, session?.currentWord, currentWordIndex]); // Added currentWordIndex as dependency

  // REACTIVE word info that updates when word changes
  const wordInfo = useMemo(() => {
    const wordToAnalyze = currentWord?.word || session?.currentWord || "";
    console.log("wordInfo recalculating:", {
      currentWordIndex,
      wordToAnalyze,
      currentWord: currentWord?.word,
      sessionWord: session?.currentWord,
      difficulty: currentWord?.difficulty,
      category: currentWord?.category,
    });

    return {
      length: wordToAnalyze.length,
      difficulty: currentWord?.difficulty || "medium",
      category: currentWord?.category || "general",
      wordCount: wordToAnalyze.split(" ").length,
      actualWord: wordToAnalyze, // For debugging - remove in production
    };
  }, [
    currentWord?.word,
    currentWord?.difficulty,
    currentWord?.category,
    session?.currentWord,
    currentWordIndex,
  ]); // Added currentWordIndex as dependency

  // Debug logging to track word changes
  console.log("TutorView Word Debug:", {
    currentWordIndex,
    currentWordFromArray: currentWord?.word,
    currentWordFromSession: session?.currentWord,
    wordInfo,
    roundNumber: gameState.roundNumber,
  });

  return (
    <div
      className="bg-gradient-to-br from-wordsync-navy to-gray-700 rounded-xl p-6 text-white space-y-6"
      key={`tutor-view-${currentWordIndex}`}
    >
      {/* Header with Status */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
          <Crown className="w-6 h-6 text-gray-800" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">Tutor Dashboard</h3>
          <p className="text-gray-300 text-sm">
            {isFirstRound
              ? "Listen and guess the word!"
              : `Round ${gameState.roundNumber} - What word is it?`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isStudentTyping ? (
            <div className="flex items-center space-x-1 bg-wordsync-orange bg-opacity-20 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-wordsync-orange rounded-full animate-pulse"></div>
              <span className="text-xs text-orange-300">Typing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-green-500 bg-opacity-20 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-300">Listening</span>
            </div>
          )}
        </div>
      </div>

      {/* Mystery Word Card - Tutor CAN'T See Answer */}
      <div
        className="bg-gradient-to-r from-red-500 to-pink-500 bg-opacity-20 rounded-xl p-6 border border-red-400 border-opacity-30"
        key={`mystery-word-${currentWordIndex}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium text-red-400">
              Mystery Word #{gameState.roundNumber} (You Need to Guess This!)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-300">Hidden</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-4xl font-bold mb-2 text-red-100 font-mono tracking-widest">
            {getHiddenWord}
          </div>
          <div className="flex justify-center space-x-3">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {wordInfo.difficulty}
            </span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {wordInfo.category}
            </span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {wordInfo.length} letters
            </span>
            {wordInfo.wordCount > 1 && (
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {wordInfo.wordCount} words
              </span>
            )}
          </div>
        </div>

        {/* Updated Guessing Hints */}
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <p className="text-xs text-red-200 mb-2">
            🎯 Your Mission (Word #{gameState.roundNumber}):
          </p>
          <div className="text-xs text-red-100 space-y-1">
            <p>• Listen to {student?.name || "the student"}'s description</p>
            <p>• Use the chat to make your guesses</p>
            <p>• Think about category: {wordInfo.category.toLowerCase()}</p>
            <p>
              • Only {student?.name || "the student"} can mark your guess
              correct!
            </p>
            <p>
              • {wordInfo.length} letters total{" "}
              {wordInfo.wordCount > 1 ? `(${wordInfo.wordCount} words)` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Active Listening Section */}
      <div className="bg-blue-500 bg-opacity-20 rounded-lg p-4 border border-blue-400 border-opacity-30">
        <div className="flex items-center space-x-2 mb-3">
          <Headphones className="w-4 h-4 text-blue-300" />
          <span className="font-medium text-blue-300">
            Active Listening Mode
          </span>
        </div>
        <p className="text-sm text-blue-100 mb-3">{getListeningPrompt()}</p>

        {/* Recent Context */}
        {recentMessages.length > 0 && (
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <p className="text-xs text-blue-200 mb-2">Recent clues:</p>
            <div className="space-y-1">
              {recentMessages.map((msg, index) => (
                <p key={index} className="text-xs text-blue-100 truncate">
                  "{msg.message}"
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guessing Strategy */}
      <div className="bg-purple-500 bg-opacity-20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-4 h-4 text-purple-300" />
          <span className="font-medium text-purple-300">
            Guessing Strategy:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-purple-100">
          <div>
            <p className="font-medium mb-1">Listen for:</p>
            <ul className="space-y-1 text-xs">
              <li>• Function words ("use it to...")</li>
              <li>• Category hints ("type of...")</li>
              <li>• Physical descriptions</li>
              <li>• Context clues ("found in...")</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">When to guess:</p>
            <ul className="space-y-1 text-xs">
              <li>• After 2-3 good clues</li>
              <li>• When you're 70% sure</li>
              <li>• Before time runs out</li>
              <li>• Try partial guesses first</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Game Progress */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">{gameState.roundNumber}</div>
          <div className="text-xs text-gray-300">Round</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">{gameState.wordsCompleted}</div>
          <div className="text-xs text-gray-300">Guessed</div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">
            {Math.round(
              (gameState.wordsCompleted / gameState.roundNumber) * 100
            ) || 0}
            %
          </div>
          <div className="text-xs text-gray-300">Success</div>
        </div>
      </div>

      {/* Encouragement & Coaching */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-4 h-4 text-green-300" />
          <span className="font-medium text-green-300">Guessing Mindset:</span>
        </div>
        <div className="text-sm text-green-100">
          {gameState.wordsCompleted === 0 && (
            <p>Take your time to listen. Every clue is valuable information!</p>
          )}
          {gameState.wordsCompleted > 0 && gameState.wordsCompleted < 3 && (
            <p>
              Great guessing! You're learning {student?.name || "the student"}'s
              description style.
            </p>
          )}
          {gameState.wordsCompleted >= 3 && (
            <p>
              Excellent listening skills! You're becoming a word-guessing
              expert!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
