import type { Cell, Player, Position } from "./types";

export interface VictoryResult {
  hasWinner: boolean;
  winner?: Player;
  line?: {
    start: Position;
    end: Position;
    direction: string;
    positions: Position[];
  };
}

export class VictoryDetection {
  /**
   * Check if there's a winner on the board
   */
  static checkVictory(board: Cell[][]): VictoryResult {
    // Check all possible 5-in-a-row patterns
    const directions = [
      { dr: 0, dc: 1, name: 'horizontal' },  // horizontal
      { dr: 1, dc: 0, name: 'vertical' },    // vertical
      { dr: 1, dc: 1, name: 'diagonal-down' }, // diagonal down-right
      { dr: 1, dc: -1, name: 'diagonal-up' }  // diagonal down-left
    ];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        const piece = board[row][col].piece;
        if (!piece) continue;

        // Check each direction from this position
        for (const { dr, dc, name } of directions) {
          const result = this.checkDirection(board, row, col, dr, dc, piece);
          if (result.count >= 5) {
            return {
              hasWinner: true,
              winner: piece,
              line: {
                start: { row, col },
                end: { row: row + (dr * (result.count - 1)), col: col + (dc * (result.count - 1)) },
                direction: name,
                positions: result.positions
              }
            };
          }
        }
      }
    }

    return { hasWinner: false };
  }

  /**
   * Check a specific direction from a starting position
   */
  private static checkDirection(
    board: Cell[][], 
    startRow: number, 
    startCol: number, 
    dr: number, 
    dc: number, 
    player: Player
  ): { count: number; positions: Position[] } {
    let count = 0;
    const positions: Position[] = [];
    let row = startRow;
    let col = startCol;

    // Count consecutive pieces in this direction
    while (
      row >= 0 && row < 6 && 
      col >= 0 && col < 6 && 
      board[row][col].piece === player
    ) {
      count++;
      positions.push({ row, col });
      row += dr;
      col += dc;
    }

    return { count, positions };
  }

  /**
   * Check if the game is a draw (board full, no winner)
   */
  static isDraw(board: Cell[][]): boolean {
    // Check if board is full
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === null) {
          return false; // Board not full
        }
      }
    }

    // Board is full, check if there's no winner
    return !this.checkVictory(board).hasWinner;
  }

  /**
   * Get all winning positions for a player (positions that would create 5-in-a-row)
   */
  static getWinningPositions(board: Cell[][], player: Player): Position[] {
    const winningPositions: Position[] = [];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === null) {
          // Temporarily place piece and check for victory
          board[row][col].piece = player;
          const result = this.checkVictory(board);
          
          if (result.hasWinner && result.winner === player) {
            winningPositions.push({ row, col });
          }
          
          // Remove temporary piece
          board[row][col].piece = null;
        }
      }
    }

    return winningPositions;
  }

  /**
   * Check for potential threats (opponent winning positions)
   */
  static getThreatPositions(board: Cell[][], player: Player): Position[] {
    const opponent: Player = player === 'vanilla' ? 'chocolate' : 'vanilla';
    return this.getWinningPositions(board, opponent);
  }

  /**
   * Evaluate board position for AI purposes
   */
  static evaluatePosition(board: Cell[][], player: Player): number {
    let score = 0;
    const opponent: Player = player === 'vanilla' ? 'chocolate' : 'vanilla';

    // Count pieces
    let playerPieces = 0;
    let opponentPieces = 0;

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === player) playerPieces++;
        if (board[row][col].piece === opponent) opponentPieces++;
      }
    }

    score += (playerPieces - opponentPieces) * 10;

    // Check for winning/losing positions
    const playerWins = this.getWinningPositions(board, player);
    const opponentWins = this.getWinningPositions(board, opponent);

    score += playerWins.length * 1000;
    score -= opponentWins.length * 1000;

    return score;
  }
}
