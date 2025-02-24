import Cell from "./Cell"

function Maze({ maze, playerPosition, playerDirection, windowSize, accidentPosition }) {
  const cellSize = 40
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
              openPaths={cell.openPaths}
              nextOpenPaths={cell.nextOpenPaths}
              isPlayerHere={x === playerPosition.x && y === playerPosition.y}
              playerDirection={playerDirection}
              isStart={cell.isStart}
              isEnd={cell.isEnd}
              hasAccident={accidentPosition && accidentPosition.x === x && accidentPosition.y === y}
            />
          )),
        )}
      </div>
    </div>
  )
}

export default Maze

