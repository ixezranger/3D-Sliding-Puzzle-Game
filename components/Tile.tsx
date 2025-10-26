import React, { useState, useRef } from 'react';

interface TileProps {
  id: number;
  pos: number;
  imageSrc: string;
  gridSize: number;
  tileSize: number;
  onClick: (id: number) => void;
  isEmpty: boolean;
  isWon: boolean;
}

const TileComponent: React.FC<TileProps> = ({
  id,
  pos,
  imageSrc,
  gridSize,
  tileSize,
  onClick,
  isEmpty,
  isWon,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tileRef.current || isWon) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // max 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10;  // max 10 degrees
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (isWon) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isWon) return;
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const correctRow = Math.floor(id / gridSize);
  const correctCol = id % gridSize;

  const currentRow = Math.floor(pos / gridSize);
  const currentCol = pos % gridSize;

  const bgPosX = -correctCol * tileSize;
  const bgPosY = -correctRow * tileSize;

  const top = currentRow * tileSize;
  const left = currentCol * tileSize;

  if (isEmpty && !isWon) {
    return null;
  }
  
  const z = isHovered && !isWon ? 20 : 0;
  const scale = isHovered && !isWon ? 1.05 : 1;
  const transform = `translate3d(${left}px, ${top}px, ${z}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`;

  return (
    <div
      ref={tileRef}
      onClick={() => onClick(id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="absolute bg-cover rounded-md cursor-pointer shadow-md shadow-black/40"
      style={{
        width: tileSize,
        height: tileSize,
        transform: transform,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        willChange: 'transform',
        boxShadow: isWon
          ? 'inset 0 0 0 1px rgba(255,255,255,0.1)'
          : 'inset 0 0 0 1px rgba(0,0,0,0.2)',
      }}
    />
  );
};

export const Tile = React.memo(TileComponent);
export default Tile;
