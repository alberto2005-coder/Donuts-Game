import { Cell, Direction } from "../stores/useDonutsGame";

export class BoardGeneration {
  /**
   * Generate a random 6x6 board from 4 modular 3x3 tiles
   */
  static generateBoard(): Cell[][] {
    // Create 4 random 3x3 tiles
    const tiles = [
      this.generateTile(),
      this.generateTile(),
      this.generateTile(),
      this.generateTile()
    ];

    // Arrange tiles in 2x2 formation to create 6x6 board
    const board: Cell[][] = [];

    // Top half (tiles 0 and 1)
    for (let row = 0; row < 3; row++) {
      const boardRow: Cell[] = [];
      
      // Left tile (tile 0)
      for (let col = 0; col < 3; col++) {
        boardRow.push(tiles[0][row][col]);
      }
      
      // Right tile (tile 1)
      for (let col = 0; col < 3; col++) {
        boardRow.push(tiles[1][row][col]);
      }
      
      board.push(boardRow);
    }

    // Bottom half (tiles 2 and 3)
    for (let row = 0; row < 3; row++) {
      const boardRow: Cell[] = [];
      
      // Left tile (tile 2)
      for (let col = 0; col < 3; col++) {
        boardRow.push(tiles[2][row][col]);
      }
      
      // Right tile (tile 3)
      for (let col = 0; col < 3; col++) {
        boardRow.push(tiles[3][row][col]);
      }
      
      board.push(boardRow);
    }

    return board;
  }

  /**
   * Generate a single 3x3 tile with random directions
   */
  private static generateTile(): Cell[][] {
    const directions: Direction[] = ['horizontal', 'vertical', 'diagonal-up', 'diagonal-down'];
    const tile: Cell[][] = [];

    for (let row = 0; row < 3; row++) {
      const tileRow: Cell[] = [];
      for (let col = 0; col < 3; col++) {
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        tileRow.push({
          piece: null,
          direction: randomDirection
        });
      }
      tile.push(tileRow);
    }

    return tile;
  }

  /**
   * Create a specific tile configuration (for testing or predefined layouts)
   */
  static createTileWithPattern(pattern: Direction[][]): Cell[][] {
    if (pattern.length !== 3 || pattern[0].length !== 3) {
      throw new Error("Pattern must be 3x3");
    }

    const tile: Cell[][] = [];
    for (let row = 0; row < 3; row++) {
      const tileRow: Cell[] = [];
      for (let col = 0; col < 3; col++) {
        tileRow.push({
          piece: null,
          direction: pattern[row][col]
        });
      }
      tile.push(tileRow);
    }

    return tile;
  }

  /**
   * Get a random direction
   */
  static getRandomDirection(): Direction {
    const directions: Direction[] = ['horizontal', 'vertical', 'diagonal-up', 'diagonal-down'];
    return directions[Math.floor(Math.random() * directions.length)];
  }
}
