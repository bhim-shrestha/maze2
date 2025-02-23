"use client"

import React, { useState, useEffect, useCallback } from "react"
import Maze from "./Maze"
import "./App.css"
import { initializeGrid, carvePaths, addExtraPaths, placeObstacles } from "./mazeUtils"

function App() {
  const [level, setLevel] = useState(1)
  const [maze, setMaze] = useState(generateMaze(1))
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [turn, setTurn] = useState(0)

  const movePlayer = useCallback(
    (dx, dy) => {
      const newX = playerPosition.x + dx
      const newY = playerPosition.y + dy
      const exitX = maze[0].length - 1
      const exitY = maze.length - 1
      if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
        const cell = maze[newY][newX]
        if (cell.type === "path") {
          let canPass = true
          if (cell.obstacle === "trafficLight") {
            canPass = (turn + (newX + newY)) % 10 >= 5 // Green if turn ≥ 5 in cycle
          } else if (cell.obstacle === "roadblock") {
            canPass = false
          }
          if (canPass) {
            setPlayerPosition({ x: newX, y: newY })
            setTurn(turn + 1)
            if (newX === exitX && newY === exitY) {
              setLevel(level + 1)
              setMaze(generateMaze(level + 1))
              setPlayerPosition({ x: 0, y: 0 })
              setTurn(0)
            }
          }
        }
      }
    },
    [maze, playerPosition, turn, level],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1)
          break
        case "ArrowDown":
          movePlayer(0, 1)
          break
        case "ArrowLeft":
          movePlayer(-1, 0)
          break
        case "ArrowRight":
          movePlayer(1, 0)
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [movePlayer])

  const touchStart = React.useRef({ x: null, y: null })

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }

    const handleTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - touchStart.current.x
      const dy = e.changedTouches[0].clientY - touchStart.current.y

      if (Math.abs(dx) > Math.abs(dy)) {
        movePlayer(dx > 0 ? 1 : -1, 0)
      } else {
        movePlayer(0, dy > 0 ? 1 : -1)
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [movePlayer])

  return (
    <div className="App">
      <h1>City Maze - Level {level}</h1>
      <Maze maze={maze} playerPosition={playerPosition} turn={turn} />
    </div>
  )
}

export default App

function generateMaze(level) {
  const width = 5 + Math.floor(level / 10)
  const height = width // Square grid
  const maze = initializeGrid(width, height, "wall")
  carvePaths(maze, 0, 0) // Start at entry
  addExtraPaths(maze, 0.1) // 10% chance to remove walls for loops
  placeObstacles(maze, level)
  maze[0][0] = { type: "path", obstacle: "none" } // Entry
  maze[height - 1][width - 1] = { type: "path", obstacle: "none" } // Exit
  return maze
}

