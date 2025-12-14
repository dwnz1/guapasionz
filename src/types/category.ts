// Category types
export type CategoryId = 
  | 'basic'
  | 'partner-exchange'
  | 'turn-simple'
  | 'turn-complex'
  | 'styling'
  | 'thematic'
  | 'sequence'
  | 'directional';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
}

// JSON structure (as stored in files)
export interface CategoryJSON {
  id: string;
  name: string;
  description: string;
}

// Type guard
export function isValidCategoryId(value: unknown): value is CategoryId {
  const validCategories: CategoryId[] = [
    'basic',
    'partner-exchange',
    'turn-simple',
    'turn-complex',
    'styling',
    'thematic',
    'sequence',
    'directional'
  ];
  return typeof value === 'string' && validCategories.includes(value as CategoryId);
}

// Parser function
export function parseCategoryId(value: unknown): CategoryId {
  if (isValidCategoryId(value)) {
    return value;
  }
  
  console.warn(`Invalid categoryId: ${value}, defaulting to 'basic'`);
  return 'basic';
}

