
export interface TileData {
  id: number; // The correct position/ID of the tile, 0 to N-1
  pos: number; // The current position on the grid
}

export interface User {
  name: string;
  picture: string;
}

export interface ScoreEntry {
  user: User;
  moves: number;
  time: number; // in seconds
  score: number;
  difficulty: number; // grid size
  date: string; // ISO string
}
