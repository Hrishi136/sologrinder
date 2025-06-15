
import React from "react";
import { Lock, Star } from "lucide-react";

export default function ShadowCard({ shadow }: { shadow: any }) {
  const isUnlocked = shadow.unlocked;

  if (isUnlocked) {
    return (
      <div className="relative group bg-gradient-to-br from-black via-system-blue/60 to-system-blue2/90 rounded-2xl shadow-blue-glow flex flex-col px-2 pt-4 pb-3 items-center border-2 border-system-blue2 hover:scale-105 transition cursor-pointer">
        {/* Glowing border/artwork */}
        <div className="w-11 h-11 rounded-full border-2 border-blue-400 bg-system-blue/30 flex items-center justify-center mb-1 shadow-lg">
          <span className="text-system-blue2 text-2xl">{shadow.name[0]}</span>
        </div>
        <span className="text-system-blue2 font-bold text-base">{shadow.name}</span>
        {shadow.tier >= 4 && (
          <span className="absolute right-1 top-1 text-yellow-400">
            <Star size={20} strokeWidth={2.5}/>
          </span>
        )}
        <div className="text-xs text-white mt-0.5 mb-1">{shadow.description}</div>
        <div className="text-xs text-white/70 mb-1">
          Power: <span className="font-bold text-system-blue2">+{shadow.power}</span>
        </div>
        <div className="text-xs text-blue-300">Abilities: <span>{shadow.abilities}</span></div>
        <div className="text-xs text-gray-400 mt-1">Unlocked: {shadow.unlockDate}</div>
        <button className="glow-button mt-2 bg-system-blue2/80 hover:bg-system-blue2 text-white px-2 py-1 rounded text-xs">
          View Details
        </button>
      </div>
    );
  } else {
    // Show locked: dark overlay, lock, requirements, and progress bar
    // (for demo, make up requirements & progress)
    let reqs = [];
    let progress = 0;
    if (shadow.name === "Mage") { reqs = ["25 Intelligence quests", "100 Intelligence stat"]; progress = 0.45; }
    else if (shadow.name === "Knight") { reqs = ["C-Rank", "150 Strength", "15 Hard Combat quests"]; progress = 0.3; }
    else { reqs = ["Complete 1 more quest"]; progress = 0.1; }
    return (
      <div className="relative bg-gradient-to-br from-black to-gray-900 rounded-2xl shadow-inner flex flex-col px-2 pt-4 pb-3 items-center border-2 border-gray-800 opacity-70 hover:opacity-95 group transition">
        <div className="opacity-60 w-11 h-11 rounded-full border border-gray-700 bg-black flex items-center justify-center mb-1 relative">
          <Lock size={22} className="text-gray-600 absolute -top-2 -right-2" />
          <span className="text-gray-700 text-2xl">?</span>
        </div>
        <span className="text-gray-400 font-bold text-base mb-1">{shadow.name}</span>
        <div className="text-xs text-gray-500 mb-1">
          <span>Requirements:</span>
          <ul className="list-disc text-[11px] px-2">
            {reqs.map(r => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="w-full mt-1 mb-2 bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-500 via-yellow-400 to-green-400 h-2 transition-all"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <button className="glow-button bg-gray-900 border border-gray-600 text-gray-400 px-2 py-1 rounded text-xs hover:bg-gray-700">
          Requirements
        </button>
        <div className="absolute left-1 top-1 flex gap-0.5">{Array.from({length: shadow.tier}).map((_, i) =>
          <Star key={i} size={12} className="text-yellow-400" />)}
        </div>
      </div>
    );
  }
}
