import React, { memo } from 'react';
import { Car, AlertTriangle, Flag, Home } from 'lucide-react';
import { Direction, PowerUpType } from './types/game';
import { POWER_UP_CONFIG } from './lib/powerUps';

interface CellProps {
  type: 'path' | 'wall';
  openPaths: Direction[];
  nextOpenPaths: Direction[];
  isPlayerHere: boolean;
  playerDirection: Direction;
  isStart?: boolean;
  isEnd?: boolean;
  hasAccident: boolean;
  hasPowerUp?: PowerUpType;
  size: number;
  showPreview?: boolean;
}

const Cell = memo(function Cell({ 
  type, 
  openPaths, 
  nextOpenPaths, 
  isPlayerHere, 
  playerDirection, 
  isStart, 
  isEnd, 
  hasAccident, 
  hasPowerUp,
  size, 
  showPreview = false 
}: CellProps) {
  const getBorderColor = (direction: Direction): string => {
    if (openPaths.includes(direction)) return '#10b981'; // emerald-500
    if (showPreview && nextOpenPaths.includes(direction)) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const getRotation = (direction: Direction): string => {
    switch (direction) {
      case 'north': return 'rotate-0';
      case 'east': return 'rotate-90';
      case 'south': return 'rotate-180';
      case 'west': return 'rotate-270';
      default: return 'rotate-0';
    }
  };

  const walls = {
    north: { top: 0, left: 0, right: 0, height: '4px' },
    south: { bottom: 0, left: 0, right: 0, height: '4px' },
    east: { top: 0, bottom: 0, right: 0, width: '4px' },
    west: { top: 0, bottom: 0, left: 0, width: '4px' },
  };

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${
        hasAccident ? 'animate-pulse' : ''
      } ${
        isPlayerHere ? 'z-10 scale-110' : ''
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: hasAccident ? '#7f1d1d' : '#0f172a', // red-900 : slate-900
      }}
    >
      {/* Walls */}
      {Object.entries(walls).map(([direction, style]) => (
        <div
          key={direction}
          style={{
            ...style,
            position: 'absolute',
            backgroundColor: getBorderColor(direction as Direction),
          }}
        />
      ))}
      
      {/* Power-up */}
      {hasPowerUp && !isPlayerHere && (
        <div 
          className="absolute inset-0 flex items-center justify-center animate-bounce"
          style={{ color: POWER_UP_CONFIG[hasPowerUp].color }}
        >
          <div className="text-2xl drop-shadow-lg">
            {POWER_UP_CONFIG[hasPowerUp].icon}
          </div>
        </div>
      )}
      
      {/* Player */}
      {isPlayerHere && (
        <Car
          className={`w-4/5 h-4/5 text-blue-400 transform transition-transform duration-200 drop-shadow-lg ${getRotation(playerDirection)}`}
        />
      )}
      
      {/* Start point */}
      {isStart && !isPlayerHere && (
        <div className="flex items-center justify-center">
          <Home className="w-6 h-6 text-green-400 animate-pulse" />
        </div>
      )}
      
      {/* End point */}
      {isEnd && !isPlayerHere && (
        <div className="flex items-center justify-center">
          <Flag className="w-6 h-6 text-red-400 animate-pulse" />
        </div>
      )}
      
      {/* Accident */}
      {hasAccident && (
        <AlertTriangle className="w-4/5 h-4/5 text-red-500 animate-pulse drop-shadow-lg" />
      )}
    </div>
  );
});

export default Cell;

