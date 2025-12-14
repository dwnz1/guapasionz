import { useState, useEffect } from 'react';
import type { Move, MoveJSON } from '../types/index';
import { parseDifficulty, parseCategoryId } from '../types/index';
import { MovesTable } from './MovesTable';

export function MovesLoader() {
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJSON = async () => {
      try {
        const response = await fetch('rueda-moves.json');
        if (!response.ok) {
          throw new Error('Failed to load JSON file');
        }
        
        const data: MoveJSON[] = await response.json();
        
        // Parse and validate JSON data into proper Move types
        const mappedMoves: Move[] = data
          .map((move) => ({
            spanishName: (move.spanishName || '').trim(),
            englishName: (move.englishName || '').trim(),
            description: (move.description || '').trim(),
            youtubeLink: (move.youtubeLink || '').trim(),
            difficulty: parseDifficulty(move.difficulty),
            categoryId: parseCategoryId((move.categoryId || '').trim())
          }))
          .filter((move) => move.spanishName || move.englishName);
        
        setMoves(mappedMoves);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    loadJSON();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading moves...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return <MovesTable moves={moves} />;
}

