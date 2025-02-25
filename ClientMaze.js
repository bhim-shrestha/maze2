"use client"

import React, { useState, useEffect, useCallback } from "react"
import Maze from "./Maze"
import GameInfo from "./GameInfo"
import { generateMaze, getRandomOpenPaths } from "./mazeUtils"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

const MAX_LEVEL = 99
const INITIAL_SCORE = 5000
const SCORE_DECREMENT = 100
const PATH_CHANGE_INTERVAL = 7000 // 7 seconds
const ACCIDENT_INTERVAL = 7000 // 7 seconds

function ClientMaze() {
  const [level, setLevel] = useState(1)
  const [maze, setMaze] = useState(() => generateMaze(1))
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [playerDirection, setPlayerDirection] = useState("east")
  const [score, setScore] = useState(INITIAL_SCORE)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStatus, setGameStatus] = useState("playing")
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [accidentPosition, setAccidentPosition] = useState(null)

  const randomRef = React.useRef(Math.random)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
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

  useEffect(() => {
    if (gameStatus !== "playing") return

    const changePaths = () => {
      setMaze((prevMaze) => {
        return prevMaze.map((row) =>
          row.map((cell) => ({
            ...cell,
            openPaths: cell.nextOpenPaths || getRandomOpenPaths(randomRef.current),
            nextOpenPaths: getRandomOpenPaths(randomRef.current),
          })),
        )
      })
    }

    const createAccident = () => {
      const x = Math.floor(randomRef.current() * maze[0].length)
      const y = Math.floor(randomRef.current() * maze.length)
      setAccidentPosition({ x, y })

      // Clear accident after 7 seconds
      setTimeout(() => setAccidentPosition(null), ACCIDENT_INTERVAL)
    }

    const pathInterval = setInterval(changePaths, PATH_CHANGE_INTERVAL)
    const accidentInterval = setInterval(createAccident, ACCIDENT_INTERVAL)

    return () => {
      clearInterval(pathInterval)
      clearInterval(accidentInterval)
    }
  }, [gameStatus, maze])

  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameStatus !== "playing") return

      const newX = playerPosition.x + dx
      const newY = playerPosition.y + dy

      if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
        const currentCell = maze[playerPosition.y][playerPosition.x]
        const newDirection = dx === 1 ? "east" : dx === -1 ? "west" : dy === -1 ? "north" : "south"

        if (currentCell.openPaths.includes(newDirection)) {
          if (accidentPosition && accidentPosition.x === newX && accidentPosition.y === newY) {
            setGameStatus("lost")
            return
          }

          setPlayerPosition({ x: newX, y: newY })
          setPlayerDirection(newDirection)
          setScore((prevScore) => Math.max(prevScore - 1, 0))

          if (maze[newY][newX].isEnd) {
            if (level === MAX_LEVEL) {
              setGameStatus("won")
            } else {
              setLevel((prevLevel) => {
                const newLevel = prevLevel + 1
                setMaze(generateMaze(newLevel))
                setPlayerPosition({ x: 0, y: 0 })
                setPlayerDirection("east")
                setTimeLeft(60)
                setScore((prevScore) => Math.max(prevScore - SCORE_DECREMENT, 0))
                return newLevel
              })
            }
          }
        }
      }
    },
    [maze, playerPosition, level, gameStatus, accidentPosition],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault() // Prevent default scrolling behavior
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
      e.preventDefault() // Prevent default touch behavior
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }

    const handleTouchEnd = (e) => {
      e.preventDefault() // Prevent default touch behavior
      const dx = e.changedTouches[0].clientX - touchStart.current.x
      const dy = e.changedTouches[0].clientY - touchStart.current.y

      if (Math.abs(dx) > Math.abs(dy)) {
        movePlayer(dx > 0 ? 1 : -1, 0)
      } else {
        movePlayer(0, dy > 0 ? 1 : -1)
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [movePlayer])

  const restartGame = () => {
    setLevel(1)
    setMaze(generateMaze(1))
    setPlayerPosition({ x: 0, y: 0 })
    setPlayerDirection("east")
    setScore(INITIAL_SCORE)
    setTimeLeft(60)
    setGameStatus("playing")
    setAccidentPosition(null)
  }

  return (
    <div className="App">
      <h1>City Maze</h1>
      <GameInfo level={level} score={score} timeLeft={timeLeft} />
      <Maze
        maze={maze}
        playerPosition={playerPosition}
        playerDirection={playerDirection}
        windowSize={windowSize}
        accidentPosition={accidentPosition}
      />
      <div className="control-buttons">
        <button onClick={() => movePlayer(0, -1)} aria-label="Move Up">
          <ArrowUp />
        </button>
        <div className="horizontal-buttons">
          <button onClick={() => movePlayer(-1, 0)} aria-label="Move Left">
            <ArrowLeft />
          </button>
          <button onClick={() => movePlayer(1, 0)} aria-label="Move Right">
            <ArrowRight />
          </button>
        </div>
        <button onClick={() => movePlayer(0, 1)} aria-label="Move Down">
          <ArrowDown />
        </button>
      </div>
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
    </div>
  )
}

export default ClientMaze

