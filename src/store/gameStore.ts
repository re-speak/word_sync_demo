import { create } from "zustand";
import {
  GameSession,
  GameState,
  ChatMessage,
  Player,
  Word,
} from "@/types/game";

interface GameStore {
  // Game session state
  session: GameSession | null;
  gameState: GameState;
  messages: ChatMessage[];
  words: Word[];
  currentWordIndex: number;

  // Actions
  initializeGame: (players: Player[]) => void;
  joinSession: (sessionId: string, player: Player) => boolean;
  createSession: (creatorPlayer: Player) => string;
  startRound: () => void;
  endRound: (isCorrect: boolean) => void;
  updateScore: (playerId: string, points: number) => void;
  addMessage: (message: ChatMessage) => void;
  useHint: () => void;
  skipWord: () => void;
  switchRoles: () => void;
  setTimeRemaining: (time: number) => void;
  resetGame: () => void;
}

// Mock word data for PoC - 10 words for complete game experience
const mockWords: Word[] = [
  { id: "1", word: "Adventure", difficulty: "easy", category: "General" },
  { id: "2", word: "Innovation", difficulty: "medium", category: "Business" },
  { id: "3", word: "Serendipity", difficulty: "hard", category: "Abstract" },
  { id: "4", word: "Technology", difficulty: "medium", category: "Tech" },
  { id: "5", word: "Resilience", difficulty: "medium", category: "Character" },
  { id: "6", word: "Wanderlust", difficulty: "hard", category: "Emotion" },
  { id: "7", word: "Collaboration", difficulty: "medium", category: "Work" },
  { id: "8", word: "Enthusiasm", difficulty: "easy", category: "Emotion" },
  { id: "9", word: "Creativity", difficulty: "easy", category: "Character" },
  { id: "10", word: "Perspective", difficulty: "hard", category: "Abstract" },
];

// Session management utilities
const STORAGE_KEY = "wordsync-session";
const SYNC_CHANNEL = "wordsync-sync";

// Create broadcast channel for cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined") {
  broadcastChannel = new BroadcastChannel(SYNC_CHANNEL);
}

const saveSessionToStorage = (
  session: GameSession,
  gameState: GameState,
  messages: ChatMessage[],
  currentWordIndex: number
) => {
  // SSR Guard: Only run in browser environment
  if (typeof window === "undefined") {
    console.warn(
      "saveSessionToStorage: Not in browser environment, skipping localStorage save"
    );
    return;
  }

  try {
    const sessionData = {
      session,
      gameState,
      messages,
      currentWordIndex, // Include currentWordIndex in sync data
      timestamp: Date.now(),
      lastUpdate: Date.now(), // Track when state was last updated
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

    // Broadcast state change to other tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: "STATE_UPDATE",
        data: sessionData,
      });
    }
  } catch (error) {
    console.warn("Failed to save session to storage:", error);
  }
};

const loadSessionFromStorage = () => {
  // SSR Guard: Only run in browser environment
  if (typeof window === "undefined") {
    console.warn(
      "loadSessionFromStorage: Not in browser environment, returning null"
    );
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const sessionData = JSON.parse(stored);
    // Check if session is less than 2 hours old
    const isValid = Date.now() - sessionData.timestamp < 2 * 60 * 60 * 1000;

    return isValid ? sessionData : null;
  } catch (error) {
    console.warn("Failed to load session from storage:", error);
    return null;
  }
};

const clearSessionFromStorage = () => {
  // SSR Guard: Only run in browser environment
  if (typeof window === "undefined") {
    console.warn(
      "clearSessionFromStorage: Not in browser environment, skipping localStorage clear"
    );
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear session from storage:", error);
  }
};

