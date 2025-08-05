import { render, screen, fireEvent } from "@testing-library/react";
import GameControls from "@/components/game/GameControls";
import { useGameStore } from "@/store/gameStore";

// Mock the game store
jest.mock("@/store/gameStore");
const mockUseGameStore = useGameStore as jest.MockedFunction<
  typeof useGameStore
>;

describe("GameControls Component", () => {
  const mockEndRound = jest.fn();
  const mockUseHint = jest.fn();
  const mockSkipWord = jest.fn();
  const mockSwitchRoles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows message when no session is active", () => {
    mockUseGameStore.mockReturnValue({
      session: null,
      gameState: { hintsUsed: 0 } as any,
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [],
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    expect(
      screen.getByText("Start a game to see controls")
    ).toBeInTheDocument();
  });

  it("displays current word and game controls when session is active", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        currentWord: "Adventure",
        participants: [],
        scores: {},
        timeRemaining: 60,
      },
      gameState: {
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 0,
      },
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [{}, {}, {}], // Mock 3 words
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("Round 1 • 0 completed")).toBeInTheDocument();
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.getByText("Miss")).toBeInTheDocument();
  });

  it("calls endRound(true) when correct button is clicked", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        currentWord: "Adventure",
        participants: [],
        scores: {},
        timeRemaining: 60,
      },
      gameState: {
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 0,
      },
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [{}, {}, {}],
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    fireEvent.click(screen.getByText("Correct!"));
    expect(mockEndRound).toHaveBeenCalledWith(true);
  });

  it("calls endRound(false) when miss button is clicked", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        currentWord: "Adventure",
        participants: [],
        scores: {},
        timeRemaining: 60,
      },
      gameState: {
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 0,
      },
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [{}, {}, {}],
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    fireEvent.click(screen.getByText("Miss"));
    expect(mockEndRound).toHaveBeenCalledWith(false);
  });

  it("calls useHint when hint button is clicked", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        currentWord: "Adventure",
        participants: [],
        scores: {},
        timeRemaining: 60,
      },
      gameState: {
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 0,
      },
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [{}, {}, {}],
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    fireEvent.click(screen.getByText("Hint"));
    expect(mockUseHint).toHaveBeenCalled();
  });

  it("disables hint button when max hints reached", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        currentWord: "Adventure",
        participants: [],
        scores: {},
        timeRemaining: 60,
      },
      gameState: {
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 3, // Max hints reached
      },
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [{}, {}, {}],
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    // Find the button element by role and text content
    const hintButton = screen.getByRole("button", { name: /hint/i });
    expect(hintButton).toBeDisabled();
    expect(screen.getByText("No more hints available")).toBeInTheDocument();
  });

  it("calls switchRoles when switch button is clicked", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        currentWord: "Adventure",
        participants: [],
        scores: {},
        timeRemaining: 60,
      },
      gameState: {
        roundNumber: 1,
        wordsCompleted: 0,
        hintsUsed: 0,
      },
      endRound: mockEndRound,
      useHint: mockUseHint,
      skipWord: mockSkipWord,
      switchRoles: mockSwitchRoles,
      words: [{}, {}, {}],
      currentWordIndex: 0,
    } as any);

    render(<GameControls />);

    fireEvent.click(screen.getByText("Switch"));
    expect(mockSwitchRoles).toHaveBeenCalled();
  });
});
