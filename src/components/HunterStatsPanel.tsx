
import React from "react";

type Stat = { label: string; val: number };

export default function HunterStatsPanel({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 items-end w-full overflow-hidden">
      {stats.map(stat => (
        <div key={stat.label} className="flex flex-col items-center min-w-0 max-w-full">
          <span className="font-orbitron text-system-blue2 text-[10px] sm:text-sm truncate w-full text-center px-1">{stat.label}</span>
          <div className="relative w-6 sm:w-12 h-16 sm:h-24 flex items-end mb-1 sm:mb-2 overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full bg-[#191e26] rounded-full border border-system-blue2 overflow-hidden"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 rounded-full bg-gradient-to-t from-system-blue2 to-system-blue"
              style={{ height: `${Math.min((stat.val / 30) * 100, 100)}%`, transition: "height 0.5s", maxHeight: '100%' }} />
          </div>
          <span className="font-orbitron text-white text-xs sm:text-base">{stat.val}</span>
        </div>
      ))}
    </div>
  );
}
