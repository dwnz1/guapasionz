import type { Difficulty } from './difficulty';
import type { CategoryId } from './category';

// Move types
export interface Move {
  spanishName: string;
  englishName: string;
  description: string;
  youtubeLink: string;
  difficulty: Difficulty;
  categoryId: CategoryId;
}

// JSON structure (as stored in files)
export interface MoveJSON {
  spanishName: string;
  englishName: string;
  description: string;
  youtubeLink: string;
  difficulty: number | string;
  categoryId: string;
}

