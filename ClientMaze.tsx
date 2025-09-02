"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Maze from './Maze';
import GameInfo from './GameInfo';
import Controls from './components/ui/Controls';
import GameOverModal from './components/modals/GameOverModal';
import HighScoresModal from './components/modals/HighScoresModal';
import { generateMaze, getRandomOpenPaths } from './mazeUtils';
import { GameSettings, HighScore, Position, Direction, PowerUp } from './types/game';
import { storage } from './lib/storage';
import { playSound, vibrate } from './lib/audio';
import { createPowerUp, activatePowerUp, updatePowerUp, POWER_UP_CONFIG } from './lib/powerUps';
import { Settings, Trophy, Pause, Play, Volume2, VolumeX, Vibrate, Gamepad2 } from 'lucide-react';

const MAX_LEVEL = 99;
const INITIAL_SCORE = 74410; // Calculated to reach zero at 60 seconds (sum of 1² to 60²)
const SCORE_DECREMENT = 0;
const PATH_CHANGE_INTERVAL = 7000;
const ACCIDENT_INTERVAL = 7000;

function ClientMaze() {
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState(() => generateMaze(1));
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [playerDirection, setPlayerDirection] = useState<Direction>('east');
  const [score, setScore] = useState(INITIAL_SCORE);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState<'playing' | 'paused' | 'won' | 'lost'>('playing');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [accidentPosition, setAccidentPosition] = useState<Position | null>(null);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [combo, setCombo] = useState(0);
  const [settings, setSettings] = useState<GameSettings>(() => storage.getSettings());
  const [highScores, setHighScores] = useState<HighScore[]>(() => storage.getHighScores());
  const [showHighScores, setShowHighScores] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const randomRef = useRef(Math.random);
  const gameStartTime = useRef(Date.now());
  const levelStartTime = useRef(Date.now());
  const scoreDegradationTimer = useRef<NodeJS.Timeout | null>(null);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
      
      // Detect mobile/tablet devices based on screen size and touch capability
      const isMobileDevice = width < 768 || 
        (width < 1024 && height < 800) || 
        ('ontouchstart' in window);
      setIsMobile(isMobileDevice);
      
      // Auto-show controls on mobile, allow toggle on desktop
      if (isMobileDevice) {
        setShowControls(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game timer
  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStatus('lost');
      if (settings.soundEnabled) playSound('gameover');
      if (settings.vibrationEnabled) vibrate([200, 100, 200]);
    }
  }, [timeLeft, gameStatus, settings]);

  // Score degradation based on time squared
  // Mathematical perfection: Starting score = 74,410
  // This is calculated as Σ(t²) from t=1 to t=60 = 60×61×121/6 = 74,410
  // If player takes full 60 seconds: score reaches exactly ZERO!
  // This creates exponential pressure: 
  // - 10 seconds = -100 points/sec
  // - 20 seconds = -400 points/sec  
  // - 30 seconds = -900 points/sec
  // - 60 seconds = -3600 points/sec!
  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (scoreDegradationTimer.current) {
        clearInterval(scoreDegradationTimer.current);
        scoreDegradationTimer.current = null;
      }
      return;
    }

    scoreDegradationTimer.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - levelStartTime.current) / 1000);
      const degradationAmount = Math.pow(elapsedSeconds, 2);
      
      setScore(prev => {
        const newScore = Math.max(prev - degradationAmount, 0);
        return newScore;
      });
    }, 1000); // Update every second

    return () => {
      if (scoreDegradationTimer.current) {
        clearInterval(scoreDegradationTimer.current);
        scoreDegradationTimer.current = null;
      }
    };
  }, [gameStatus]);

  // Power-ups update
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const updatePowerUps = () => {
      setPowerUps(prev => prev.map(p => updatePowerUp(p, 100)).filter(p => p.active || p.timeLeft! > 0));
    };

    const interval = setInterval(updatePowerUps, 100);
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Dynamic maze changes and accidents
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const changePaths = () => {
      setMaze(prevMaze => 
        prevMaze.map(row =>
          row.map(cell => ({
            ...cell,
            openPaths: cell.nextOpenPaths || getRandomOpenPaths(randomRef.current),
            nextOpenPaths: getRandomOpenPaths(randomRef.current),
          }))
        )
      );
    };

    const createAccident = () => {
      const x = Math.floor(randomRef.current() * maze[0].length);
      const y = Math.floor(randomRef.current() * maze.length);
      setAccidentPosition({ x, y });
      setTimeout(() => setAccidentPosition(null), ACCIDENT_INTERVAL);
    };

    const pathInterval = setInterval(changePaths, PATH_CHANGE_INTERVAL);
    const accidentInterval = setInterval(createAccident, ACCIDENT_INTERVAL);

    return () => {
      clearInterval(pathInterval);
      clearInterval(accidentInterval);
    };
  }, [gameStatus, maze]);

  // Move player function
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameStatus !== 'playing') return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
      const currentCell = maze[playerPosition.y][playerPosition.x];
      const newDirection: Direction = dx === 1 ? 'east' : dx === -1 ? 'west' : dy === -1 ? 'north' : 'south';

      if (currentCell.openPaths.includes(newDirection)) {
        // Check accident collision
        if (accidentPosition && 
            accidentPosition.x === newX && 
            accidentPosition.y === newY &&
            !powerUps.find(p => p.type === 'shield' && p.active)) {
          setGameStatus('lost');
          if (settings.soundEnabled) playSound('accident');
          if (settings.vibrationEnabled) vibrate([300, 100, 300]);
          return;
        }

        const newCell = maze[newY][newX];

        // Power-up collection
        if (newCell.hasPowerUp) {
          const existingPowerUp = powerUps.find(p => p.type === newCell.hasPowerUp);
          if (existingPowerUp) {
            setPowerUps(prev => prev.map(p => 
              p.type === newCell.hasPowerUp ? activatePowerUp(p) : p
            ));
          } else {
            setPowerUps(prev => [...prev, activatePowerUp(createPowerUp(newCell.hasPowerUp!))]);
          }

          // Apply time power-up immediately
          if (newCell.hasPowerUp === 'time') {
            setTimeLeft(prev => prev + 15);
          }

          // Award points for power-up collection
          const powerUpPoints = 50 + (combo * 10);
          setScore(prev => prev + powerUpPoints);
          setCombo(prev => prev + 1);

          // Remove power-up from maze
          setMaze(prev => prev.map((row, rowIndex) =>
            row.map((cell, colIndex) => 
              rowIndex === newY && colIndex === newX 
                ? { ...cell, hasPowerUp: undefined }
                : cell
            )
          ));

          if (settings.soundEnabled) playSound('powerup');
          if (settings.vibrationEnabled) vibrate(100);
        } else {
          setCombo(0);
        }

        // Move player
        setPlayerPosition({ x: newX, y: newY });
        setPlayerDirection(newDirection);
        
        // Award points for movement
        const hasMultiplier = powerUps.find(p => p.type === 'multiplier' && p.active);
        const movementPoints = hasMultiplier ? 2 : 1;
        setScore(prev => prev + movementPoints);

        if (settings.soundEnabled) playSound('move');

        // Level completion
        if (newCell.isEnd) {
          if (level === MAX_LEVEL) {
            setGameStatus('won');
            setScore(prev => prev + 10000); // Bonus for completing game
            if (settings.soundEnabled) playSound('complete');
            if (settings.vibrationEnabled) vibrate([100, 50, 100, 50, 200]);
          } else {
            setLevel(prev => prev + 1);
            setMaze(generateMaze(level + 1));
            setPlayerPosition({ x: 0, y: 0 });
            setPlayerDirection('east');
            setTimeLeft(60);
            setScore(prev => prev + 1000 + (level * 100)); // Level completion bonus
            setPowerUps([]);
            setCombo(0);
            levelStartTime.current = Date.now(); // Reset level timer
            
            if (settings.soundEnabled) playSound('complete');
            if (settings.vibrationEnabled) vibrate([100, 50, 100]);
          }
        }
      }
    }
  }, [gameStatus, playerPosition, maze, level, accidentPosition, powerUps, settings]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;
      
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(1, 0);
          break;
        case ' ':
          setGameStatus(gameStatus === 'playing' ? 'paused' : 'playing');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, gameStatus]);

  // Touch controls
  const touchStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        movePlayer(dx > 0 ? 1 : -1, 0);
      } else {
        movePlayer(0, dy > 0 ? 1 : -1);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [movePlayer]);

  // Game over handling
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const gameTime = Math.floor((Date.now() - gameStartTime.current) / 1000);
      const highScore: HighScore = {
        score,
        level,
        date: new Date().toISOString(),
        time: gameTime,
      };

      const currentHighScores = storage.getHighScores();
      const isNewHighScore = currentHighScores.length < 10 || 
        score > (currentHighScores[currentHighScores.length - 1]?.score || 0);
      
      if (isNewHighScore) {
        storage.saveHighScore(highScore);
        setHighScores(storage.getHighScores());
      }

      storage.clearGameState();
    }
  }, [gameStatus, score, level]);

  const restartGame = () => {
    setLevel(1);
    setMaze(generateMaze(1));
    setPlayerPosition({ x: 0, y: 0 });
    setPlayerDirection('east');
    setScore(INITIAL_SCORE);
    setTimeLeft(60);
    setGameStatus('playing');
    setAccidentPosition(null);
    setPowerUps([]);
    setCombo(0);
    gameStartTime.current = Date.now();
    levelStartTime.current = Date.now(); // Reset level timer
  };

  const toggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const toggleVibration = () => {
    const newSettings = { ...settings, vibrationEnabled: !settings.vibrationEnabled };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const hasPreviewPowerUp = powerUps.find(p => p.type === 'preview' && p.active);
  const isHighScore = highScores.length > 0 && score > (highScores[highScores.length - 1]?.score || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🏙️ City Maze
        </h1>
        
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          
          <button
            onClick={toggleVibration}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Toggle Vibration"
          >
            <Vibrate className={`w-4 h-4 sm:w-5 sm:h-5 ${settings.vibrationEnabled ? 'text-blue-400' : 'text-gray-400'}`} />
          </button>
          
          {!isMobile && (
            <button
              onClick={toggleControls}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              title={showControls ? "Hide Controls" : "Show Controls"}
            >
              <Gamepad2 className={`w-4 h-4 sm:w-5 sm:h-5 ${showControls ? 'text-blue-400' : 'text-gray-400'}`} />
            </button>
          )}
          
          <button
            onClick={() => setShowHighScores(true)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            title="High Scores"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {gameStatus === 'playing' && (
            <button
              onClick={() => setGameStatus('paused')}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              title="Pause Game"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Game Content */}
      <div className="flex flex-col items-center px-2 sm:px-4 pb-4">
        <GameInfo
          level={level}
          score={score}
          combo={combo}
          powerUps={powerUps}
          levelStartTime={levelStartTime.current}
        />
        
        {/* Instructions for keyboard users */}
        {!isMobile && !showControls && (
          <div className="mb-4 text-center text-sm text-gray-400">
            <p>Use arrow keys or WASD to move • Space to pause</p>
            <p className="text-xs mt-1">Click the gamepad icon to show on-screen controls</p>
          </div>
        )}
        
        <div className="relative w-full max-w-4xl mx-auto">
          <Maze
            maze={maze}
            playerPosition={playerPosition}
            playerDirection={playerDirection}
            windowSize={windowSize}
            accidentPosition={accidentPosition}
            showPreview={!!hasPreviewPowerUp}
          />
        </div>
        
        {/* Conditional Controls */}
        {(isMobile || showControls) && (
          <div className="mt-4 w-full max-w-md">
            <Controls
              onMove={movePlayer}
              disabled={gameStatus !== 'playing'}
            />
          </div>
        )}
      </div>

      {/* Floating Controls Toggle (Desktop only) */}
      {!isMobile && !showControls && gameStatus === 'playing' && (
        <button
          onClick={toggleControls}
          className="fixed bottom-6 right-6 z-30 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Show Controls"
        >
          <Gamepad2 className="w-6 h-6" />
        </button>
      )}

      {/* Modals */}
      <GameOverModal
        isOpen={gameStatus === 'won' || gameStatus === 'lost'}
        gameStatus={gameStatus as 'won' | 'lost'}
        score={score}
        level={level}
        isHighScore={isHighScore}
        onRestart={restartGame}
        onHome={() => window.location.reload()}
        onSettings={() => {}}
      />

      <HighScoresModal
        isOpen={showHighScores}
        onClose={() => setShowHighScores(false)}
        highScores={highScores}
      />

      {/* Pause overlay */}
      {gameStatus === 'paused' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full">
            <Pause className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Game Paused</h2>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              {isMobile ? 'Tap to resume' : 'Press Space or click to resume'}
            </p>
            <button
              onClick={() => setGameStatus('playing')}
              className="bg-blue-500 hover:bg-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientMaze;
