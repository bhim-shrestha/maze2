import React from 'react';
import { X } from 'lucide-react';
import { HighScore } from '../../types/game';

interface HighScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  highScores: HighScore[];
}

const HighScoresModal: React.FC<HighScoresModalProps> = ({ 
  isOpen, 
  onClose, 
  highScores 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🏆 High Scores</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-3">
          {highScores.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No high scores yet!<br />
              <span className="text-sm">Play a game to set your first record.</span>
            </div>
          ) : (
            highScores.map((score, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' 
                    : 'bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' : 
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-400 text-black' :
                    'bg-slate-600 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-white font-semibold">{score.score.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Level {score.level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">
                    {new Date(score.date).toLocaleDateString()}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {Math.floor(score.time / 60)}:{(score.time % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HighScoresModal;
