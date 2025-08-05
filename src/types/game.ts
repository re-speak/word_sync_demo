export interface GameSession {
  sessionId: string;
  participants: Player[];
  currentWord: string;
  scores: Record<string, number>;
  timeRemaining: number;
}

export interface GameState {
  currentPlayer: string;
  roundNumber: number;
  wordsCompleted: number;
  hintsUsed: number;
  isGameActive: boolean;
  gameMode: "waiting" | "playing" | "completed";
}

export interface ChatMessage {
  message: string;
  sender: string;
  timestamp: number;
  type: "chat" | "system" | "guess";
}

export interface Player {
  id: string;
  name: string;
  role: "tutor" | "student";
  isConnected: boolean;
}

export interface Word {
  id: string;
  word: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}
