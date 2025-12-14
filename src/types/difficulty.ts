// Difficulty types
export type Difficulty = 1 | 2 | 3;

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export const difficultyMap: Record<Difficulty, DifficultyLevel> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced'
};

// Type guard
export function isValidDifficulty(value: unknown): value is Difficulty {
  return value === 1 || value === 2 || value === 3;
}

// Parser function
export function parseDifficulty(value: unknown): Difficulty {
  // Handle string numbers
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (isValidDifficulty(numValue)) {
    return numValue;
  }
  
  console.warn(`Invalid difficulty value: ${value}, defaulting to 1`);
  return 1;
}

