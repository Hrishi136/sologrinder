
import React from "react";

type Stat = { label: string; val: number };

export default function HunterStatsPanel({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-end w-full">
      {stats.map(stat => (
        <div key={stat.label} className="flex flex-col items-center min-w-0">
          <span className="font-orbitron text-system-blue2 text-xs sm:text-sm truncate w-full text-center">{stat.label}</span>
          <div className="relative w-8 sm:w-12 h-20 sm:h-24 flex items-end mb-2">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full bg-[#191e26] rounded-full border border-system-blue2"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 rounded-full bg-gradient-to-t from-system-blue2 to-system-blue"
              style={{ height: `${(stat.val / 30) * 100}%`, transition: "height 0.5s" }} />
          </div>
          <span className="font-orbitron text-white text-sm sm:text-base">{stat.val}</span>
        </div>
      ))}
    </div>
  );
}
