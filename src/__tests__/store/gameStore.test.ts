import { useGameStore } from "@/store/gameStore";
import { Player } from "@/types/game";

describe("Game Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameStore.getState().resetGame();
  });

  it("initializes game with players", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);

    const state = useGameStore.getState();
    expect(state.session).toBeTruthy();
    expect(state.session?.participants).toEqual(players);
    expect(state.gameState.gameMode).toBe("playing");
    expect(state.gameState.isGameActive).toBe(true);
  });

  it("updates score correctly", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);
    useGameStore.getState().updateScore("2", 10); // Student gets the score

    const state = useGameStore.getState();
    expect(state.session?.scores["2"]).toBe(10); // Check student score
  });

  it("ends round with correct guess", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);
    const initialRoundNumber = useGameStore.getState().gameState.roundNumber;

    useGameStore.getState().endRound(true);

    const state = useGameStore.getState();
    expect(state.gameState.roundNumber).toBe(initialRoundNumber + 1);
    expect(state.gameState.wordsCompleted).toBe(1);
    expect(state.session?.scores["2"]).toBe(10); // Student gets 10 points for correct guess
  });

  it("ends round with incorrect guess", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);

    useGameStore.getState().endRound(false);

    const state = useGameStore.getState();
    expect(state.session?.scores["2"]).toBe(0); // Student gets no points for incorrect guess
  });

  it("uses hint and tracks usage", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);

    useGameStore.getState().useHint();

    const state = useGameStore.getState();
    expect(state.gameState.hintsUsed).toBe(1);
    expect(state.messages).toContainEqual(
      expect.objectContaining({
        message: "Hint used! Try thinking about the category or first letter.",
        type: "system",
      })
    );
  });

  it("skips word correctly", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);
    const initialWord = useGameStore.getState().session?.currentWord;

    useGameStore.getState().skipWord();

    const state = useGameStore.getState();
    expect(state.session?.currentWord).not.toBe(initialWord);
    expect(state.currentWordIndex).toBe(1);
  });

  it("switches roles correctly", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);
    const initialCurrentPlayer =
      useGameStore.getState().gameState.currentPlayer;

    useGameStore.getState().switchRoles();

    const state = useGameStore.getState();
    expect(state.gameState.currentPlayer).not.toBe(initialCurrentPlayer);
    expect(state.session?.participants[0].id).toBe("2"); // Roles switched
    expect(state.session?.participants[1].id).toBe("1");
  });

  it("resets game state", () => {
    const players: Player[] = [
      { id: "1", name: "Player 1", role: "tutor", isConnected: true },
      { id: "2", name: "Player 2", role: "student", isConnected: true },
    ];

    useGameStore.getState().initializeGame(players);
    useGameStore.getState().resetGame();

    const state = useGameStore.getState();
    expect(state.session).toBeNull();
    expect(state.gameState.gameMode).toBe("waiting");
    expect(state.messages).toEqual([]);
    expect(state.currentWordIndex).toBe(0);
  });
});
