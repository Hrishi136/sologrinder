import React from "react";
import { Trophy } from "lucide-react";

interface Props {
  rank: number | null;
  onClick?: () => void;
}

export default function FloatingHunterRank({ rank, onClick }: Props) {
  if (!rank) return null;

  return (
    <div 
      className="fixed top-20 right-4 z-50 cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-system-panel/95 border-2 border-system-blue rounded-full px-4 py-2 shadow-blue-glow backdrop-blur-sm hover:bg-system-blue/20 transition-all duration-300 animate-pulse">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-system-blue" />
          <span className="font-orbitron text-sm font-bold text-system-blue">
            Rank #{rank}
          </span>
        </div>
      </div>
    </div>
  );
}