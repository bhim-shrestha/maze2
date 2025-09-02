"use client"

import dynamic from 'next/dynamic'

const ClientMaze = dynamic(() => import("../ClientMaze"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-6xl mb-4">🏙️</div>
        <div className="text-xl">Loading City Maze...</div>
      </div>
    </div>
  )
})

export default function SyntheticV0PageForDeployment() {
  return (
    <div className="App">
      <ClientMaze />
    </div>
  )
}