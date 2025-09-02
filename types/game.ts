export interface Position {
  x: number;
  y: number;
}

export interface MazeCell {
  type: 'path' | 'wall';
  openPaths: Direction[];
  nextOpenPaths: Direction[];
  isStart?: boolean;
  isEnd?: boolean;
  hasPowerUp?: PowerUpType;
}

export type Direction = 'north' | 'south' | 'east' | 'west';

export type GameStatus = 'playing' | 'paused' | 'won' | 'lost';

export type PowerUpType = 
  | 'speed'
  | 'time'
  | 'shield'
  | 'preview'
  | 'multiplier';

export interface PowerUp {
  type: PowerUpType;
  duration?: number;
  active: boolean;
  timeLeft?: number;
}

export interface GameState {
  level: number;
  score: number;
  timeLeft: number;
  gameStatus: GameStatus;
  playerPosition: Position;
  playerDirection: Direction;
  maze: MazeCell[][];
  accidentPosition: Position | null;
  powerUps: PowerUp[];
  combo: number;
  streak: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'dark' | 'light' | 'neon';
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface HighScore {
  score: number;
  level: number;
  date: string;
  time: number;
}
