
import React from "react";
import SystemPanel from "../components/SystemPanel";
import TopNav from "../components/TopNav";
import { useShadowArmy } from "../hooks/useShadowArmy";
import { useHunterProgression, SHADOW_SOLDIERS } from "../hooks/useHunterProgression";

export default function Army() {
  const { unlocked, SHADOWS } = useShadowArmy();
  const unlockedNames = unlocked || [];

  // For each shadow: is it unlocked? Desc comes from SHADOW_SOLDIERS reqs.
  function getShadowRequirement(name: string): string {
    const shadow = SHADOW_SOLDIERS.find(s => s.name === name);
    if (!shadow) return "No requirements data.";
    return shadow.reqs?.join(" & ") ?? "";
  }

  return (
    <div className="min-h-screen w-full bg-system-bg relative">
      <TopNav />
      <div className="container mx-auto pt-4 flex flex-col items-center gap-10">
        <SystemPanel className="w-full max-w-4xl p-7">
          <h2 className="font-orbitron text-2xl text-system-blue font-extrabold mb-5">
            Shadow Army Collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {SHADOWS.map((s, i) => {
              const isUnlocked = unlockedNames.includes(s.name);
              return (
                <div
                  key={s.name}
                  className={`flex flex-col items-center p-2 ${isUnlocked ? "system-panel-glow" : "opacity-60"}`}
                >
                  <div className={`rounded-full bg-[#121b24] border-2 ${isUnlocked ?  "border-system-blue2 shadow-blue-glow":"border-[#222]" } w-16 h-16 flex items-center justify-center mb-3`}>
                    <img
                      src="https://lovable.dev/opengraph-image-p98pqg.png"
                      alt={s.name}
                      className="rounded-full w-11 h-11 object-contain"
                    />
                  </div>
                  <span className={`font-orbitron text-md ${isUnlocked?'text-system-blue':'text-system-blue2'}`}>{s.name}</span>
                  <span className="text-xs text-system-blue2 text-center mt-1">
                    {getShadowRequirement(s.name)}
                  </span>
                  {isUnlocked ?
                    <span className="text-xs text-green-400 mt-1">UNLOCKED</span> :
                    <span className="text-xs text-system-blue2">Locked</span>
                  }
                </div>
              );
            })}
          </div>
        </SystemPanel>
      </div>
    </div>
  );
}
