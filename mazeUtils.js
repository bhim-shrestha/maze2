export function initializeGrid(width, height, defaultValue) {
  return Array(height)
    .fill()
    .map(() =>
      Array(width)
        .fill()
        .map(() => ({ type: defaultValue, obstacle: "none" })),
    )
}

export function carvePaths(maze, x, y) {
  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ].sort(() => Math.random() - 0.5)

  maze[y][x].type = "path"

  for (const [dx, dy] of directions) {
    const newX = x + dx * 2
    const newY = y + dy * 2
    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && maze[newY][newX].type === "wall") {
      maze[y + dy][x + dx].type = "path"
      carvePaths(maze, newX, newY)
    }
  }
}

export function addExtraPaths(maze, probability) {
  for (let y = 1; y < maze.length - 1; y += 2) {
    for (let x = 1; x < maze[0].length - 1; x += 2) {
      if (Math.random() < probability) {
        maze[y][x].type = "path"
      }
    }
  }
}

export function placeObstacles(maze, level) {
  const obstacleCount = Math.floor(level / 5) + 1
  for (let i = 0; i < obstacleCount; i++) {
    let x, y
    do {
      x = Math.floor(Math.random() * maze[0].length)
      y = Math.floor(Math.random() * maze.length)
    } while (maze[y][x].type !== "path" || maze[y][x].obstacle !== "none")

    maze[y][x].obstacle = Math.random() < 0.5 ? "trafficLight" : "roadblock"
  }
}

