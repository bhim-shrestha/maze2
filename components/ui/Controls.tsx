import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlsProps {
  onMove: (dx: number, dy: number) => void;
  disabled?: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onMove, disabled = false }) => {
  const buttonClass = `
    bg-gradient-to-br from-blue-500 to-blue-700 
    hover:from-blue-600 hover:to-blue-800 
    disabled:from-gray-500 disabled:to-gray-700
    text-white border-none rounded-xl sm:rounded-2xl 
    w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
    flex items-center justify-center 
    transition-all duration-200 
    active:scale-95 disabled:opacity-50
    shadow-lg hover:shadow-xl
    disabled:cursor-not-allowed
    touch-manipulation
  `;

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 mt-2 sm:mt-4 select-none">
      <button
        className={buttonClass}
        onClick={() => onMove(0, -1)}
        disabled={disabled}
        aria-label="Move Up"
        onTouchStart={(e) => e.preventDefault()}
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
      </button>
      
      <div className="flex gap-1 sm:gap-2">
        <button
          className={buttonClass}
          onClick={() => onMove(-1, 0)}
          disabled={disabled}
          aria-label="Move Left"
          onTouchStart={(e) => e.preventDefault()}
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
        
        <button
          className={buttonClass}
          onClick={() => onMove(1, 0)}
          disabled={disabled}
          aria-label="Move Right"
          onTouchStart={(e) => e.preventDefault()}
        >
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
      </div>
      
      <button
        className={buttonClass}
        onClick={() => onMove(0, 1)}
        disabled={disabled}
        aria-label="Move Down"
        onTouchStart={(e) => e.preventDefault()}
      >
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
      </button>
      
      {/* Mobile-specific instructions */}
      <div className="mt-2 text-center text-xs text-gray-400 sm:hidden">
        <p>Swipe or tap buttons to move</p>
      </div>
    </div>
  );
};

export default Controls;
