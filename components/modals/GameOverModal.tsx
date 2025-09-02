import React from 'react';
import { Trophy, RotateCcw, Home, Settings } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  gameStatus: 'won' | 'lost';
  score: number;
  level: number;
  isHighScore: boolean;
  onRestart: () => void;
  onHome: () => void;
  onSettings: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  gameStatus,
  score,
  level,
  isHighScore,
  onRestart,
  onHome,
  onSettings
}) => {
  if (!isOpen) return null;

  const isWon = gameStatus === 'won';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`
        bg-gradient-to-br ${isWon ? 'from-green-800 to-green-900' : 'from-red-800 to-red-900'}
        rounded-2xl p-8 w-full max-w-md text-center border-2 
        ${isWon ? 'border-green-500' : 'border-red-500'} shadow-2xl
      `}>
        <div className="mb-6">
          {isWon ? (
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
          ) : (
            <div className="text-6xl mb-4 animate-pulse">💥</div>
          )}
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {isWon ? 'Congratulations!' : 'Game Over!'}
          </h2>
          
          <p className="text-white/80">
            {isWon 
              ? "You've completed all levels!" 
              : "Don't give up - try again!"
            }
          </p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-white">
            <div>
              <div className="text-2xl font-bold">{score.toLocaleString()}</div>
              <div className="text-sm opacity-80">Final Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{level}</div>
              <div className="text-sm opacity-80">Level Reached</div>
            </div>
          </div>
          
          {isHighScore && (
            <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <div className="text-yellow-300 text-sm font-semibold">New High Score!</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                     text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 
                     flex items-center justify-center gap-2 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onHome}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 
                       text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 
                       flex items-center justify-center gap-2 hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            
            <button
              onClick={onSettings}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                       text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 
                       flex items-center justify-center gap-2 hover:scale-105"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
