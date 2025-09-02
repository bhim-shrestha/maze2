import React from 'react';
import { Gamepad2, Trophy, Settings, Info } from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
  onShowHighScores: () => void;
  onShowSettings: () => void;
  onShowInstructions: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onShowHighScores,
  onShowSettings,
  onShowInstructions
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🏙️</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            City Maze
          </h1>
          <p className="text-gray-400 text-lg">Navigate, Collect, Survive</p>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-4">
          <button
            onClick={onStartGame}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                     text-white py-4 px-6 rounded-2xl font-bold text-xl transition-all duration-200 
                     flex items-center justify-center gap-3 hover:scale-105 shadow-lg"
          >
            <Gamepad2 className="w-6 h-6" />
            Start Game
          </button>
          
          <button
            onClick={onShowHighScores}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 
                     text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 
                     flex items-center justify-center gap-3 hover:scale-105"
          >
            <Trophy className="w-5 h-5" />
            High Scores
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onShowSettings}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 
                       text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 
                       flex items-center justify-center gap-2 hover:scale-105"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            
            <button
              onClick={onShowInstructions}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                       text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 
                       flex items-center justify-center gap-2 hover:scale-105"
            >
              <Info className="w-4 h-4" />
              How to Play
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Use WASD, Arrow Keys, or Touch to move</p>
          <p className="mt-1">Collect power-ups • Avoid accidents • Beat 99 levels!</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
