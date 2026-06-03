
import React from "react";

type Stat = { label: string; val: number };

// Function to get display value and bar height
function getStatDisplay(stat: Stat) {
  const val = stat.val;
  
  // For XP, show abbreviated format for large numbers
  let displayVal: string;
  if (val >= 10000) {
    displayVal = `${(val / 1000).toFixed(1)}K`;
  } else if (val >= 1000) {
    displayVal = `${(val / 1000).toFixed(1)}K`;
  } else {
    displayVal = val.toString();
  }
  
  // Scale bar height based on stat type
  let maxVal: number;
  switch (stat.label.toLowerCase()) {
    case 'xp':
      maxVal = 60000; // SS-Rank requirement
      break;
    case 'power':
      maxVal = 5000; // Reasonable max power
      break;
    case 'resolve':
      maxVal = 500; // Reasonable max resolve
      break;
    default:
      maxVal = 100;
  }
  
  const heightPercent = Math.min((val / maxVal) * 100, 100);
  
  return { displayVal, heightPercent };
}

export default function HunterStatsPanel({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4 items-end w-full overflow-hidden">
      {stats.map(stat => {
        const { displayVal, heightPercent } = getStatDisplay(stat);
        return (
          <div key={stat.label} className="flex flex-col items-center min-w-0 max-w-full">
            <span className="font-orbitron text-system-blue2 text-[9px] sm:text-xs md:text-sm truncate w-full text-center px-0.5">{stat.label}</span>
            <div className="relative w-6 sm:w-8 md:w-12 h-16 sm:h-20 md:h-24 flex items-end mb-0.5 sm:mb-1 md:mb-2 overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 h-full bg-[#191e26] rounded-full border border-system-blue2 overflow-hidden"></div>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-system-blue2 to-system-blue"
                style={{
                  height: `${Math.max(heightPercent, 2)}%`,
                  transition: "height 0.5s",
                  maxHeight: '100%'
                }}
              />
            </div>
            <span className="font-orbitron text-white text-[9px] sm:text-xs md:text-base">{displayVal}</span>
          </div>
        );
      })}
    </div>
  );
}
