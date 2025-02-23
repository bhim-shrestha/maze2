"use client"

import React, { useState, useEffect, useCallback } from "react"
import Maze from "./Maze"
import GameInfo from "./GameInfo"
import { generateMaze } from "./mazeUtils"

function ClientMaze() {
  const [level, setLevel] = useState(1)
  const [maze, setMaze] = useState(generateMaze(level))
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [turn, setTurn] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStatus, setGameStatus] = useState("playing")
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameStatus("lost")
    }
  }, [timeLeft, gameStatus])

  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameStatus !== "playing") return

      const newX = playerPosition.x + dx
      const newY = playerPosition.y + dy
      const exitX = maze[0].length - 1
      const exitY = maze.length - 1

      if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
        const cell = maze[newY][newX]
        if (cell.type === "path") {
          let canPass = true
          if (cell.obstacle === "trafficLight") {
            canPass = (turn + (newX + newY)) % 10 >= 5
          } else if (cell.obstacle === "roadblock") {
            canPass = false
          }
          if (canPass) {
            setPlayerPosition({ x: newX, y: newY })
            setTurn(turn + 1)
            setScore(score + 1)

            if (newX === exitX && newY === exitY) {
              if (level === 10) {
                setGameStatus("won")
              } else {
                setLevel(level + 1)
                setMaze(generateMaze(level + 1))
                setPlayerPosition({ x: 0, y: 0 })
                setTurn(0)
                setTimeLeft(60)
                setScore(score + 100)
              }
            }
          }
        }
      }
    },
    [maze, playerPosition, turn, level, score, gameStatus],
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
        default:
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

  const restartGame = () => {
    setLevel(1)
    setMaze(generateMaze(1))
    setPlayerPosition({ x: 0, y: 0 })
    setTurn(0)
    setScore(0)
    setTimeLeft(60)
    setGameStatus("playing")
  }

  return (
    <>
      <GameInfo level={level} score={score} timeLeft={timeLeft} />
      <Maze maze={maze} playerPosition={playerPosition} turn={turn} windowSize={windowSize} />
      {gameStatus === "won" && (
        <div className="game-over">
          <h2>Congratulations! You've completed all levels!</h2>
          <p>Final Score: {score}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
      {gameStatus === "lost" && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={restartGame}>Try Again</button>
        </div>
      )}
    </>
  )
}

export default ClientMaze

