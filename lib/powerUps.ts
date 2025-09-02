import { PowerUpType, PowerUp } from '../types/game';

export const POWER_UP_CONFIG = {
  speed: {
    name: 'Speed Boost',
    description: 'Move faster for 10 seconds',
    duration: 10000,
    color: '#00ff00',
    icon: '⚡',
  },
  time: {
    name: 'Extra Time',
    description: 'Add 15 seconds to the timer',
    duration: 0,
    color: '#0099ff',
    icon: '⏰',
  },
  shield: {
    name: 'Accident Shield',
    description: 'Immunity to accidents for 15 seconds',
    duration: 15000,
    color: '#ff6600',
    icon: '🛡️',
  },
  preview: {
    name: 'Path Preview',
    description: 'See upcoming path changes for 8 seconds',
    duration: 8000,
    color: '#9900ff',
    icon: '👁️',
  },
  multiplier: {
    name: 'Score Multiplier',
    description: '2x score for 20 seconds',
    duration: 20000,
    color: '#ffff00',
    icon: '✨',
  },
} as const;

export const createPowerUp = (type: PowerUpType): PowerUp => ({
  type,
  duration: POWER_UP_CONFIG[type].duration,
  active: false,
  timeLeft: 0,
});

export const activatePowerUp = (powerUp: PowerUp): PowerUp => ({
  ...powerUp,
  active: true,
  timeLeft: powerUp.duration || 0,
});

export const updatePowerUp = (powerUp: PowerUp, deltaTime: number): PowerUp => {
  if (!powerUp.active || !powerUp.timeLeft) return powerUp;
  
  const newTimeLeft = Math.max(0, powerUp.timeLeft - deltaTime);
  return {
    ...powerUp,
    timeLeft: newTimeLeft,
    active: newTimeLeft > 0,
  };
};

export const getRandomPowerUpType = (): PowerUpType => {
  const types = Object.keys(POWER_UP_CONFIG) as PowerUpType[];
  return types[Math.floor(Math.random() * types.length)];
};
