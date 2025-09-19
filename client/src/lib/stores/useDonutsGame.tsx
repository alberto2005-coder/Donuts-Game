import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BoardGeneration } from "@/lib/gameLogic/BoardGeneration";
import { DonutsLogic } from "@/lib/gameLogic/DonutsLogic";
import { VictoryDetection } from "@/lib/gameLogic/VictoryDetection";
import { InsertionLogic } from "@/lib/gameLogic/InsertionLogic";
import { DonutsAI } from "@/lib/gameLogic/DonutsAI";
import type { 
  Player, 
  Direction, 
  GameMode, 
  AILevel, 
  Cell, 
  GameState, 
  Position, 
  MoveRecord, 
  VictoryLine 
} from "@/lib/gameLogic/types";

// Re-export types for components that import from this store
export type { Player, Direction, GameMode, AILevel, Cell, GameState, Position, MoveRecord, VictoryLine };

interface DonutsGameState {
  gameState: GameState;
  currentPlayer: Player;
  winner: Player | null;
  isGameOver: boolean;
  moveHistory: MoveRecord[];
  lastPlacedPosition: Position | null;
  requiredDirection: Direction | null;
  victoryLine: VictoryLine | null;
  gameMode: GameMode;
  aiLevel: AILevel;
  aiPlayer: Player;
  isAiThinking: boolean;
  
  // Actions
  initializeGame: () => void;
  resetGame: () => void;
  placePiece: (row: number, col: number) => boolean;
  switchPlayer: () => void;
  setWinner: (player: Player | null) => void;
  updatePieceCount: () => void;
  setGameMode: (mode: GameMode) => void;
  setAiLevel: (level: AILevel) => void;
  setAiPlayer: (player: Player) => void;
  makeAiMove: () => Promise<void>;
}

