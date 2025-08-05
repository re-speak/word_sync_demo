"use client";

import { useState, useRef, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { ChatMessage } from "@/types/game";
import { Send, User, Bot } from "lucide-react";

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, session } = useGameStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !session) return;

    const newMessage: ChatMessage = {
      message: inputMessage.trim(),
      sender: "user", // In a real app, this would be the current user
      timestamp: Date.now(),
      type: "chat",
    };

    addMessage(newMessage);
    setInputMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type: string, sender: string) => {
    if (type === "system")
      return <Bot className="w-4 h-4 text-wordsync-orange" />;
    return <User className="w-4 h-4 text-wordsync-navy" />;
  };

  const getMessageStyles = (type: string, sender: string) => {
    if (type === "system") {
      return "bg-gray-100 text-gray-700 text-center italic";
    }
    if (sender === "user") {
      return "bg-wordsync-orange text-white ml-auto";
    }
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-wordsync-navy">Game Chat</h3>
        <p className="text-sm text-gray-500">
          {session ? `Session: ${session.sessionId}` : "Not connected"}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start space-x-2">
            {getMessageIcon(message.type, message.sender)}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${getMessageStyles(
                message.type,
                message.sender
              )}`}
            >
              <p className="text-sm">{message.message}</p>
              <span className="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <div className="bg-gray-200 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your guess or description..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wordsync-orange focus:border-transparent"
            disabled={!session}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !session}
            className="px-4 py-2 bg-wordsync-orange text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-wordsync-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
