import { Cell, Player, Position, AILevel, Direction } from "./types";
import { DonutsLogic } from "./DonutsLogic";
import { VictoryDetection } from "./VictoryDetection";
import { InsertionLogic } from "./InsertionLogic";

export interface AIMove {
  row: number;
  col: number;
  score: number;
  reasoning: string;
}

export class DonutsAI {
  /**
   * Get the best AI move for the given board state and difficulty level
   */
  static getBestMove(
    board: Cell[][],
    player: Player,
    aiLevel: AILevel,
    lastPlacedPosition: Position | null,
    requiredDirection: Direction | null
  ): AIMove {
    switch (aiLevel) {
      case 'easy':
        return this.getEasyMove(board, player, lastPlacedPosition, requiredDirection);
      case 'medium':
        return this.getMediumMove(board, player, lastPlacedPosition, requiredDirection);
      case 'hard':
        return this.getHardMove(board, player, lastPlacedPosition, requiredDirection);
      default:
        return this.getEasyMove(board, player, lastPlacedPosition, requiredDirection);
    }
  }

  /**
   * Easy AI: Random valid move
   */
  private static getEasyMove(
    board: Cell[][],
    player: Player,
    lastPlacedPosition: Position | null,
    requiredDirection: Direction | null
  ): AIMove {
    const validMoves = this.getValidMoves(board, lastPlacedPosition, requiredDirection);
    
    if (validMoves.length === 0) {
      // Disobedience rule - can place anywhere
      const emptyPositions = DonutsLogic.getEmptyPositions(board);
      const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
      return {
        row: randomPos.row,
        col: randomPos.col,
        score: 0,
        reasoning: "Random move (disobedience)"
      };
    }

    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return {
      row: randomMove.row,
      col: randomMove.col,
      score: 0,
      reasoning: "Random valid move"
    };
  }

  /**
   * Medium AI: Basic heuristics
   */
  private static getMediumMove(
    board: Cell[][],
    player: Player,
    lastPlacedPosition: Position | null,
    requiredDirection: Direction | null
  ): AIMove {
    const opponent: Player = player === 'vanilla' ? 'chocolate' : 'vanilla';
    const validMoves = this.getValidMoves(board, lastPlacedPosition, requiredDirection);
    
    if (validMoves.length === 0) {
      // Disobedience rule - evaluate all empty positions
      validMoves.push(...DonutsLogic.getEmptyPositions(board));
    }

    let bestMove: AIMove = {
      row: validMoves[0].row,
      col: validMoves[0].col,
      score: -1000,
      reasoning: "Default move"
    };

    for (const move of validMoves) {
      const score = this.evaluateMove(board, move, player, opponent);
      if (score > bestMove.score) {
        bestMove = {
          row: move.row,
          col: move.col,
          score: score,
          reasoning: this.getMoveReasoning(score)
        };
      }
    }

    return bestMove;
  }

