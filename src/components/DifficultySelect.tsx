import { useState, useEffect, useRef } from 'react';
import { type Difficulty, difficultyMap } from '../types';

interface DifficultySelectProps {
  value: Difficulty | 'all';
  onChange: (value: Difficulty | 'all') => void;
}

export function DifficultySelect({ value, onChange }: DifficultySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderStars = (difficulty: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: difficulty }).map((_, i) => (
          <img 
            key={i}
            src="/cuban-star.svg"
            alt="difficulty star"
            style={{ width: '16px', height: '16px' }}
          />
        ))}
      </div>
    );
  };

  const getLabel = (val: Difficulty | 'all') => {
    if (val === 'all') return 'All Levels';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {renderStars(val)}
        <span>{difficultyMap[val]}</span>
      </div>
    );
  };

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: '180px', flex: 1 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '8px', 
          borderRadius: '4px',
          border: '2px solid #D73B2A',
          fontSize: '14px',
          backgroundColor: 'white',
          color: '#1A3A3A',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        {getLabel(value)}
        <span style={{ fontSize: '10px', marginLeft: '8px' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '2px solid #D73B2A',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          zIndex: 100,
          maxHeight: '200px',
          overflowY: 'auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div 
            className={`custom-select-option ${value === 'all' ? 'selected' : ''}`}
            onClick={() => { onChange('all'); setIsOpen(false); }}
          >
            All Levels
          </div>
          {[1, 2, 3].map((num) => {
             const diff = num as Difficulty;
             return (
              <div 
                key={diff}
                className={`custom-select-option ${value === diff ? 'selected' : ''}`}
                onClick={() => { onChange(diff); setIsOpen(false); }}
              >
                {renderStars(diff)}
                <span>{difficultyMap[diff]}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

