import React from "react";
import { useNavigate } from "react-router-dom";
import ShadowUnitAvatar from "./ShadowUnitAvatar";
import { useShadowArmy } from "@/hooks/useShadowArmy";
import { SHADOW_UNITS } from "@/constants/shadowArmy";

type Shadow = { name: string; tier: number };
type Props = {
  unlocked: string[];
  allShadows: Shadow[];
  onViewAll?: () => void;
};

export default function ShadowArmyPreview({ unlocked, allShadows, onViewAll }: Props) {
  const navigate = useNavigate();
  const { shadowImages } = useShadowArmy();

  // Display first 3 shadows: Iron Soldier, Scout, Mage
  const firstThreeShadows = SHADOW_UNITS.slice(0, 3);

  function handleViewArmy() {
    navigate("/army");
  }

  return (
    <div className="system-panel bg-black/75 border-system-blue2 border-2 rounded-lg shadow-lg p-3 sm:p-4 animate-fade-in">
      <div className="font-orbitron text-system-blue2 mb-3 sm:mb-4 text-xs sm:text-lg">Shadow Army</div>
      <div className="flex gap-2 sm:gap-4 items-center justify-center flex-wrap">
        {firstThreeShadows.map((shadow) => {
          const isUnlocked = unlocked.includes(shadow.name);
          const permanentImage = shadowImages[shadow.name] || null;

          return (
            <div
              key={shadow.name}
              className="flex flex-col items-center"
              title={shadow.name}
            >
              <ShadowUnitAvatar
                name={shadow.name}
                isUnlocked={isUnlocked}
                size="md"
                permanentImage={permanentImage}
              />
              <span className={`text-[10px] sm:text-xs font-orbitron mt-1 truncate max-w-[60px] sm:max-w-none ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                {shadow.name}
              </span>
            </div>
          );
        })}
      </div>
      <button
        className="mt-3 sm:mt-4 glow-button bg-system-blue2/80 hover:bg-system-blue2 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-orbitron text-xs sm:text-sm transition active:scale-95 w-full"
        onClick={onViewAll ? onViewAll : handleViewArmy}
      >
        View Full Army
      </button>
    </div>
  );
}
