import dynamic from "next/dynamic"
import "./App.css"

const ClientMaze = dynamic(() => import("./ClientMaze"), { ssr: false })

function App() {
  return (
    <div className="App">
      <h1>City Maze</h1>
      <ClientMaze />
    </div>
  )
}

export default App

