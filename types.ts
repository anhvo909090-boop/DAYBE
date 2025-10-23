
export interface GameRound {
  image: string;
  options: string[];
  correctAnswer: string;
}

export type GameStatus = 'playing' | 'correct' | 'incorrect';

export type GameCategory = 'animals' | 'plants' | 'objects';