export const useDonutsGame = create<DonutsGameState>()(
  subscribeWithSelector((set, get) => ({
    gameState: {
      board: null,
      pieceCount: {
        vanilla: 0,
        chocolate: 0
      }
    },
    currentPlayer: 'vanilla',
    winner: null,
    isGameOver: false,
    moveHistory: [],
    lastPlacedPosition: null,
    requiredDirection: null,
    victoryLine: null,
    gameMode: 'human-vs-human',
    aiLevel: 'medium',
    aiPlayer: 'chocolate',
    isAiThinking: false,

    initializeGame: () => {
      const board = BoardGeneration.generateBoard();
      set({
        gameState: {
          board,
          pieceCount: { vanilla: 0, chocolate: 0 }
        },
        currentPlayer: 'vanilla',
        winner: null,
        isGameOver: false,
        moveHistory: [],
        lastPlacedPosition: null,
        requiredDirection: null,
        victoryLine: null
      });
    },

    resetGame: () => {
      set({
        gameState: {
          board: null,
          pieceCount: { vanilla: 0, chocolate: 0 }
        },
        currentPlayer: 'vanilla',
        winner: null,
        isGameOver: false,
        moveHistory: [],
        lastPlacedPosition: null,
        requiredDirection: null,
        victoryLine: null
      });
    },

    placePiece: (row: number, col: number): boolean => {
      const { gameState, currentPlayer, isGameOver, lastPlacedPosition, requiredDirection } = get();
      
      if (isGameOver || !gameState.board) {
        console.log("Game over or no board");
        return false;
      }

      // Check if the cell is already occupied
      if (gameState.board[row][col].piece !== null) {
        console.log("Cell already occupied at", row, col);
        return false;
      }

      // Check if move respects directional constraints
      if (requiredDirection && lastPlacedPosition) {
        const validMoves = DonutsLogic.getValidMoves(gameState.board, lastPlacedPosition, requiredDirection);
        const isValidMove = validMoves.some(pos => pos.row === row && pos.col === col);
        
        console.log("Required direction:", requiredDirection);
        console.log("Last placed position:", lastPlacedPosition);
        console.log("Valid moves:", validMoves);
        console.log("Attempted move:", { row, col });
        console.log("Is valid move:", isValidMove);
        
        if (!isValidMove) {
          // Check if disobedience rule applies (no valid moves available)
          if (validMoves.length > 0) {
            console.log("Move not allowed - there are valid moves available");
            return false; // There are valid moves, so this move is not allowed
          }
          console.log("Disobedience rule applies - no valid moves available");
          // If no valid moves, disobedience rule allows placing anywhere
        }
      }

      // Place the piece
      const newBoard = gameState.board.map(boardRow => boardRow.map(cell => ({ ...cell })));
      newBoard[row][col].piece = currentPlayer;

      // Apply insertion logic
      const conversions = InsertionLogic.applyInsertions(newBoard, { row, col }, currentPlayer);

      // Update game state
      const newGameState = {
        ...gameState,
        board: newBoard
      };

      // Count pieces
      let vanillaCount = 0;
      let chocolateCount = 0;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if (newBoard[r][c].piece === 'vanilla') vanillaCount++;
          if (newBoard[r][c].piece === 'chocolate') chocolateCount++;
        }
      }

      newGameState.pieceCount = {
        vanilla: vanillaCount,
        chocolate: chocolateCount
      };

      // Add to move history
      const newMoveHistory = [...get().moveHistory, {
        player: currentPlayer,
        row,
        col,
        conversions,
        timestamp: Date.now()
      }];

      // Check for victory
      const victoryResult = VictoryDetection.checkVictory(newBoard);
      let winner = null;
      let victoryLine = null;
      let isGameOverNew = false;

      if (victoryResult.hasWinner) {
        winner = victoryResult.winner!;
        victoryLine = victoryResult.line!;
        isGameOverNew = true;
      }

      // Determine next direction
      const nextDirection = newBoard[row][col].direction;

      set({
        gameState: newGameState,
        currentPlayer: winner ? currentPlayer : (currentPlayer === 'vanilla' ? 'chocolate' : 'vanilla'),
        winner,
        isGameOver: isGameOverNew,
        moveHistory: newMoveHistory,
        lastPlacedPosition: { row, col },
        requiredDirection: winner ? null : nextDirection,
        victoryLine
      });

      return true;
    },

    switchPlayer: () => {
      const { currentPlayer } = get();
      set({
        currentPlayer: currentPlayer === 'vanilla' ? 'chocolate' : 'vanilla'
      });
    },

    setWinner: (player: Player | null) => {
      set({
        winner: player,
        isGameOver: player !== null
      });
    },

    updatePieceCount: () => {
      const { gameState } = get();
      if (!gameState.board) return;

      let vanillaCount = 0;
      let chocolateCount = 0;

      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
          if (gameState.board[row][col].piece === 'vanilla') vanillaCount++;
          if (gameState.board[row][col].piece === 'chocolate') chocolateCount++;
        }
      }

      set({
        gameState: {
          ...gameState,
          pieceCount: {
            vanilla: vanillaCount,
            chocolate: chocolateCount
          }
        }
      });
    },

    setGameMode: (mode: GameMode) => {
      set({ gameMode: mode });
    },

    setAiLevel: (level: AILevel) => {
      set({ aiLevel: level });
    },

    setAiPlayer: (player: Player) => {
      set({ aiPlayer: player });
    },

    makeAiMove: async () => {
      const { gameState, aiLevel, aiPlayer, currentPlayer, lastPlacedPosition, requiredDirection, isGameOver } = get();
      
      if (isGameOver || currentPlayer !== aiPlayer || !gameState.board) {
        return;
      }

      set({ isAiThinking: true });

      try {
        // Add a small delay to show AI is thinking
        await new Promise(resolve => setTimeout(resolve, 500));

        const aiMove = DonutsAI.getBestMove(
          gameState.board,
          aiPlayer,
          aiLevel,
          lastPlacedPosition,
          requiredDirection
        );

        console.log(`AI (${aiLevel}) playing:`, aiMove);

        // Make the AI move
        const success = get().placePiece(aiMove.row, aiMove.col);
        if (!success) {
          console.error("AI move failed:", aiMove);
        }
      } catch (error) {
        console.error("AI move error:", error);
      } finally {
        set({ isAiThinking: false });
      }
    }
  }))
);
