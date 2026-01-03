import React from "react";
import { Lock, Star } from "lucide-react";
import ShadowUnitAvatar from "./ShadowUnitAvatar";

interface ShadowCardProps {
  shadow: {
    name: string;
    tier: number;
    unlocked?: boolean;
    description?: string;
    power?: number;
    abilities?: string;
    unlockDate?: string;
  };
  permanentImage?: string | null;
}

export default function ShadowCard({ shadow, permanentImage }: ShadowCardProps) {
  const isUnlocked = shadow.unlocked;

  if (isUnlocked) {
    return (
      <div className="relative group bg-gradient-to-br from-black via-system-blue/60 to-system-blue2/90 rounded-2xl shadow-blue-glow flex flex-col px-3 sm:px-2 pt-4 pb-3 items-center border-2 border-system-blue2 hover:scale-105 transition cursor-pointer w-full min-w-0">
        <ShadowUnitAvatar name={shadow.name} isUnlocked={true} size="md" permanentImage={permanentImage} />
        <span className="text-system-blue2 font-bold text-sm sm:text-base text-center break-words w-full px-1 mt-2">
          {shadow.name}
        </span>
        {shadow.tier >= 4 && (
          <span className="absolute right-1 top-1 text-yellow-400">
            <Star size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
          </span>
        )}
        {shadow.description && (
          <div className="text-xs text-white mt-0.5 mb-1 text-center break-words w-full px-1">
            {shadow.description}
          </div>
        )}
        {shadow.power !== undefined && (
          <div className="text-xs text-white/70 mb-1">
            Power: <span className="font-bold text-system-blue2">+{shadow.power}</span>
          </div>
        )}
        {shadow.abilities && (
          <div className="text-xs text-blue-300 text-center break-words w-full px-1">
            Abilities: <span>{shadow.abilities}</span>
          </div>
        )}
        {shadow.unlockDate && (
          <div className="text-xs text-gray-400 mt-1">Unlocked: {shadow.unlockDate}</div>
        )}
        <button className="glow-button mt-2 bg-system-blue2/80 hover:bg-system-blue2 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap">
          View Details
        </button>
      </div>
    );
  }

  // Locked state
  const reqs = shadow.name === "Mage" 
    ? ["25 Intelligence quests", "100 Intelligence stat"]
    : shadow.name === "Knight"
    ? ["C-Rank", "150 Strength", "15 Hard Combat quests"]
    : ["Complete 1 more quest"];
  
  const progress = shadow.name === "Mage" ? 0.45 : shadow.name === "Knight" ? 0.3 : 0.1;

  return (
    <div className="relative bg-gradient-to-br from-black to-gray-900 rounded-2xl shadow-inner flex flex-col px-3 sm:px-2 pt-4 pb-3 items-center border-2 border-gray-800 opacity-70 hover:opacity-95 group transition w-full min-w-0">
      <div className="relative mb-1">
        <ShadowUnitAvatar name={shadow.name} isUnlocked={false} size="md" />
        <Lock size={20} className="sm:w-5 sm:h-5 text-gray-600 absolute -top-2 -right-2" />
      </div>
      <span className="text-gray-400 font-bold text-sm sm:text-base mb-1 text-center break-words w-full px-1">
        {shadow.name}
      </span>
      <div className="text-xs text-gray-500 mb-1 w-full px-1">
        <span>Requirements:</span>
        <ul className="list-disc text-[11px] px-2 break-words">
          {reqs.map(r => (
            <li key={r} className="break-words">{r}</li>
          ))}
        </ul>
      </div>
      <div className="w-full mt-1 mb-2 bg-gray-800 rounded-full h-2 overflow-hidden px-1">
        <div
          className="bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 h-2 transition-all"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <button className="glow-button bg-gray-900 border border-gray-600 text-gray-400 px-3 py-1.5 rounded text-xs hover:bg-gray-700 whitespace-nowrap">
        Requirements
      </button>
      <div className="absolute left-1 top-1 flex gap-0.5">
        {Array.from({ length: shadow.tier }).map((_, i) => (
          <Star key={i} size={10} className="sm:w-3 sm:h-3 text-yellow-400" />
        ))}
      </div>
    </div>
  );
}
