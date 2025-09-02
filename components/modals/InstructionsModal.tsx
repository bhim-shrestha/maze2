import React from 'react';
import { X } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🎮 How to Play</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6 text-white">
          {/* Objective */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">🎯 Objective</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Navigate from 🏠 (home) to 🏁 (flag)</li>
              <li>• Complete 99 increasingly difficult levels</li>
              <li>• Collect power-ups for special abilities</li>
              <li>• Avoid accidents to stay alive</li>
              <li>• Beat your high score!</li>
            </ul>
          </div>

          {/* Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-400">🎮 Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h4 className="font-medium mb-2">Keyboard:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Arrow Keys or WASD to move</li>
                  <li>• Spacebar to pause/resume</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mobile:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Swipe to move</li>
                  <li>• Tap control buttons</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Maze Elements */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-purple-400">🧩 Maze Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
              <div>
                <h4 className="font-medium mb-2">Path Colors:</h4>
                <ul className="space-y-1">
                  <li>• <span className="text-green-400">Green</span> - Open path</li>
                  <li>• <span className="text-orange-400">Orange</span> - Opening soon</li>
                  <li>• <span className="text-red-400">Red</span> - Blocked</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Special Elements:</h4>
                <ul className="space-y-1">
                  <li>• 🚗 Your car</li>
                  <li>• 🏠 Start point</li>
                  <li>• 🏁 End point</li>
                  <li>• ⚠️ Accident (avoid!)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Power-ups */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">⚡ Power-ups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="text-green-400 font-medium">⚡ Speed Boost</div>
                <div className="text-gray-300">Move faster for 10 seconds</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-blue-400 font-medium">⏰ Extra Time</div>
                <div className="text-gray-300">Add 15 seconds to timer</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="text-orange-400 font-medium">🛡️ Shield</div>
                <div className="text-gray-300">Immunity to accidents for 15s</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="text-purple-400 font-medium">👁️ Preview</div>
                <div className="text-gray-300">See upcoming path changes</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 md:col-span-2">
                <div className="text-yellow-400 font-medium">✨ Score Multiplier</div>
                <div className="text-gray-300">2x score for 20 seconds</div>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-400">🏆 Scoring</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Start with 5,000 points</li>
              <li>• -1 point per move (unless multiplier active)</li>
              <li>• +500 points per power-up collected</li>
              <li>• Chain power-ups for combo bonuses</li>
              <li>• Complete levels quickly for time bonuses</li>
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">💡 Pro Tips</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Watch orange borders for upcoming path changes</li>
              <li>• Save shields for accident-heavy areas</li>
              <li>• Chain multiple power-ups for huge combo scores</li>
              <li>• Remember maze layouts - they partially repeat</li>
              <li>• Use pause (spacebar) to plan your route</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
