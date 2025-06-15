
import React from "react";

type Shadow = { name: string, tier: number };
type Props = {
  unlocked: string[],
  allShadows: Shadow[],
  onViewAll: () => void,
};

export default function ShadowArmyPreview({ unlocked, allShadows, onViewAll }: Props) {
  // Show 4 most recently unlocked, or show up to 4 lock silhouettes
  const previews = unlocked.slice(-4);
  const locked = allShadows.filter(s => !unlocked.includes(s.name)).slice(0, 4 - previews.length);

  return (
    <div className="system-panel bg-black/75 border-system-blue2 border-2 rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="font-orbitron text-system-blue2 mb-2 text-lg">Shadow Army</div>
      <div className="flex gap-4 items-center justify-center">
        {previews.map((name, idx) => (
          <div
            key={name}
            className="rounded-full border-2 border-system-blue2 flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-b from-system-blue/10 to-black shadow-lg animate-pulse"
            title={name}
          >
            <span className="text-system-blue2 text-2xl font-orbitron">{name[0]}</span>
            <span className="text-xs text-white font-orbitron">{name}</span>
          </div>
        ))}
        {locked.map((s, idx) => (
          <div
            key={s.name}
            className="rounded-full border-2 border-system-blue2 flex flex-col items-center justify-center w-16 h-16 opacity-40 bg-[#0a0a0a] shadow-inner"
            title="Locked"
          >
            <span className="text-gray-500 text-3xl">?</span>
            <span className="text-xs text-gray-700 font-mono">Locked</span>
          </div>
        ))}
      </div>
      <button
        className="mt-3 glow-button bg-system-blue2/80 hover:bg-system-blue2 text-white px-3 py-1 rounded-lg font-orbitron text-sm transition active:scale-95"
        onClick={onViewAll}
      >
        View Full Army
      </button>
    </div>
  )
}
