function Cell({ type, obstacle, isPlayerHere, trafficLightState, isExit }) {
  let cellClass = "cell"
  let content = ""

  if (type === "wall") {
    cellClass += " wall"
    content = "🏢"
  } else if (isPlayerHere) {
    cellClass += " player"
    content = "🚗"
  } else if (obstacle === "trafficLight") {
    cellClass += ` traffic-light ${trafficLightState}`
    content = trafficLightState === "green" ? "🟢" : "🔴"
  } else if (obstacle === "roadblock") {
    cellClass += " roadblock"
    content = "🚧"
  } else if (isExit) {
    cellClass += " exit"
    content = "🏁"
  }

  return <div className={cellClass}>{content}</div>
}

export default Cell

