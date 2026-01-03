import React from "react";
import { useNavigate } from "react-router-dom";
import ShadowUnitAvatar from "./ShadowUnitAvatar";

type Shadow = { name: string; tier: number };
type Props = {
  unlocked: string[];
  allShadows: Shadow[];
  onViewAll?: () => void;
};

export default function ShadowArmyPreview({ unlocked, allShadows, onViewAll }: Props) {
  const navigate = useNavigate();
  
  // Show 4 most recently unlocked, or show up to 4 lock silhouettes
  const previews = unlocked.slice(-4);
  const locked = allShadows
    .filter(s => !unlocked.includes(s.name))
    .slice(0, 4 - previews.length);

  function handleViewArmy() {
    navigate("/army");
  }

  return (
    <div className="system-panel bg-black/75 border-system-blue2 border-2 rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="font-orbitron text-system-blue2 mb-2 text-lg">Shadow Army</div>
      <div className="flex gap-4 items-center justify-center flex-wrap">
        {previews.map((name) => (
          <div
            key={name}
            className="flex flex-col items-center"
            title={name}
          >
            <ShadowUnitAvatar name={name} isUnlocked={true} size="md" />
            <span className="text-xs text-white font-orbitron mt-1">{name}</span>
          </div>
        ))}
        {locked.map((s) => (
          <div
            key={s.name}
            className="flex flex-col items-center"
            title="Locked"
          >
            <ShadowUnitAvatar name={s.name} isUnlocked={false} size="md" />
            <span className="text-xs text-gray-700 font-mono mt-1">Locked</span>
          </div>
        ))}
      </div>
      <button
        className="mt-3 glow-button bg-system-blue2/80 hover:bg-system-blue2 text-white px-3 py-1 rounded-lg font-orbitron text-sm transition active:scale-95"
        onClick={onViewAll ? onViewAll : handleViewArmy}
      >
        View Full Army
      </button>
    </div>
  );
}
