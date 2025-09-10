
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
      <div className="w-full flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-[#0a0a0a90] border-2 border-system-blue2 rounded-xl shadow-blue-glow animate-fade-in mb-2 gap-2 sm:gap-0">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-system-blue2 text-xl sm:text-2xl font-extrabold tracking-widest">
              [{currentRank.name}]
            </span>
            {badges.length > 0 &&
              <span title="Rank Badge">
                <span className="inline-block text-shadow-lg animate-pulse" style={{ fontSize: 22 }}>
                  🏅
                </span>
              </span>
            }
            <span className="ml-2 text-white text-base sm:text-lg">Hunter: <b>{username}</b></span>
          </div>
          <div className="text-xs text-white/80">System status: <span className="text-system-blue font-bold">Online</span></div>
        </div>
        <div className="flex flex-col items-end w-full sm:w-auto">
          <span className="text-system-blue2 font-bold text-sm sm:text-base">Power Level</span>
          <span className="font-orbitron text-2xl sm:text-3xl text-system-blue animate-pulse transition-all duration-500">
            {powerLevel}
          </span>
          <span className="text-xs text-white/60">Days Active: {daysActive}</span>
        </div>
      </div>
    </>
  );
}
