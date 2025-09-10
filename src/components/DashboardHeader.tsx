
import React from "react";
import TopNav from "./TopNav";

export default function DashboardHeader({
  currentRank,
  badges,
  username,
  powerLevel,
  daysActive,
}: {
  currentRank: { name: string };
  badges: string[];
  username: string;
  powerLevel: number;
  daysActive: number;
}) {
  return (
    <>
      <TopNav />
      <div className="w-full flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-[#0a0a0a90] border-2 border-system-blue2 rounded-xl shadow-blue-glow animate-fade-in mb-2 gap-3 sm:gap-0 progress-container">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <div className="flex items-center flex-wrap gap-2 justify-center sm:justify-start">
            <span className="text-system-blue2 text-lg sm:text-xl lg:text-2xl font-extrabold tracking-widest">
              [{currentRank.name}]
            </span>
            {badges.length > 0 &&
              <span title="Rank Badge">
                <span className="inline-block text-shadow-lg animate-pulse" style={{ fontSize: '1.2rem' }}>
                  🏅
                </span>
              </span>
            }
            <span className="text-white text-sm sm:text-base lg:text-lg">Hunter: <b className="text-system-blue">{username}</b></span>
          </div>
          <div className="text-xs text-white/80 text-center sm:text-left">System status: <span className="text-system-blue font-bold">Online</span></div>
        </div>
        <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
          <span className="text-system-blue2 font-bold text-sm sm:text-base">Power Level</span>
          <span className="font-orbitron text-xl sm:text-2xl lg:text-3xl text-system-blue animate-pulse transition-all duration-500">
            {powerLevel}
          </span>
          <span className="text-xs text-white/60">Days Active: {daysActive}</span>
        </div>
      </div>
    </>
  );
}
