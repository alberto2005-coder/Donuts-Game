import type { Cell, Player, Position } from "./types";

export class InsertionLogic {
  /**
   * Apply insertion logic when a piece is placed
   * Returns the number of pieces converted
   */
  static applyInsertions(board: Cell[][], position: Position, player: Player): number {
    let totalConversions = 0;
    const directions = [
      [-1, 0],  // up
      [1, 0],   // down
      [0, -1],  // left
      [0, 1],   // right
      [-1, -1], // up-left
      [-1, 1],  // up-right
      [1, -1],  // down-left
      [1, 1]    // down-right
    ];

    // Check each direction for potential insertions
    directions.forEach(([dr, dc]) => {
      const conversions = this.checkDirectionForInsertion(board, position, player, dr, dc);
      totalConversions += conversions;
    });

    return totalConversions;
  }

  /**
   * Check a specific direction for insertion opportunities
   */
  private static checkDirectionForInsertion(
    board: Cell[][], 
    position: Position, 
    player: Player, 
    dr: number, 
    dc: number
  ): number {
    const { row, col } = position;
    const opponent: Player = player === 'vanilla' ? 'chocolate' : 'vanilla';
    const piecesToFlip: Position[] = [];

    // Look for opponent pieces in this direction
    let checkRow = row + dr;
    let checkCol = col + dc;

    // Collect consecutive opponent pieces
    while (
      checkRow >= 0 && checkRow < 6 && 
      checkCol >= 0 && checkCol < 6 && 
      board[checkRow][checkCol].piece === opponent
    ) {
      piecesToFlip.push({ row: checkRow, col: checkCol });
      checkRow += dr;
      checkCol += dc;
    }

    // Check if we found a valid insertion (opponent pieces followed by our piece)
    if (
      piecesToFlip.length > 0 &&
      checkRow >= 0 && checkRow < 6 && 
      checkCol >= 0 && checkCol < 6 && 
      board[checkRow][checkCol].piece === player
    ) {
      // Valid insertion found - flip all pieces in between
      piecesToFlip.forEach(pos => {
        board[pos.row][pos.col].piece = player;
      });
      
      return piecesToFlip.length;
    }

    return 0;
  }

  /**
   * Check if placing a piece at a position would create any insertions
   * (without actually modifying the board)
   */
  static wouldCreateInsertion(board: Cell[][], position: Position, player: Player): boolean {
    const { row, col } = position;
    
    // Can't insert if position is occupied
    if (board[row][col].piece !== null) {
      return false;
    }

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    return directions.some(([dr, dc]) => {
      return this.checkDirectionForPotentialInsertion(board, position, player, dr, dc);
    });
  }

  /**
   * Check if a direction would create an insertion (without modifying board)
   */
  private static checkDirectionForPotentialInsertion(
    board: Cell[][], 
    position: Position, 
    player: Player, 
    dr: number, 
    dc: number
  ): boolean {
    const { row, col } = position;
    const opponent: Player = player === 'vanilla' ? 'chocolate' : 'vanilla';
    let opponentCount = 0;

    // Look for opponent pieces in this direction
    let checkRow = row + dr;
    let checkCol = col + dc;

    // Count consecutive opponent pieces
    while (
      checkRow >= 0 && checkRow < 6 && 
      checkCol >= 0 && checkCol < 6 && 
      board[checkRow][checkCol].piece === opponent
    ) {
      opponentCount++;
      checkRow += dr;
      checkCol += dc;
    }

    // Check if we found a valid insertion pattern
    return (
      opponentCount > 0 &&
      checkRow >= 0 && checkRow < 6 && 
      checkCol >= 0 && checkCol < 6 && 
      board[checkRow][checkCol].piece === player
    );
  }

  /**
   * Get all positions where a player could make an insertion
   */
  static getInsertionOpportunities(board: Cell[][], player: Player): Position[] {
    const opportunities: Position[] = [];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === null) {
          if (this.wouldCreateInsertion(board, { row, col }, player)) {
            opportunities.push({ row, col });
          }
        }
      }
    }

    return opportunities;
  }
}
