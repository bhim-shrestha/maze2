function GameInfo({ level, score, timeLeft }) {
  return (
    <div className="game-info">
      <div>Level: {level}</div>
      <div>Score: {score}</div>
      <div>Time Left: {timeLeft}s</div>
    </div>
  )
}

export default GameInfo

