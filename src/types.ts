export type GameMode = 'classic' | 'time';

export interface Block {
  id: string;
  value: number;
  x: number; // grid column
  y: number; // grid row (0 is bottom, higher is top)
  isSelected: boolean;
}

export interface GameState {
  blocks: Block[];
  targetSum: number;
  currentSum: number;
  score: number;
  highScore: number;
  gameOver: boolean;
  mode: GameMode;
  timeLeft: number; // for time mode
  level: number;
}