  /**
   * Hard AI: Minimax algorithm with alpha-beta pruning
   */
  private static getHardMove(
    board: Cell[][],
    player: Player,
    lastPlacedPosition: Position | null,
    requiredDirection: Direction | null
  ): AIMove {
    const validMoves = this.getValidMoves(board, lastPlacedPosition, requiredDirection);
    
    if (validMoves.length === 0) {
      // Disobedience rule - evaluate all empty positions
      validMoves.push(...DonutsLogic.getEmptyPositions(board));
    }

    const depth = 4; // Look ahead 4 moves
    let bestMove: AIMove = {
      row: validMoves[0].row,
      col: validMoves[0].col,
      score: -10000,
      reasoning: "Minimax analysis"
    };

    for (const move of validMoves) {
      const boardCopy = this.copyBoard(board);
      boardCopy[move.row][move.col].piece = player;
      InsertionLogic.applyInsertions(boardCopy, move, player);

      const score = this.minimax(boardCopy, depth - 1, false, player, -10000, 10000, move);
      
      if (score > bestMove.score) {
        bestMove = {
          row: move.row,
          col: move.col,
          score: score,
          reasoning: `Minimax (depth ${depth}): ${score}`
        };
      }
    }

    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  private static minimax(
    board: Cell[][],
    depth: number,
    isMaximizing: boolean,
    aiPlayer: Player,
    alpha: number,
    beta: number,
    lastMove: Position
  ): number {
    // Check for terminal states
    const victory = VictoryDetection.checkVictory(board);
    if (victory.hasWinner) {
      if (victory.winner === aiPlayer) {
        return 1000 + depth; // Prefer quicker victories
      } else {
        return -1000 - depth; // Prefer slower defeats
      }
    }

    if (depth === 0) {
      return this.evaluateBoard(board, aiPlayer);
    }

    const currentPlayer = isMaximizing ? aiPlayer : (aiPlayer === 'vanilla' ? 'chocolate' : 'vanilla');
    const direction = board[lastMove.row][lastMove.col].direction;
    const validMoves = DonutsLogic.getValidMoves(board, lastMove, direction);
    
    // If no valid moves, use disobedience rule
    if (validMoves.length === 0) {
      validMoves.push(...DonutsLogic.getEmptyPositions(board));
    }

    if (isMaximizing) {
      let maxScore = -10000;
      for (const move of validMoves) {
        const boardCopy = this.copyBoard(board);
        boardCopy[move.row][move.col].piece = currentPlayer;
        InsertionLogic.applyInsertions(boardCopy, move, currentPlayer);
        
        const score = this.minimax(boardCopy, depth - 1, false, aiPlayer, alpha, beta, move);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return maxScore;
    } else {
      let minScore = 10000;
      for (const move of validMoves) {
        const boardCopy = this.copyBoard(board);
        boardCopy[move.row][move.col].piece = currentPlayer;
        InsertionLogic.applyInsertions(boardCopy, move, currentPlayer);
        
        const score = this.minimax(boardCopy, depth - 1, true, aiPlayer, alpha, beta, move);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return minScore;
    }
  }

  /**
   * Evaluate a single move for medium AI
   */
  private static evaluateMove(board: Cell[][], move: Position, player: Player, opponent: Player): number {
    let score = 0;

    // Make a copy and simulate the move
    const boardCopy = this.copyBoard(board);
    boardCopy[move.row][move.col].piece = player;
    const conversions = InsertionLogic.applyInsertions(boardCopy, move, player);

    // Check if this move wins
    const victory = VictoryDetection.checkVictory(boardCopy);
    if (victory.hasWinner && victory.winner === player) {
      return 1000; // Winning move
    }

    // Check if this move prevents opponent from winning
    const threatsBefore = VictoryDetection.getThreatPositions(board, opponent);
    const threatsAfter = VictoryDetection.getThreatPositions(boardCopy, opponent);
    if (threatsBefore.length > threatsAfter.length) {
      score += 500; // Blocking opponent
    }

    // Value conversions
    score += conversions * 50;

    // Prefer center positions
    const centerDistance = Math.abs(move.row - 2.5) + Math.abs(move.col - 2.5);
    score += (5 - centerDistance) * 10;

    // Consider insertion opportunities created
    const insertionOpportunities = InsertionLogic.getInsertionOpportunities(boardCopy, player);
    score += insertionOpportunities.length * 20;

    return score;
  }

  /**
   * Evaluate the entire board position for AI
   */
  private static evaluateBoard(board: Cell[][], player: Player): number {
    let score = 0;
    const opponent: Player = player === 'vanilla' ? 'chocolate' : 'vanilla';

    // Count pieces
    let aiPieces = 0;
    let opponentPieces = 0;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === player) aiPieces++;
        if (board[row][col].piece === opponent) opponentPieces++;
      }
    }

    score += (aiPieces - opponentPieces) * 10;

    // Evaluate positional advantages
    score += this.evaluatePatterns(board, player) - this.evaluatePatterns(board, opponent);

    // Consider insertion opportunities
    const aiInsertions = InsertionLogic.getInsertionOpportunities(board, player);
    const opponentInsertions = InsertionLogic.getInsertionOpportunities(board, opponent);
    score += (aiInsertions.length - opponentInsertions.length) * 25;

    return score;
  }

  /**
   * Evaluate patterns on the board (lines of 2, 3, 4 pieces)
   */
  private static evaluatePatterns(board: Cell[][], player: Player): number {
    let score = 0;
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
    ];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === player) {
          for (const [dr, dc] of directions) {
            const lineLength = this.getLineLength(board, row, col, dr, dc, player);
            if (lineLength >= 2) {
              score += Math.pow(lineLength, 2) * 5; // Exponential reward for longer lines
            }
          }
        }
      }
    }

    return score;
  }

  /**
   * Get the length of a line of pieces in a direction
   */
  private static getLineLength(board: Cell[][], row: number, col: number, dr: number, dc: number, player: Player): number {
    let length = 1;
    
    // Check forward
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 6 && board[r][c].piece === player) {
      length++;
      r += dr;
      c += dc;
    }
    
    // Check backward
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 6 && board[r][c].piece === player) {
      length++;
      r -= dr;
      c -= dc;
    }
    
    return length;
  }

  /**
   * Get valid moves considering directional constraints
   */
  private static getValidMoves(board: Cell[][], lastPlacedPosition: Position | null, requiredDirection: Direction | null): Position[] {
    if (requiredDirection && lastPlacedPosition) {
      return DonutsLogic.getValidMoves(board, lastPlacedPosition, requiredDirection);
    }
    return DonutsLogic.getEmptyPositions(board);
  }

  /**
   * Copy board state
   */
  private static copyBoard(board: Cell[][]): Cell[][] {
    return board.map(row => row.map(cell => ({ ...cell })));
  }

  /**
   * Get reasoning text for move score
   */
  private static getMoveReasoning(score: number): string {
    if (score >= 1000) return "Winning move!";
    if (score >= 500) return "Blocking opponent threat";
    if (score >= 100) return "Good tactical position";
    if (score >= 50) return "Creating insertion opportunity";
    if (score >= 0) return "Decent positional play";
    return "Defensive move";
  }
}