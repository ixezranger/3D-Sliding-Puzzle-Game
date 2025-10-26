
import React from 'react';

interface DifficultySelectorProps {
  onDifficultySelect: (size: number) => void;
  selectedGridSize: number | null;
}

const DIFFICULTY_LEVELS = [
  { name: 'Easy', size: 3, description: '3x3 Grid' },
  { name: 'Medium', size: 5, description: '5x5 Grid' },
  { name: 'Hard', size: 9, description: '9x9 Grid' },
  { name: 'Insane', size: 20, description: '20x20 Grid' }
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onDifficultySelect, selectedGridSize }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center text-slate-200">2. Select Difficulty</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DIFFICULTY_LEVELS.map(level => (
          <button
            key={level.name}
            onClick={() => onDifficultySelect(level.size)}
            className={`px-4 py-6 text-center font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-purple-500/50
              ${selectedGridSize === level.size
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 hover:scale-105'
              }`}
          >
            <span className="block text-lg">{level.name}</span>
            <span className="block text-xs font-normal">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
