function Cell({ type, obstacle, isPlayerHere, trafficLightState }) {
  const content =
    type === "wall"
      ? "🧱"
      : isPlayerHere
        ? "🚗"
        : obstacle === "trafficLight"
          ? trafficLightState === "green"
            ? "🟢"
            : "🔴"
          : obstacle === "roadblock"
            ? "🚧"
            : " "
  return <div className="cell">{content}</div>
}

export default Cell

