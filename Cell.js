import { Car, AlertTriangle } from "lucide-react"

function Cell({ type, openPaths, nextOpenPaths, isPlayerHere, playerDirection, isStart, isEnd, hasAccident, size }) {
  const cellClass = `cell ${type} ${hasAccident ? "accident" : ""}`
  
  const getBorderColor = (direction) => {
    if (openPaths.includes(direction)) return "#4CAF50"
    if (nextOpenPaths.includes(direction)) return "#FFA500"
    return "#f44336"
  }

  const walls = {
    north: { top: 0, left: 0, right: 0, height: '4px' },
    south: { bottom: 0, left: 0, right: 0, height: '4px' },
    east: { top: 0, bottom: 0, right: 0, width: '4px' },
    west: { top: 0, bottom: 0, left: 0, width: '4px' }
  };

  return (
    <div
      className={cellClass}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {Object.entries(walls).map(([direction, style]) => (
        <div
          key={direction}
          style={{
            ...style,
            position: "absolute",
            backgroundColor: getBorderColor(direction),
          }}
        />
      ))}
      {isPlayerHere && (
        <Car
          className={`w-4/5 h-4/5 text-blue-500 transform ${
            playerDirection === "north"
              ? "rotate-0"
              : playerDirection === "east"
              ? "rotate-90"
              : playerDirection === "south"
              ? "rotate-180"
              : "rotate-270"
          }`}
        />
      )}
      {isStart && <div className="start-point" />}
      {isEnd && <div className="end-point" />}
      {hasAccident && <AlertTriangle className="w-4/5 h-4/5 text-red-500" />}
    </div>
  )
}

export default Cell