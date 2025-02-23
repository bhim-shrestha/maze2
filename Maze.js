import Cell from "./Cell"

function Maze({ maze, playerPosition, turn }) {
  const cellSize = 20
  const scale = Math.min(
    window.innerWidth / (maze[0].length * cellSize),
    window.innerHeight / (maze.length * cellSize),
    1,
  )
  return (
    <div className="maze-container" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
      <div className="maze" style={{ gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)` }}>
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
            />
          )),
        )}
      </div>
    </div>
  )
}

export default Maze

