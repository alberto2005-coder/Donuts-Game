import type { Cell, Direction, Position } from "./types";

export class DonutsLogic {
  /**
   * Get valid moves based on the required direction from the last placed piece
   */
  static getValidMoves(board: Cell[][], lastPosition: Position, direction: Direction): Position[] {
    const validMoves: Position[] = [];
    const { row, col } = lastPosition;

    // Get direction vectors
    const vectors = this.getDirectionVectors(direction);

    // Check each direction vector
    vectors.forEach(([dr, dc]) => {
      // Check positions in this direction
      for (let i = 1; i < 6; i++) {
        const newRow = row + (dr * i);
        const newCol = col + (dc * i);

        // Check bounds
        if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
          // Check if cell is empty
          if (board[newRow][newCol].piece === null) {
            validMoves.push({ row: newRow, col: newCol });
          } else {
            // Cell is occupied, stop scanning in this direction
            break;
          }
        } else {
          break; // Out of bounds, stop checking this direction
        }
      }
    });

    return validMoves;
  }

  /**
   * Get direction vectors for a given direction
   */
  private static getDirectionVectors(direction: Direction): [number, number][] {
    switch (direction) {
      case 'horizontal':
        return [[0, -1], [0, 1]]; // Left and right only
      case 'vertical':
        return [[-1, 0], [1, 0]]; // Up and down only
      case 'diagonal-up':
        return [[-1, 1], [1, -1]]; // Up-right and down-left diagonal
      case 'diagonal-down':
        return [[-1, -1], [1, 1]]; // Up-left and down-right diagonal
      default:
        return [];
    }
  }

  /**
   * Check if a position is valid for placement
   */
  static isValidPosition(board: Cell[][], row: number, col: number): boolean {
    // Check bounds
    if (row < 0 || row >= 6 || col < 0 || col >= 6) {
      return false;
    }

    // Check if cell is empty
    return board[row][col].piece === null;
  }

  /**
   * Get all empty positions on the board
   */
  static getEmptyPositions(board: Cell[][]): Position[] {
    const emptyPositions: Position[] = [];

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col].piece === null) {
          emptyPositions.push({ row, col });
        }
      }
    }

    return emptyPositions;
  }

  /**
   * Check if the board is full
   */
  static isBoardFull(board: Cell[][]): boolean {
    return this.getEmptyPositions(board).length === 0;
  }
}
