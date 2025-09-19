// Shared types for the Donuts game
export type Player = 'vanilla' | 'chocolate';
export type Direction = 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down';
export type GameMode = 'human-vs-human' | 'human-vs-ai';
export type AILevel = 'easy' | 'medium' | 'hard';

export interface Cell {
  piece: Player | null;
  direction: Direction;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: Cell[][] | null;
  pieceCount: {
    vanilla: number;
    chocolate: number;
  };
}

export interface MoveRecord {
  player: Player;
  row: number;
  col: number;
  conversions: number;
  timestamp: number;
}

export interface VictoryLine {
  start: Position;
  end: Position;
  direction: string;
  positions: Position[];
}