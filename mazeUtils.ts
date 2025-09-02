import { MazeCell, Direction } from './types/game';
import { getRandomPowerUpType } from './lib/powerUps';

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export function generateMaze(level: number): MazeCell[][] {
  const random = seededRandom(level);
  const width = Math.min(7 + Math.floor(level / 5), 25);
  const height = width;
  
  const maze: MazeCell[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const cell: MazeCell = {
        type: 'path',
        openPaths: getRandomOpenPaths(random),
        nextOpenPaths: getRandomOpenPaths(random),
      };
      
      // Add power-ups randomly (15% chance)
      if (random() < 0.15 && !(x === 0 && y === 0) && !(x === width - 1 && y === height - 1)) {
        cell.hasPowerUp = getRandomPowerUpType();
      }
      
      return cell;
    })
  );

  // Set start and end points
  maze[0][0].isStart = true;
  maze[height - 1][width - 1].isEnd = true;

  return maze;
}

export function getRandomOpenPaths(random: () => number): Direction[] {
  const allPaths: Direction[] = ['north', 'east', 'south', 'west'];
  const shuffled = [...allPaths].sort(() => random() - 0.5);
  return shuffled.slice(0, 2);
}

