import React, { memo } from 'react';
import Cell from './Cell';
import { MazeCell, Position, Direction } from './types/game';

interface MazeProps {
  maze: MazeCell[][];
  playerPosition: Position;
  playerDirection: Direction;
  windowSize: { width: number; height: number };
  accidentPosition: Position | null;
  showPreview?: boolean;
}

const Maze = memo(function Maze({ 
  maze, 
  playerPosition, 
  playerDirection, 
  windowSize, 
  accidentPosition,
  showPreview = false 
}: MazeProps) {
  const calculateCellSize = (): number => {
    const maxWidth = windowSize.width * 0.95; // Use more screen width
    const maxHeight = windowSize.height * 0.55; // Adjust for mobile screens
    
    // Different calculations for mobile vs desktop
    const isMobile = windowSize.width < 768;
    const maxCellSize = isMobile ? 35 : 50; // Smaller cells on mobile
    const minCellSize = isMobile ? 15 : 20; // Minimum readable size
    
    const cellWidth = maxWidth / maze[0].length;
    const cellHeight = maxHeight / maze.length;
    
    return Math.max(minCellSize, Math.min(cellWidth, cellHeight, maxCellSize));
  };

  const cellSize = calculateCellSize();

  return (
    <div className="flex justify-center items-center mb-2 sm:mb-4">
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700"
        style={{
          background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
        }}
      >
        <div
          className="grid gap-0.5 sm:gap-1 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <Cell
                key={`${x}-${y}`}
                type={cell.type}
                openPaths={cell.openPaths}
                nextOpenPaths={cell.nextOpenPaths}
                isPlayerHere={x === playerPosition.x && y === playerPosition.y}
                playerDirection={playerDirection}
                isStart={cell.isStart}
                isEnd={cell.isEnd}
                hasAccident={accidentPosition?.x === x && accidentPosition?.y === y}
                hasPowerUp={cell.hasPowerUp}
                size={cellSize}
                showPreview={showPreview}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default Maze;

