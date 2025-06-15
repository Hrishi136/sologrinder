
import React from "react"
import SystemPanel from "../components/SystemPanel"
import TopNav from "../components/TopNav"

export default function QuestDetail() {
  // A stub page for now
  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="container mx-auto pt-8 flex flex-col items-center">
        <SystemPanel className="w-full max-w-2xl p-8">
          <h2 className="font-orbitron text-2xl text-system-blue font-extrabold mb-4">
            Quest Details
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron">Name:</span>
              <span className="text-white">100 Push-ups</span>
            </div>
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron">Category:</span>
              <span className="text-white">Physical Training</span>
            </div>
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron">Difficulty:</span>
              <span className="text-white">E-Rank</span>
            </div>
            <div className="flex gap-2">
              <span className="text-system-blue2 font-orbitron">Streak:</span>
              <span className="text-white">4</span>
            </div>
            {/* Streak Calendar dummy */}
            <div className="mt-4">
              <span className="text-system-blue2 font-orbitron">Progress Calendar</span>
              <div className="flex gap-1 mt-2">
                {[...Array(7)].map((_,i)=>(
                  <div key={i} className={`w-6 h-6 rounded ${i<4?'bg-system-blue2':'bg-[#1a1f28]'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </SystemPanel>
      </div>
    </div>
  )
}
