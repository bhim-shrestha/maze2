import React from 'react';
import { Trophy, Target, Zap } from 'lucide-react';
import { PowerUp } from './types/game';
import { POWER_UP_CONFIG } from './lib/powerUps';

interface GameInfoProps {
  level: number;
  score: number;
  combo: number;
  powerUps: PowerUp[];
  levelStartTime?: number;
}

function GameInfo({ level, score, combo, powerUps, levelStartTime }: GameInfoProps) {
  const activePowerUps = powerUps.filter(p => p.active);
  
  // Calculate current degradation rate
  const elapsedSeconds = levelStartTime ? Math.floor((Date.now() - levelStartTime) / 1000) : 0;
  const currentDegradation = Math.pow(elapsedSeconds, 2);
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-4">
      {/* Score Degradation Warning */}
      {elapsedSeconds > 5 && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
          <div className="text-sm text-red-300">
            ⚠️ Score degrading: -{currentDegradation}/sec | Time: {elapsedSeconds}s | Perfect game: finish before 60s!
          </div>
        </div>
      )}
      
      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-xl text-white text-center shadow-lg">
          <Target className="w-5 h-5 mx-auto mb-1" />
          <div className="text-xs opacity-80">Level</div>
          <div className="text-xl font-bold">{level}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-3 rounded-xl text-white text-center shadow-lg">
          <Trophy className="w-5 h-5 mx-auto mb-1" />
          <div className="text-xs opacity-80">Score</div>
          <div className="text-xl font-bold">{score.toLocaleString()}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-3 rounded-xl text-white text-center shadow-lg">
          <Zap className="w-5 h-5 mx-auto mb-1" />
          <div className="text-xs opacity-80">Combo</div>
          <div className="text-xl font-bold">{combo}x</div>
        </div>
      </div>

      {/* Active Power-ups */}
      {activePowerUps.length > 0 && (
        <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
          {activePowerUps.map((powerUp, index) => {
            const config = POWER_UP_CONFIG[powerUp.type];
            const progress = powerUp.timeLeft && powerUp.duration ? 
              (powerUp.timeLeft / powerUp.duration) * 100 : 100;
            
            return (
              <div
                key={`${powerUp.type}-${index}`}
                className="bg-black/20 rounded-lg p-1 sm:p-2 min-w-[60px] sm:min-w-[80px] text-center relative overflow-hidden"
                style={{ 
                  backgroundColor: config.color + '20',
                  border: `2px solid ${config.color}50`
                }}
              >
                <div className="text-sm sm:text-lg mb-1">{config.icon}</div>
                <div className="text-xs text-white/90">{config.name}</div>
                {powerUp.timeLeft && powerUp.timeLeft > 0 && (
                  <>
                    <div className="text-xs text-white/70 mt-1">
                      {Math.ceil(powerUp.timeLeft / 1000)}s
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-1 transition-all duration-1000"
                      style={{
                        backgroundColor: config.color,
                        width: `${progress}%`
                      }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GameInfo;

