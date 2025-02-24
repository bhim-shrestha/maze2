import Cell from "./Cell"

function Maze({ maze, playerPosition, playerDirection, windowSize, accidentPosition }) {
  const minCellSize = 40 // Minimum cell size
  const maxCellSize = 80 // Maximum cell size

  const calculateCellSize = () => {
    const maxWidth = windowSize.width * 0.9
    const maxHeight = windowSize.height * 0.7
    const cellWidth = maxWidth / maze[0].length
    const cellHeight = maxHeight / maze.length
    return Math.min(Math.max(Math.min(cellWidth, cellHeight), minCellSize), maxCellSize)
  }

  const cellSize = calculateCellSize()

  return (
    <div className="maze-container">
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
              size={cellSize}
            />
          )),
        )}
      </div>
    </div>
  )
}

export default Maze

