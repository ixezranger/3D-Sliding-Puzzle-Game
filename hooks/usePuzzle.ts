import { useState, useEffect, useCallback } from 'react';
import type { TileData } from '../types';
import { playSound } from '../utils/sound';

const isSolvable = (tiles: number[], gridSize: number): boolean => {
    let inversions = 0;
    const emptyTileId = gridSize * gridSize - 1;
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === emptyTileId) continue;
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[j] === emptyTileId) continue;
            if (tiles[i] > tiles[j]) {
                inversions++;
            }
        }
    }

    if (gridSize % 2 === 1) { // Odd grid
        return inversions % 2 === 0;
    } else { // Even grid
        const emptyTileRowFromBottom = gridSize - Math.floor(tiles.indexOf(emptyTileId) / gridSize);
        if (emptyTileRowFromBottom % 2 === 0) { // Empty tile on even row from bottom
            return inversions % 2 === 1;
        } else { // Empty tile on odd row from bottom
            return inversions % 2 === 0;
        }
    }
};

const createSolvablePuzzle = (gridSize: number): TileData[] => {
    const totalTiles = gridSize * gridSize;
    let tileIds: number[];

    do {
        tileIds = Array.from({ length: totalTiles }, (_, i) => i);
        // Fisher-Yates shuffle
        for (let i = tileIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tileIds[i], tileIds[j]] = [tileIds[j], tileIds[i]];
        }
    } while (!isSolvable(tileIds, gridSize));

    return tileIds.map((id, index) => ({ id: id, pos: index }));
};


export const usePuzzle = (gridSize: number) => {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);
  
  const emptyTileId = gridSize * gridSize - 1;

  useEffect(() => {
    const newTiles = createSolvablePuzzle(gridSize);
    setTiles(newTiles);
    setIsWon(false);
    setMoves(0);
    playSound('shuffle');
  }, [gridSize]);

  const checkWin = useCallback((currentTiles: TileData[]) => {
    if (currentTiles.length === 0) return false;
    for (const tile of currentTiles) {
      if (tile.id !== tile.pos) {
        return false;
      }
    }
    return true;
  }, []);
  
  const moveTile = useCallback((clickedTileId: number) => {
    if (isWon) return;

    const clickedTile = tiles.find(t => t.id === clickedTileId);
    const emptyTile = tiles.find(t => t.id === emptyTileId);

    if (!clickedTile || !emptyTile) return;

    const clickedPos = clickedTile.pos;
    const emptyPos = emptyTile.pos;

    const clickedRow = Math.floor(clickedPos / gridSize);
    const clickedCol = clickedPos % gridSize;
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;
    
    const isAdjacent = (Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol)) === 1;

    if (isAdjacent) {
      const newTiles = tiles.map(t => {
        if (t.id === clickedTileId) return { ...t, pos: emptyPos };
        if (t.id === emptyTileId) return { ...t, pos: clickedPos };
        return t;
      });
      setTiles(newTiles);
      setMoves(m => m + 1);
      playSound('move');
      if (checkWin(newTiles)) {
        setIsWon(true);
        playSound('win');
      }
    }
  }, [tiles, gridSize, isWon, checkWin, emptyTileId]);

  return { tiles, isWon, moveTile, moves };
};