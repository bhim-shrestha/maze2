function seededRandom(seed) {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

const directions = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
]

function shuffleWithBias(array, random, bias = 0.7) {
  const shuffled = [...array]
  if (random() < bias) {
    const lastDir = directions.find((dir) => dir.dx === array[0]?.dx && dir.dy === array[0]?.dy)
    if (lastDir) {
      shuffled.sort((a, b) => (a.dx === lastDir.dx && a.dy === lastDir.dy ? -1 : 1))
    }
  } else {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  }
  return shuffled
}

function findDeadEnds(maze) {
  const deadEnds = []
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[0].length; x++) {
      if (maze[y][x].type === "path" && maze[y][x].obstacle !== "roadblock") {
        const neighbors = directions.filter((dir) => {
          const nx = x + dir.dx
          const ny = y + dir.dy
          return nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length && maze[ny][nx].type === "path"
        })
        if (neighbors.length === 1) deadEnds.push([x, y])
      }
    }
  }
  return deadEnds
}

export function generateMaze(level) {
  const random = seededRandom(level)
  const width = Math.min(7 + Math.floor(level / 2), 20)
  const height = width
  const maze = Array.from({ length: height }, () =>
    Array(width)
      .fill()
      .map(() => ({ type: "wall", obstacle: "none" })),
  )

  function carve(x, y) {
    maze[y][x].type = "path"
    const dirs = shuffleWithBias(directions, random, 0.7)
    for (const dir of dirs) {
      const nx = x + dir.dx * 2
      const ny = y + dir.dy * 2
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[ny][nx].type === "wall") {
        maze[y + dir.dy][x + dir.dx].type = "path"
        carve(nx, ny)
      }
    }
  }

  carve(0, 0)

  const trafficLights = Math.floor(level / 3)
  const deadEnds = findDeadEnds(maze)
  const roadblocks = Math.floor(deadEnds.length * 0.3)

  for (let i = 0; i < trafficLights; i++) {
    let rx, ry
    do {
      rx = Math.floor(random() * width)
      ry = Math.floor(random() * height)
    } while (
      maze[ry][rx].type !== "path" ||
      maze[ry][rx].obstacle !== "none" ||
      (rx === 0 && ry === 0) ||
      (rx === width - 1 && ry === height - 1)
    )
    maze[ry][rx].obstacle = "trafficLight"
  }

  for (let i = 0; i < roadblocks; i++) {
    if (deadEnds.length > 0) {
      const index = Math.floor(random() * deadEnds.length)
      const [dx, dy] = deadEnds.splice(index, 1)[0]
      if (!(dx === 0 && dy === 0) && !(dx === width - 1 && dy === height - 1)) {
        maze[dy][dx].obstacle = "roadblock"
      }
    }
  }

  maze[0][0] = { type: "path", obstacle: "none" }
  maze[height - 1][width - 1] = { type: "path", obstacle: "none" }

  return maze
}

