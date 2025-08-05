import { render, screen, act } from "@testing-library/react";
import Timer from "@/components/game/Timer";
import { useGameStore } from "@/store/gameStore";

// Mock the game store
jest.mock("@/store/gameStore");
const mockUseGameStore = useGameStore as jest.MockedFunction<
  typeof useGameStore
>;

describe("Timer Component", () => {
  const mockSetTimeRemaining = jest.fn();
  const mockOnTimeUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        participants: [],
        currentWord: "test",
        scores: {},
        timeRemaining: 60,
      },
      setTimeRemaining: mockSetTimeRemaining,
    } as any);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders timer with initial time", () => {
    render(<Timer onTimeUp={mockOnTimeUp} />);

    expect(screen.getByText("60s")).toBeInTheDocument();
    expect(screen.getByText("Take your time")).toBeInTheDocument();
  });

  it("counts down from 60 to 0", async () => {
    render(<Timer onTimeUp={mockOnTimeUp} />);

    // Fast-forward 1 second with proper act wrapping
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockSetTimeRemaining).toHaveBeenCalledWith(59);
  });

  it("calls onTimeUp when timer reaches 0", async () => {
    // Start with 0 seconds remaining to test immediate trigger
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        participants: [],
        currentWord: "test",
        scores: {},
        timeRemaining: 0,
      },
      setTimeRemaining: mockSetTimeRemaining,
    } as any);

    render(<Timer onTimeUp={mockOnTimeUp} />);

    // onTimeUp should be called immediately when timeLeft <= 0
    expect(mockOnTimeUp).toHaveBeenCalled();
  });

  it("shows warning message when time is low", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        participants: [],
        currentWord: "test",
        scores: {},
        timeRemaining: 15,
      },
      setTimeRemaining: mockSetTimeRemaining,
    } as any);

    render(<Timer onTimeUp={mockOnTimeUp} />);

    expect(screen.getByText("Hurry up!")).toBeInTheDocument();
  });

  it("shows urgent message when time is very low", () => {
    mockUseGameStore.mockReturnValue({
      session: {
        sessionId: "test-session",
        participants: [],
        currentWord: "test",
        scores: {},
        timeRemaining: 5,
      },
      setTimeRemaining: mockSetTimeRemaining,
    } as any);

    render(<Timer onTimeUp={mockOnTimeUp} />);

    expect(screen.getByText("Almost out of time!")).toBeInTheDocument();
  });
});
