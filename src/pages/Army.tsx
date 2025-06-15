
import React from "react"
import SystemPanel from "../components/SystemPanel"
import TopNav from "../components/TopNav"

const mockShadows = [
  { name: "Igris", unlocked: true, desc: "Complete 10 quests", img: '' },
  { name: "Iron", unlocked: false, desc: "Reach D-Rank", img: '' },
  { name: "Tank", unlocked: false, desc: "Complete 5 Special Ops", img: '' },
  { name: "Tusk", unlocked: false, desc: "Complete 7 Intelligence quests", img: '' }
]

export default function Army() {
  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="container mx-auto pt-4 flex flex-col items-center gap-10">
        <SystemPanel className="w-full max-w-4xl p-7">
          <h2 className="font-orbitron text-2xl text-system-blue font-extrabold mb-5">
            Shadow Army Collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {mockShadows.map((s,i) => (
              <div key={i} className={`flex flex-col items-center p-2 ${s.unlocked ? "system-panel-glow" : "opacity-60"}`}>
                <div className={`rounded-full bg-[#121b24] border-2 ${s.unlocked ?  "border-system-blue2 shadow-blue-glow":"border-[#222]" } w-16 h-16 flex items-center justify-center mb-3`}>
                  <img src="https://lovable.dev/opengraph-image-p98pqg.png" alt={s.name} className="rounded-full w-11 h-11 object-contain" />
                </div>
                <span className={`font-orbitron text-md ${s.unlocked?'text-system-blue':'text-system-blue2'}`}>{s.name}</span>
                <span className="text-xs text-system-blue2 text-center mt-1">{s.desc}</span>
                {s.unlocked ?
                  <span className="text-xs text-green-400 mt-1">UNLOCKED</span> :
                  <span className="text-xs text-system-blue2">Locked</span>
                }
              </div>
            ))}
          </div>
        </SystemPanel>
      </div>
    </div>
  )
}