export const useGameStore = create<GameStore>((set, get) => {
  // Set up cross-tab synchronization
  if (typeof window !== "undefined" && broadcastChannel) {
    let lastSyncTime = 0;

    broadcastChannel.onmessage = (event) => {
      const { type, data } = event.data;

      if (type === "STATE_UPDATE") {
        const currentState = get();

        // Only sync if the remote state is newer and from the same session
        if (
          data.lastUpdate > lastSyncTime &&
          data.session?.sessionId === currentState.session?.sessionId
        ) {
          console.log("Syncing state from another tab:", {
            sessionId: data.session?.sessionId,
            remoteUpdate: data.lastUpdate,
            localLastSync: lastSyncTime,
            oldCurrentWordIndex: currentState.currentWordIndex,
            newCurrentWordIndex: data.currentWordIndex,
            oldSessionWord: currentState.session?.currentWord,
            newSessionWord: data.session?.currentWord,
          });

          lastSyncTime = data.lastUpdate;

          set({
            session: data.session,
            gameState: data.gameState,
            messages: data.messages,
            currentWordIndex: data.currentWordIndex, // Sync currentWordIndex too!
          });
        }
      }
    };

    // Also listen for localStorage changes (fallback for cross-browser sync)
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          const currentState = get();

          if (
            data.lastUpdate > lastSyncTime &&
            data.session?.sessionId === currentState.session?.sessionId
          ) {
            console.log("Syncing state from localStorage event:", {
              sessionId: data.session?.sessionId,
              remoteUpdate: data.lastUpdate,
              oldCurrentWordIndex: currentState.currentWordIndex,
              newCurrentWordIndex: data.currentWordIndex,
            });

            lastSyncTime = data.lastUpdate;

            set({
              session: data.session,
              gameState: data.gameState,
              messages: data.messages,
              currentWordIndex: data.currentWordIndex, // Sync currentWordIndex too!
            });
          }
        } catch (error) {
          console.warn("Failed to parse localStorage sync data:", error);
        }
      }
    });
  }

  return {
    session: null,
    gameState: {
      currentPlayer: "",
      roundNumber: 0,
      wordsCompleted: 0,
      hintsUsed: 0,
      isGameActive: false,
      gameMode: "waiting",
    },
    messages: [],
    words: mockWords,
    currentWordIndex: 0,

    initializeGame: (players: Player[]) => {
      const sessionId = Math.random().toString(36).substr(2, 9);
      // Student-only scoring: only track the student's score
      const student = players.find((p) => p.role === "student");
      const tutor = players.find((p) => p.role === "tutor");
      const initialScores = student ? { [student.id]: 0 } : {};

      console.log("Initializing game:", {
        sessionId,
        players,
        student: student?.name,
        tutor: tutor?.name,
        initialWord: mockWords[0].word,
      });

      set({
        session: {
          sessionId,
          participants: players,
          currentWord: mockWords[0].word,
          scores: initialScores,
          timeRemaining: 60,
        },
        gameState: {
          currentPlayer: student?.id || players[0].id,
          roundNumber: 1,
          wordsCompleted: 0,
          hintsUsed: 0,
          isGameActive: true,
          gameMode: "playing",
        },
        currentWordIndex: 0,
        messages: [
          {
            message: `Game started! ${
              student?.name || "Student"
            } will describe "${mockWords[0].word}" to ${
              tutor?.name || "Tutor"
            }`,
            sender: "system",
            timestamp: Date.now(),
            type: "system",
          },
        ],
      });
    },

    createSession: (creatorPlayer: Player) => {
      // Generate a short, user-friendly session code (6 characters: letters + numbers)
      const generateSessionCode = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excludes confusing chars like I, O, 1, 0
        let code = "";
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      const sessionId = generateSessionCode();
      const initialScores =
        creatorPlayer.role === "student" ? { [creatorPlayer.id]: 0 } : {};

      console.log("Creating new session:", {
        sessionId,
        creator: creatorPlayer.name,
        role: creatorPlayer.role,
      });

      const newSession: GameSession = {
        sessionId,
        participants: [creatorPlayer],
        currentWord: mockWords[0].word,
        scores: initialScores,
        timeRemaining: 60,
      };

      const newGameState: GameState = {
        currentPlayer: creatorPlayer.id,
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 0,
        isGameActive: false, // Wait for second player
        gameMode: "waiting",
      };

      const initialMessages: ChatMessage[] = [
        {
          message: `🎮 Session ${sessionId} created! Share this code with your ${
            creatorPlayer.role === "tutor" ? "student" : "tutor"
          } to join the game.`,
          sender: "system",
          timestamp: Date.now(),
          type: "system",
        },
      ];

      set({
        session: newSession,
        gameState: newGameState,
        currentWordIndex: 0,
        messages: initialMessages,
      });

      // Save to localStorage for sharing
      saveSessionToStorage(newSession, newGameState, initialMessages, 0);

      return sessionId;
    },

    joinSession: (sessionId: string, joiningPlayer: Player) => {
      const { session, gameState, messages, currentWordIndex } = get();

      // First try to load from localStorage if no current session
      if (!session) {
        const storedData = loadSessionFromStorage();
        if (storedData && storedData.session.sessionId === sessionId) {
          console.log("Loading session from storage:", sessionId);
          set({
            session: storedData.session,
            gameState: storedData.gameState,
            messages: storedData.messages,
            currentWordIndex: storedData.currentWordIndex, // Sync currentWordIndex
          });
          // Continue with join logic below
        } else {
          console.warn("Session not found:", sessionId);
          return false;
        }
      }

      const currentSession = get().session;
      const currentGameState = get().gameState;
      const currentMessages = get().messages;
      const currentCurrentWordIndex = get().currentWordIndex;

      if (!currentSession || currentSession.sessionId !== sessionId) {
        console.warn("Session ID mismatch:", {
          expected: sessionId,
          actual: currentSession?.sessionId,
        });
        return false;
      }

      // Check if player is already in session
      const existingPlayer = currentSession.participants.find(
        (p) => p.id === joiningPlayer.id || p.role === joiningPlayer.role
      );
      if (existingPlayer) {
        console.log(
          "Player already in session or role taken:",
          joiningPlayer.role
        );
        return true; // Already joined
      }

      // Add player to session
      const updatedParticipants = [
        ...currentSession.participants,
        joiningPlayer,
      ];
      const canStartGame =
        updatedParticipants.length >= 2 &&
        updatedParticipants.some((p) => p.role === "tutor") &&
        updatedParticipants.some((p) => p.role === "student");

      const student = updatedParticipants.find((p) => p.role === "student");
      const tutor = updatedParticipants.find((p) => p.role === "tutor");

      const updatedSession: GameSession = {
        ...currentSession,
        participants: updatedParticipants,
        scores: student ? { [student.id]: 0 } : currentSession.scores,
      };

      const updatedGameState: GameState = {
        ...currentGameState,
        currentPlayer: student?.id || currentGameState.currentPlayer,
        isGameActive: canStartGame,
        gameMode: canStartGame ? "playing" : "waiting",
      };

      const joinMessage: ChatMessage = {
        message: canStartGame
          ? `${joiningPlayer.name} joined! Game starting... ${student?.name} will describe "${mockWords[0].word}" to ${tutor?.name}`
          : `${joiningPlayer.name} joined the session. Waiting for ${
              updatedParticipants.length === 1
                ? "another player"
                : "game to start"
            }...`,
        sender: "system",
        timestamp: Date.now(),
        type: "system",
      };

      const updatedMessages = [...currentMessages, joinMessage];
      const updatedCurrentWordIndex = currentCurrentWordIndex; // No change in currentWordIndex on join

      console.log("Player joined session:", {
        sessionId,
        joiningPlayer: joiningPlayer.name,
        totalPlayers: updatedParticipants.length,
        canStartGame,
        roles: updatedParticipants.map((p) => p.role),
      });

      set({
        session: updatedSession,
        gameState: updatedGameState,
        messages: updatedMessages,
        currentWordIndex: updatedCurrentWordIndex,
      });

      // Update localStorage
      saveSessionToStorage(
        updatedSession,
        updatedGameState,
        updatedMessages,
        updatedCurrentWordIndex
      );

      return true;
    },

    startRound: () => {
      const { words, currentWordIndex } = get();
      const currentWord = words[currentWordIndex];

      set((state) => ({
        session: state.session
          ? {
              ...state.session,
              currentWord: currentWord.word,
              timeRemaining: 60,
            }
          : null,
        gameState: {
          ...state.gameState,
          isGameActive: true,
        },
        currentWordIndex: currentWordIndex + 1, // Increment currentWordIndex
      }));
    },

    endRound: (isCorrect: boolean) => {
      const { session, gameState, currentWordIndex, words } = get();
      if (!session) return;

      console.log("endRound called:", {
        isCorrect,
        currentWordIndex,
        currentWord: words[currentWordIndex]?.word,
        nextWordIndex: currentWordIndex + 1,
        nextWord: words[currentWordIndex + 1]?.word,
      });

      const points = isCorrect ? 10 : 0;
      // Student-only scoring: only the student (who describes) earns points
      const student = session.participants.find((p) => p.role === "student");

      // Check if we've reached the end of words
      const isLastWord = currentWordIndex >= words.length - 1;
      const nextWordIndex = Math.min(currentWordIndex + 1, words.length - 1);
      const nextWord = words[nextWordIndex];

      console.log("Word progression:", {
        isLastWord,
        currentWordIndex,
        nextWordIndex,
        currentWord: words[currentWordIndex]?.word,
        nextWord: nextWord?.word,
      });

      const updatedSession = {
        ...session,
        scores: student
          ? {
              ...session.scores,
              [student.id]: (session.scores[student.id] || 0) + points,
            }
          : session.scores,
        currentWord: isLastWord ? session.currentWord : nextWord.word,
        timeRemaining: isLastWord ? 0 : 60,
      };

      const updatedGameState = {
        ...gameState,
        roundNumber: gameState.roundNumber + 1,
        wordsCompleted: isCorrect
          ? gameState.wordsCompleted + 1
          : gameState.wordsCompleted,
        hintsUsed: 0, // Reset hints for next round
        isGameActive: !isLastWord,
        gameMode: isLastWord ? ("completed" as const) : ("playing" as const),
      };

      const roundMessage = {
        message: isCorrect
          ? `✅ Correct! "${words[currentWordIndex].word}" completed in round ${
              gameState.roundNumber
            }. ${
              isLastWord ? "Game finished!" : `Next word: "${nextWord.word}"`
            }`
          : `⏰ Time's up! The word was "${words[currentWordIndex].word}". ${
              isLastWord ? "Game finished!" : `Next word: "${nextWord.word}"`
            }`,
        sender: "system",
        timestamp: Date.now(),
        type: "system" as const,
      };

      const updatedMessages = [...get().messages, roundMessage];
      const updatedCurrentWordIndex = nextWordIndex; // Update currentWordIndex after round ends

      console.log("Setting new state:", {
        newCurrentWordIndex: nextWordIndex,
        newCurrentWord: nextWord.word,
        newSessionCurrentWord: updatedSession.currentWord,
      });

      set({
        session: updatedSession,
        gameState: updatedGameState,
        currentWordIndex: updatedCurrentWordIndex,
        messages: updatedMessages,
      });

      // Sync with other tabs
      saveSessionToStorage(
        updatedSession,
        updatedGameState,
        updatedMessages,
        updatedCurrentWordIndex
      );
    },

    updateScore: (playerId: string, points: number) => {
      const { session, gameState, messages, currentWordIndex } = get();
      if (!session) return;

      const updatedSession = {
        ...session,
        scores: {
          ...session.scores,
          [playerId]: (session.scores[playerId] || 0) + points,
        },
      };

      set({ session: updatedSession });

      // Sync with other tabs
      saveSessionToStorage(
        updatedSession,
        gameState,
        messages,
        currentWordIndex
      );
    },

    addMessage: (message: ChatMessage) => {
      const { session, gameState, messages, currentWordIndex } = get();
      const updatedMessages = [...messages, message];

      set({ messages: updatedMessages });

      // Sync with other tabs
      if (session) {
        saveSessionToStorage(
          session,
          gameState,
          updatedMessages,
          currentWordIndex
        );
      }
    },

    useHint: () => {
      const { session, gameState, messages, currentWordIndex } = get();
      if (gameState.hintsUsed >= 3 || !session) return;

      const updatedGameState = {
        ...gameState,
        hintsUsed: gameState.hintsUsed + 1,
      };

      const hintMessage = {
        message: `💡 Hint used! (${updatedGameState.hintsUsed}/3 hints used this round)`,
        sender: "system",
        timestamp: Date.now(),
        type: "system" as const,
      };

      const updatedMessages = [...messages, hintMessage];

      set({
        gameState: updatedGameState,
        messages: updatedMessages,
      });

      // Sync with other tabs
      saveSessionToStorage(
        session,
        updatedGameState,
        updatedMessages,
        currentWordIndex
      );
    },

    skipWord: () => {
      const { session, gameState, words, currentWordIndex, messages } = get();
      if (!session || currentWordIndex >= words.length - 1) return;

      const nextWordIndex = currentWordIndex + 1;
      const nextWord = words[nextWordIndex];

      const updatedSession = {
        ...session,
        currentWord: nextWord.word,
        timeRemaining: 60,
      };

      const updatedGameState = {
        ...gameState,
        roundNumber: gameState.roundNumber + 1,
        hintsUsed: 0, // Reset hints for next round
      };

      const skipMessage = {
        message: `⏭️ Word skipped! Moving to "${nextWord.word}"`,
        sender: "system",
        timestamp: Date.now(),
        type: "system" as const,
      };

      const updatedMessages = [...messages, skipMessage];

      set({
        session: updatedSession,
        gameState: updatedGameState,
        currentWordIndex: nextWordIndex,
        messages: updatedMessages,
      });

      // Sync with other tabs
      saveSessionToStorage(
        updatedSession,
        updatedGameState,
        updatedMessages,
        nextWordIndex
      );
    },

    switchRoles: () => {
      set((state) => {
        if (!state.session) return state;

        const participants = [...state.session.participants];
        const temp = participants[0];
        participants[0] = participants[1];
        participants[1] = temp;

        return {
          session: {
            ...state.session,
            participants,
          },
          gameState: {
            ...state.gameState,
            currentPlayer: participants[0].id,
          },
          messages: [
            ...state.messages,
            {
              message: `Roles switched! ${participants[1].name} will now describe to ${participants[0].name}`,
              sender: "system",
              timestamp: Date.now(),
              type: "system",
            },
          ],
        };
      });
    },

    setTimeRemaining: (time: number) => {
      const { session, gameState, messages, currentWordIndex } = get();
      if (!session) return;

      const updatedSession = {
        ...session,
        timeRemaining: time,
      };

      set({ session: updatedSession });

      // Only sync timer updates every 5 seconds to avoid excessive sync
      if (time % 5 === 0 || time <= 10 || time === 60) {
        saveSessionToStorage(
          updatedSession,
          gameState,
          messages,
          currentWordIndex
        );
      }
    },

    resetGame: () => {
      set({
        session: null,
        gameState: {
          currentPlayer: "",
          roundNumber: 0,
          wordsCompleted: 0,
          hintsUsed: 0,
          isGameActive: false,
          gameMode: "waiting",
        },
        messages: [],
        currentWordIndex: 0,
      });
    },
  };
});
