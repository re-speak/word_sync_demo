"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Play,
  MessageCircle,
  Clock,
  Star,
  LogIn,
  ArrowRight,
} from "lucide-react";

export default function RoleSelection() {
  const router = useRouter();
  const [tutorSessionCode, setTutorSessionCode] = useState("");
  const [studentSessionCode, setStudentSessionCode] = useState("");

  // Format session code as user types (auto-uppercase, max 6 chars)
  const formatSessionCode = (value: string) => {
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
  };

  const handleSessionJoin = (
    role: "tutor" | "student",
    sessionCode: string
  ) => {
    if (sessionCode.length >= 3) {
      router.push(`/?role=${role}&session=${sessionCode}`);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    role: "tutor" | "student",
    sessionCode: string
  ) => {
    if (e.key === "Enter") {
      handleSessionJoin(role, sessionCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wordsync-orange to-wordsync-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-wordsync-orange rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-wordsync-navy mb-4">
            WordSync
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            The revolutionary word-guessing game where{" "}
            <strong>tutors guess</strong> and <strong>students describe</strong>
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-wordsync-orange bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-wordsync-orange" />
              </div>
              <p className="text-sm font-medium text-gray-700">60 seconds</p>
              <p className="text-xs text-gray-500">per round</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-wordsync-navy bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-6 h-6 text-wordsync-navy" />
              </div>
              <p className="text-sm font-medium text-gray-700">Real-time</p>
              <p className="text-xs text-gray-500">chat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Interactive</p>
              <p className="text-xs text-gray-500">learning</p>
            </div>
          </div>
        </div>

        {/* Game Preview */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            How It Works:
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-wordsync-orange rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800">
                1. Student Describes
              </h4>
              <p className="text-sm text-gray-600">
                "It's something you use to write, has ink, and you click the
                top..."
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-wordsync-navy rounded-full flex items-center justify-center mx-auto">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800">2. Tutor Guesses</h4>
              <p className="text-sm text-gray-600">
                "Is it a pen?" "Yes, correct!"
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-wordsync-green rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800">3. Learn Together</h4>
              <p className="text-sm text-gray-600">
                Points scored, roles can switch, everyone learns!
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Tutor Role */}
          <div className="space-y-4">
            {/* New Game Button */}
            <Link
              href="/?role=tutor"
              className="group block p-6 bg-gradient-to-br from-wordsync-navy to-gray-700 rounded-2xl text-white hover:from-wordsync-navy hover:to-wordsync-navy transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-gray-800" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">I'm a Tutor</h3>
                  <p className="text-gray-200 text-sm">Start New Game</p>
                </div>
              </div>

              <div className="space-y-2 text-gray-200 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  <p>Create a session & get a code to share</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  <p>Guide the learning experience</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-bold">
                  Create New Game
                </span>
                <Play className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Join Existing Session */}
            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-wordsync-navy bg-opacity-20 rounded-lg flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-wordsync-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    Join Existing Game
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enter the session code
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ABC123"
                    value={tutorSessionCode}
                    onChange={(e) =>
                      setTutorSessionCode(formatSessionCode(e.target.value))
                    }
                    onKeyPress={(e) =>
                      handleKeyPress(e, "tutor", tutorSessionCode)
                    }
                    className="w-full px-4 py-3 text-center text-lg font-mono font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-wordsync-navy focus:outline-none tracking-widest uppercase"
                    maxLength={6}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-xs text-gray-400">
                      {tutorSessionCode.length}/6
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSessionJoin("tutor", tutorSessionCode)}
                  disabled={tutorSessionCode.length < 3}
                  className="w-full py-3 bg-wordsync-navy text-white font-bold rounded-lg hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Join as Tutor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Student Role */}
          <div className="space-y-4">
            {/* New Game Button */}
            <Link
              href="/?role=student"
              className="group block p-6 bg-gradient-to-br from-wordsync-orange to-orange-600 rounded-2xl text-white hover:from-wordsync-orange hover:to-wordsync-orange transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-wordsync-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">I'm a Student</h3>
                  <p className="text-orange-100 text-sm">Start New Game</p>
                </div>
              </div>

              <div className="space-y-2 text-orange-100 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <p>Create a session & invite your tutor</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <p>Practice communication skills</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Create New Game</span>
                <Play className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Join Existing Session */}
            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-wordsync-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-wordsync-orange" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    Join Existing Game
                  </h4>
                  <p className="text-sm text-gray-600">
                    Enter the session code
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ABC123"
                    value={studentSessionCode}
                    onChange={(e) =>
                      setStudentSessionCode(formatSessionCode(e.target.value))
                    }
                    onKeyPress={(e) =>
                      handleKeyPress(e, "student", studentSessionCode)
                    }
                    className="w-full px-4 py-3 text-center text-lg font-mono font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-wordsync-orange focus:outline-none tracking-widest uppercase"
                    maxLength={6}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-xs text-gray-400">
                      {studentSessionCode.length}/6
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleSessionJoin("student", studentSessionCode)
                  }
                  disabled={studentSessionCode.length < 3}
                  className="w-full py-3 bg-wordsync-orange text-white font-bold rounded-lg hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Join as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Session Code Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              How to Connect with Others
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <p className="font-semibold text-blue-700">
                  Option 1: Session Code
                </p>
                <p>• Create a game and share your 6-digit code</p>
                <p>
                  • Others can join using the "Join Existing Game" boxes above
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-purple-700">
                  Option 2: Share Link
                </p>
                <p>• Copy your game URL and send it directly</p>
                <p>• Others can click the link to join instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            🔄 Don't worry - you can always switch roles during the game!
          </p>
          <div className="bg-gradient-to-r from-wordsync-orange to-wordsync-navy rounded-lg p-4">
            <p className="text-white text-sm">
              <strong>💡 Pro Tip:</strong> Try both roles to experience the full
              learning journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
