
import React, { useEffect, useRef, useState } from 'react';
import Tile from './Tile';
import { usePuzzle } from '../hooks/usePuzzle';

interface GameBoardProps {
  imageSrc: string;
  gridSize: number;
  onWin: (moves: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ imageSrc, gridSize, onWin }) => {
  const { tiles, isWon, moveTile, moves } = usePuzzle(gridSize);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(500);
  
  useEffect(() => {
    if (isWon) {
      onWin(moves);
    }
  }, [isWon, onWin, moves]);

  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const width = boardRef.current.offsetWidth;
        setBoardSize(width);
      }
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  const tileSize = boardSize / gridSize;
  const emptyTileId = gridSize * gridSize - 1;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center p-4">
       <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="text-2xl font-semibold text-slate-300">
          Moves: <span className="font-bold text-white">{moves}</span>
        </div>
        <div>
          <p className="text-xs text-slate-400 text-center mb-1">Reference</p>
          <img 
            src={imageSrc} 
            alt="Reference" 
            className="w-20 h-20 object-cover rounded-lg border-2 border-slate-600 shadow-md"
          />
        </div>
      </div>
      <div 
        ref={boardRef}
        className="relative rounded-2xl shadow-2xl shadow-black/50 overflow-hidden bg-slate-800"
        style={{ width: '100%', height: boardSize, aspectRatio: '1 / 1', perspective: '1000px' }}
      >
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            id={tile.id}
            pos={tile.pos}
            imageSrc={imageSrc}
            gridSize={gridSize}
            tileSize={tileSize}
            onClick={moveTile}
            isEmpty={tile.id === emptyTileId}
            isWon={isWon}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500 text-center">
        Note: The {gridSize}x{gridSize} puzzle is extremely difficult. Good luck!
      </p>
    </div>
  );
};

export default GameBoard;
