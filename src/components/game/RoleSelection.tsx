"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  Play,
  MessageCircle,
  Clock,
  Star,
} from "lucide-react";

export default function RoleSelection() {
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
          <Link
            href="/?role=tutor"
            className="group block p-8 bg-gradient-to-br from-wordsync-navy to-gray-700 rounded-2xl text-white hover:from-wordsync-navy hover:to-wordsync-navy transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-gray-800" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">I'm a Tutor</h3>
                <p className="text-gray-200">Teaching & Guiding</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-200 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p>See the word that needs to be guessed</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p>Listen to creative student descriptions</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p>Control scoring and provide hints</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <p>Guide the learning experience</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-200">
                <strong>Perfect for:</strong> Teachers, tutors, language
                coaches, or anyone who enjoys guiding others
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-bold text-lg">
                Start Teaching
              </span>
              <Play className="w-6 h-6 text-yellow-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Student Role */}
          <Link
            href="/?role=student"
            className="group block p-8 bg-gradient-to-br from-wordsync-orange to-orange-600 rounded-2xl text-white hover:from-wordsync-orange hover:to-wordsync-orange transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-wordsync-orange" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">I'm a Student</h3>
                <p className="text-orange-100">Learning & Describing</p>
              </div>
            </div>

            <div className="space-y-3 text-orange-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p>Describe words creatively and clearly</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p>Practice communication skills</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p>Learn from real-time feedback</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <p>Build vocabulary and confidence</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
              <p className="text-sm text-orange-100">
                <strong>Perfect for:</strong> Language learners, students, or
                anyone wanting to improve communication skills
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-lg">
                Start Learning
              </span>
              <Play className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
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
