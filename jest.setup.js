import "@testing-library/jest-dom";

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mocked-inter",
  }),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Send: () => <div data-testid="send-icon" />,
  User: () => <div data-testid="user-icon" />,
  Bot: () => <div data-testid="bot-icon" />,
  Trophy: () => <div data-testid="trophy-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  SkipForward: () => <div data-testid="skip-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Pause: () => <div data-testid="pause-icon" />,
  Users: () => <div data-testid="users-icon" />,
  RotateCcw: () => <div data-testid="rotate-icon" />,
}));

// Mock timers for timer tests
global.beforeEach(() => {
  jest.useFakeTimers();
});

global.afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
