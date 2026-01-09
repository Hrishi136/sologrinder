import React from "react";
import SystemPanel from "../components/SystemPanel";
import { useShadowArmy } from "../hooks/useShadowArmy";
import { SHADOW_SOLDIERS } from "../hooks/useHunterProgression";
import { SHADOW_UNITS } from "@/constants/shadowArmy";
import ShadowUnitAvatar from "@/components/ShadowUnitAvatar";

export default function Army() {
  const { unlocked, shadowImages, loading } = useShadowArmy();
  const unlockedNames = unlocked || [];

  function getShadowRequirement(name: string): string {
    const shadow = SHADOW_SOLDIERS.find(s => s.name === name);
    if (!shadow) return "No requirements data.";
    return shadow.reqs?.join(" & ") ?? "";
  }

  return (
    <div className="min-h-screen w-full bg-system-bg relative pt-20">
      <div className="container mx-auto flex flex-col items-center gap-10">
        <SystemPanel className="w-full max-w-4xl p-7">
          <h2 className="font-orbitron text-2xl text-system-blue font-extrabold mb-5">
            Shadow Army Collection
          </h2>
          {loading ? (
            <div className="text-center text-system-blue2 py-10">
              Loading Shadow Army...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {SHADOW_UNITS.map((s) => {
                const isUnlocked = unlockedNames.includes(s.name);
                const permanentImage = shadowImages[s.name] || null;
                
                return (
                  <div
                    key={s.name}
                    className={`flex flex-col items-center p-2 ${isUnlocked ? "system-panel-glow" : "opacity-60"}`}
                  >
                    <div className="mb-3">
                      <ShadowUnitAvatar 
                        name={s.name} 
                        isUnlocked={isUnlocked} 
                        size="md"
                        permanentImage={permanentImage}
                      />
                    </div>
                    <span className={`font-orbitron text-md ${isUnlocked ? 'text-system-blue' : 'text-system-blue2'}`}>
                      {s.name}
                    </span>
                    <span className="text-xs text-system-blue2 text-center mt-1">
                      {getShadowRequirement(s.name)}
                    </span>
                    {isUnlocked ? (
                      <span className="text-xs text-green-400 mt-1">Unlocked</span>
                    ) : (
                      <span className="text-xs text-system-blue2">Locked</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SystemPanel>
      </div>
    </div>
  );
}
