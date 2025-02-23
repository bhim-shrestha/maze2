import Cell from "./Cell"

function Maze({ maze, playerPosition, turn, windowSize }) {
  const cellSize = 30
  const scale = Math.min(
    (windowSize.width * 0.9) / (maze[0].length * cellSize),
    (windowSize.height * 0.7) / (maze.length * cellSize),
    1,
  )

  return (
    <div className="maze-container" style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}>
      <div
        className="maze"
        style={{
          gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`,
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              type={cell.type}
              obstacle={cell.obstacle}
              isPlayerHere={x === playerPosition.x && y === playerPosition.y}
              trafficLightState={
                cell.obstacle === "trafficLight" ? ((turn + (x + y)) % 10 < 5 ? "red" : "green") : null
              }
              isExit={x === maze[0].length - 1 && y === maze.length - 1}
            />
          )),
        )}
      </div>
    </div>
  )
}

export default Maze

