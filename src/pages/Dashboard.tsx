
import React from "react"
import SystemPanel from "../components/SystemPanel"
import TopNav from "../components/TopNav"

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="particle-bg">
        {[...Array(10)].map((_,i) => (
          <div key={i}
            className="particle-dot"
            style={{
              left: `${Math.random()*100}%`,
              width: `${18+Math.random()*16}px`,
              height: `${18+Math.random()*16}px`,
              animationDelay: `${-Math.random()*14}s`,
              opacity: 0.15 + Math.random()*0.12,
              bottom: `${Math.random()*30}vh`
            }}
          />
        ))}
      </div>
      <div className="container mx-auto pt-4 pb-16 flex flex-col gap-8 items-center">
        <SystemPanel className="w-full max-w-4xl mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 p-6">
            <div>
              <h2 className="font-orbitron text-4xl text-system-blue mb-1 font-extrabold tracking-widest">[E-RANK]</h2>
              <p className="uppercase text-system-blue2 mb-2 font-bold text-lg">Hunter: Sung Jinwoo</p>
              <p className="text-xs text-system-blue2/80">Welcome back, Shadow Monarch. <span className="font-bold text-system-blue">Let's level up!</span></p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="font-orbitron text-2xl text-system-blue">Power Level</span>
              <span className="font-orbitron text-3xl text-system-blue2">0</span>
            </div>
          </div>
        </SystemPanel>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today's Quests */}
          <SystemPanel className="p-5 min-h-[200px]">
            <h3 className="font-orbitron text-xl text-system-blue mb-4">Today's Quests</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <input type="checkbox" className="accent-system-blue2 scale-125" />
                <span className="font-inter text-white">100 Push-ups (Physical Training)</span>
              </li>
              <li className="flex items-center gap-3">
                <input type="checkbox" className="accent-system-blue2 scale-125" />
                <span className="font-inter text-white">Study Strategy for 20 mins (Mental Development)</span>
              </li>
              <li className="flex items-center gap-3">
                <input type="checkbox" className="accent-system-blue2 scale-125" />
                <span className="font-inter text-white">Eat Balanced Meal (Lifestyle)</span>
              </li>
            </ul>
          </SystemPanel>
          {/* Quick Stats */}
          <SystemPanel className="p-5 min-h-[200px] flex flex-col gap-4">
            <h3 className="font-orbitron text-xl text-system-blue mb-2">Quick Stats</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Completed Quests</span>
                <span className="font-bold text-white">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Streak</span>
                <span className="font-bold text-white">0 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-system-blue">Next Rank</span>
                <span className="font-bold text-white">E→D</span>
              </div>
            </div>
          </SystemPanel>
          {/* Core Stats */}
          <SystemPanel className="md:col-span-2 p-5">
            <h3 className="font-orbitron text-xl text-system-blue mb-4">Hunter Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              {[
                {label:"Strength", val:0},
                {label:"Agility", val:0},
                {label:"Intelligence", val:0},
                {label:"Vitality", val:0},
              ].map(stat=>(
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="font-orbitron text-system-blue2 text-sm">{stat.label}</span>
                  <div className="relative w-12 h-24 flex items-end mb-2">
                    <div className="absolute bottom-0 left-2 w-2 h-full bg-[#191e26] rounded-full border border-system-blue2"></div>
                    <div className="absolute bottom-0 left-2 w-2 rounded-full bg-gradient-to-t from-system-blue2 to-system-blue" style={{height:`4px`, transition:"height 0.5s"}} />
                  </div>
                  <span className="font-orbitron text-white">{stat.val}</span>
                </div>
              ))}
            </div>
          </SystemPanel>
        </div>
        <div className="w-full flex justify-end mt-6">
          <button className="glow-button text-lg" onClick={()=>window.location.href='/quests'}>
            + Accept New Quest
          </button>
        </div>
      </div>
    </div>
  )
}

