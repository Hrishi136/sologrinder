
import React from "react"
import SystemPanel from "../components/SystemPanel"
import TopNav from "../components/TopNav"

export default function Quests() {
  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="container mx-auto pt-4 flex flex-col gap-8 items-center">
        <SystemPanel className="w-full max-w-4xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron text-2xl text-system-blue font-extrabold">
              Quest Management
            </h2>
            <button className="glow-button" onClick={()=>alert("New Quest Modal coming soon!")}>
              + New Quest
            </button>
          </div>
          <div className="grid gap-6">
            {/* Quest cards dummy */}
            {[
              {id:1, name:"100 Push-ups", category:"Physical", difficulty:"E-Rank", completed: false},
              {id:2, name:"Study Strategy for 20min", category:"Mental", difficulty:"D-Rank", completed: true}
            ].map(q=>(
              <SystemPanel key={q.id} className="py-4 px-6 flex flex-col sm:flex-row items-center justify-between mb-2">
                <div>
                  <h3 className="font-orbitron text-xl text-system-blue mb-1">{q.name}</h3>
                  <div className="flex gap-3 text-system-blue2 text-sm">
                    <span>{q.category} Training</span>
                    <span>{q.difficulty}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <button
                    className="text-xs bg-system-blue2 bg-opacity-80 rounded px-3 py-1 font-orbitron font-semibold text-white hover:scale-105 transition-all"
                    onClick={()=>window.location.href='/quest/1'}
                  >View</button>
                  <button
                    className="text-xs bg-system-blue bg-opacity-30 rounded px-2 py-1 font-orbitron text-white hover:bg-opacity-70 transition"
                  >Edit</button>
                  <button
                    className="text-xs bg-red-700 bg-opacity-50 rounded px-2 py-1 font-orbitron text-white hover:bg-opacity-80 transition"
                  >Delete</button>
                </div>
              </SystemPanel>
            ))}
          </div>
        </SystemPanel>
      </div>
    </div>
  )
}
