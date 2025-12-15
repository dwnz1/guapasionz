import { useState, useEffect, useMemo } from 'react';
import type { Move, Category, CategoryId, Difficulty, CategoryJSON } from '../types/index';
import { difficultyMap } from '../types/index';
import { YouTubeModal } from './YouTubeModal';
import { DifficultySelect } from './DifficultySelect';

interface MovesTableProps {
  moves: Move[];
}

type SortField = 'spanishName' | 'difficulty';
type SortDirection = 'asc' | 'desc';

export function MovesTable({ moves }: MovesTableProps) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortField, setSortField] = useState<SortField>('spanishName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterCategory, setFilterCategory] = useState<CategoryId | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');

  useEffect(() => {
    fetch('/categories.json')
      .then(res => res.json())
      .then((data: CategoryJSON[]) => {
        // Parse categories with proper types
        const parsedCategories: Category[] = data.map(cat => ({
          id: cat.id as CategoryId,
          name: cat.name,
          description: cat.description
        }));
        setCategories(parsedCategories);
      })
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  const handleVideoClick = (e: React.MouseEvent<HTMLAnchorElement>, videoUrl: string) => {
    e.preventDefault();
    setSelectedVideoUrl(videoUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideoUrl(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCategoryName = (categoryId: CategoryId): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const renderStars = (difficulty: Difficulty) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: difficulty }).map((_, i) => (
          <img 
            key={i}
            src="cuban-star.svg"
            alt="difficulty star"
            style={{ width: '20px', height: '20px' }}
          />
        ))}
      </div>
    );
  };

  const filteredAndSortedMoves = useMemo(() => {
    let filtered = [...moves];

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(move => move.categoryId === filterCategory);
    }

    // Apply difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(move => move.difficulty === filterDifficulty);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'spanishName') {
        comparison = a.spanishName.localeCompare(b.spanishName, 'es');
      } else if (sortField === 'difficulty') {
        comparison = a.difficulty - b.difficulty;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [moves, sortField, sortDirection, filterCategory, filterDifficulty]);

  return (
    <div className="app-container">
      {/* Social Links */}
      <a 
        href="https://www.facebook.com/guapasionz" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link"
        title="Visit us on Facebook"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      {/* Logo Header */}
      <div className="logo-header" style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <picture>
          <source media="(max-width: 768px)" srcSet="guapasionz-logo-mobile.png" />
          <img 
            src="guapasionz-logo-desktop.png" 
            alt="GuapasioNZ" 
            className="logo-img"
          />
        </picture>
        <h1 style={{ 
          margin: '10px 0 0 0', 
          color: '#1A3A3A',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Rueda Move List
        </h1>
      </div>
      
      {/* Filters and Sorting Controls */}
      <div className="filter-container">
        <div className="filter-group">
          <label style={{ fontWeight: 'bold', color: '#1A3A3A' }}>Category:</label>
          <select 
            value={filterCategory}
            onChange={(e) => {
              const value = e.target.value;
              setFilterCategory(value === 'all' ? 'all' : value as CategoryId);
            }}
            style={{ 
              padding: '8px', 
              borderRadius: '4px',
              border: '2px solid #D73B2A',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#1A3A3A'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ fontWeight: 'bold', color: '#1A3A3A' }}>Difficulty:</label>
          <DifficultySelect 
            value={filterDifficulty}
            onChange={setFilterDifficulty}
          />
        </div>

        <div className="filter-group">
          <label style={{ fontWeight: 'bold', color: '#1A3A3A' }}>Sort by:</label>
          <button 
            onClick={() => handleSort('spanishName')}
            style={{ 
              borderRadius: '4px',
              border: '2px solid #D73B2A',
              backgroundColor: sortField === 'spanishName' ? '#D73B2A' : 'white',
              color: sortField === 'spanishName' ? 'white' : '#1A3A3A',
              fontSize: '14px',
              fontWeight: '600',
              marginRight: '8px'
            }}
          >
            Name {sortField === 'spanishName' && (sortDirection === 'asc' ? '▲' : '▼')}
          </button>
          <button 
            onClick={() => handleSort('difficulty')}
            style={{ 
              borderRadius: '4px',
              border: '2px solid #D73B2A',
              backgroundColor: sortField === 'difficulty' ? '#D73B2A' : 'white',
              color: sortField === 'difficulty' ? 'white' : '#1A3A3A',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Difficulty {sortField === 'difficulty' && (sortDirection === 'asc' ? '▲' : '▼')}
          </button>
        </div>

        <div className="showing-count" style={{ marginLeft: 'auto', color: '#1A3A3A', fontSize: '14px', fontWeight: '600' }}>
          Showing {filteredAndSortedMoves.length} of {moves.length} moves
        </div>
      </div>

      <div className="table-container">
        <table className="moves-table">
          <thead>
            <tr style={{ 
              backgroundColor: '#D73B2A', 
              color: 'white',
              textAlign: 'left'
            }}>
              <th style={{ padding: '12px', border: '1px solid #C32F1F' }}>Move</th>
              <th style={{ padding: '12px', border: '1px solid #C32F1F' }}>Translation</th>
              <th style={{ padding: '12px', border: '1px solid #C32F1F' }}>Difficulty</th>
              <th style={{ padding: '12px', border: '1px solid #C32F1F' }}>Category</th>
              <th style={{ padding: '12px', border: '1px solid #C32F1F' }}>Description</th>
              <th style={{ padding: '12px', border: '1px solid #C32F1F' }}>Video</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedMoves.map((move, index) => (
              <tr 
                key={index}
                style={{ 
                  backgroundColor: index % 2 === 0 ? '#F5E6D3' : '#FFF8ED'
                }}
              >
                <td style={{ padding: '12px', border: '1px solid #E8D4B8', fontWeight: 'bold', color: '#1A3A3A' }}>
                  {move.spanishName}
                </td>
                <td style={{ padding: '12px', border: '1px solid #E8D4B8', color: '#1A3A3A' }}>
                  {move.englishName}
                </td>
                <td style={{ padding: '12px', border: '1px solid #E8D4B8', fontSize: '18px' }}>
                  {renderStars(move.difficulty)}
                  <div style={{ fontSize: '11px', color: '#1A3A3A', marginTop: '2px' }}>
                    {difficultyMap[move.difficulty]}
                  </div>
                </td>
                <td style={{ padding: '12px', border: '1px solid #E8D4B8', fontSize: '12px', color: '#1A3A3A' }}>
                  {getCategoryName(move.categoryId)}
                </td>
                <td style={{ padding: '12px', border: '1px solid #E8D4B8', color: '#1A3A3A' }}>
                  {move.description}
                </td>
                <td style={{ padding: '12px', border: '1px solid #E8D4B8' }}>
                  {move.youtubeLink ? (
                    <a 
                      href={move.youtubeLink}
                      onClick={(e) => handleVideoClick(e, move.youtubeLink)}
                      style={{ 
                        color: '#D73B2A', 
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Watch video"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </a>
                  ) : (
                    <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedMoves.length === 0 && (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#1A3A3A',
          fontSize: '16px',
          backgroundColor: '#F5E6D3',
          marginTop: '20px',
          borderRadius: '8px',
          border: '2px solid #D73B2A'
        }}>
          No moves found matching your filters.
        </div>
      )}

      {selectedVideoUrl && (
        <YouTubeModal
          videoUrl={selectedVideoUrl}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

