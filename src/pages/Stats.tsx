
import React from "react";
import SystemPanel from "../components/SystemPanel";
;
import { useHunterProgression } from "../hooks/useHunterProgression";

export default function Stats() {
  const {
    stats,
    currentRank,
    nextRank,
    rankPoints,
  } = useHunterProgression();

  // Progress bar %
  const nextPoints = nextRank?.points ?? 1;
  const progressPercent = Math.min(
    (rankPoints / nextPoints) * 100,
    100
  ).toFixed(1);

  return (
    <div className="min-h-screen w-full bg-system-bg relative pt-20">
      <div className="container mx-auto flex flex-col items-center gap-10">
        <SystemPanel className="w-full max-w-2xl p-7">
          <h2 className="font-orbitron text-2xl text-system-blue font-extrabold mb-5">
            Hunter Stats & Rank Progress
          </h2>
          <div className="grid grid-cols-2 gap-8 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-system-blue2 font-orbitron">{stat.label}</span>
                <div className="relative w-8 h-24 flex items-end mb-2">
                  <div className="absolute bottom-0 left-3 w-2 h-full bg-[#191e26] rounded-full border border-system-blue2" />
                  <div className="absolute bottom-0 left-3 w-2 rounded-full bg-gradient-to-t from-system-blue2 to-system-blue" style={{height:`${(stat.val/30)*100}%`, transition:"height 0.5s"}} />
                </div>
                <span className="font-orbitron text-white">{stat.val}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-orbitron text-lg text-system-blue2">Rank Progress</span>
            <div className="w-full bg-[#191e26] rounded-full h-5 relative border border-system-blue mt-2">
              <div className="absolute left-0 top-0 h-5 rounded-full bg-gradient-to-r from-system-blue2 to-system-blue animate-fade-in"
                style={{ width: `${progressPercent}%` }} />
              <span className="font-orbitron text-system-blue absolute left-2 top-0 h-5 flex items-center" style={{fontSize:'1.1rem'}}>
                Next Rank: {nextRank ? nextRank.name : "MAX"}
              </span>
            </div>
            <span className="font-orbitron text-xs text-system-blue mt-1">
              Points: {rankPoints}/{nextRank?.points ?? "MAX"}
            </span>
          </div>
        </SystemPanel>
      </div>
    </div>
  );
}
