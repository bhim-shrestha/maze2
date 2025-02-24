function seededRandom(seed) {
  let state = seed
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

export function generateMaze(level) {
  const random = seededRandom(level)
  const width = Math.min(7 + Math.floor(level / 5), 25)
  const height = width
  const maze = Array.from({ length: height }, () =>
    Array(width)
      .fill()
      .map(() => ({
        type: "path",
        openPaths: getRandomOpenPaths(random),
        nextOpenPaths: getRandomOpenPaths(random),
      })),
  )

  // Set start and end points
  maze[0][0].isStart = true
  maze[height - 1][width - 1].isEnd = true

  return maze
}

export function getRandomOpenPaths(random) {
  const allPaths = ["north", "east", "south", "west"]
  const shuffled = [...allPaths].sort(() => random() - 0.5)
  return shuffled.slice(0, 2)
}

