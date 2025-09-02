import { GameState, GameSettings, HighScore } from '../types/game';

const STORAGE_KEYS = {
  HIGH_SCORES: 'maze_high_scores',
  SETTINGS: 'maze_settings',
  GAME_STATE: 'maze_game_state',
} as const;

export const storage = {
  // High Scores
  getHighScores: (): HighScore[] => {
    try {
      const scores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
      return scores ? JSON.parse(scores) : [];
    } catch {
      return [];
    }
  },

  saveHighScore: (score: HighScore): void => {
    try {
      const scores = storage.getHighScores();
      scores.push(score);
      scores.sort((a, b) => b.score - a.score);
      scores.splice(10); // Keep only top 10
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(scores));
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  },

  // Settings
  getSettings: (): GameSettings => {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {
        soundEnabled: true,
        vibrationEnabled: true,
        theme: 'dark',
        difficulty: 'normal',
      };
    } catch {
      return {
        soundEnabled: true,
        vibrationEnabled: true,
        theme: 'dark',
        difficulty: 'normal',
      };
    }
  },

  saveSettings: (settings: GameSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Game State (for resume functionality)
  saveGameState: (gameState: Partial<GameState>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  },

  getGameState: (): Partial<GameState> | null => {
    try {
      const gameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return gameState ? JSON.parse(gameState) : null;
    } catch {
      return null;
    }
  },

  clearGameState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  },
};
