import React, { useState, useEffect } from "react";
import SystemPanel from "../components/SystemPanel";
import { useShadowArmy } from "../hooks/useShadowArmy";
import { useHunterProgression } from "../hooks/useHunterProgression";
import { SHADOW_SOLDIERS } from "../hooks/useHunterProgression";
import { SHADOW_UNITS } from "@/constants/shadowArmy";
import ShadowUnitAvatar from "@/components/ShadowUnitAvatar";
import { useShadowUnlock } from "@/contexts/ShadowUnlockContext";

export default function Army() {
  const { unlocked, shadowImages, loading, unlockShadow } = useShadowArmy();
  const { triggerUnlock } = useShadowUnlock();
  const { stats, streak, questCount, totalQuests, currentRankIndex, RANKS } = useHunterProgression();
  const unlockedNames = unlocked || [];

  function getShadowRequirement(name: string): string {
    const shadow = SHADOW_SOLDIERS.find(s => s.name === name);
    if (!shadow) return "No requirements data.";
    return shadow.reqs?.join(" & ") ?? "";
  }

  // Check if shadow requirements are met
  function checkRequirementsMet(shadowName: string): boolean {
    const shadow = SHADOW_SOLDIERS.find(s => s.name === shadowName);
    if (!shadow) return false;

    const getStatValue = (statName: string) => {
      const stat = stats?.find(s => s.label.toLowerCase() === statName.toLowerCase());
      return stat?.value || 0;
    };

    // Check each requirement
    return shadow.reqs.every(req => {
      if (req.includes("Complete 20 Combat Training")) {
        return questCount?.total >= 20;
      }
      if (req.includes("Achieve first 7-day streak")) {
        return streak >= 7;
      }
      if (req.includes("Complete 25 Intelligence")) {
        return questCount?.total >= 25;
      }
      if (req.includes("Reach 100 Intelligence")) {
        return getStatValue("Intelligence") >= 100;
      }
      if (req.includes("Reach C-Rank")) {
        return currentRankIndex >= 4; // C-Rank
      }
      if (req.includes("150 Strength")) {
        return getStatValue("Strength") >= 150;
      }
      if (req.includes("15 hard Combat")) {
        return questCount?.hardTotal >= 15;
      }
      if (req.includes("Reach B-Rank")) {
        return currentRankIndex >= 3; // B-Rank
      }
      if (req.includes("200 Agility")) {
        return getStatValue("Agility") >= 200;
      }
      if (req.includes("30-day streak")) {
        return streak >= 30;
      }
      if (req.includes("Complete 50 Vitality")) {
        return questCount?.total >= 50;
      }
      if (req.includes("Maintain 21-day")) {
        return streak >= 21;
      }
      if (req.includes("Reach A-Rank")) {
        return currentRankIndex >= 2; // A-Rank
      }
      if (req.includes("300 Strength")) {
        return getStatValue("Strength") >= 300;
      }
      if (req.includes("500 total Vitality")) {
        return getStatValue("Vitality") >= 500;
      }
      if (req.includes("250 Agility")) {
        return getStatValue("Agility") >= 250;
      }
      if (req.includes("200 Intelligence")) {
        return getStatValue("Intelligence") >= 200;
      }
      if (req.includes("Complete 100 total")) {
        return totalQuests >= 100;
      }
      if (req.includes("Complete 75 hard")) {
        return questCount?.hardTotal >= 75;
      }
      if (req.includes("Achieve 45-day")) {
        return streak >= 45;
      }
      if (req.includes("S-Rank")) {
        return currentRankIndex >= 1; // S-Rank
      }
      if (req.includes("400 Strength")) {
        return getStatValue("Strength") >= 400;
      }
      if (req.includes("150 hard Combat")) {
        return questCount?.hardTotal >= 150;
      }
      if (req.includes("National Level")) {
        return currentRankIndex >= 0; // National Level
      }
      if (req.includes("350 Intelligence")) {
        return getStatValue("Intelligence") >= 350;
      }
      if (req.includes("200 total quests")) {
        return totalQuests >= 200;
      }
      if (req.includes("Shadow Monarch")) {
        return currentRankIndex <= -1; // Shadow Monarch (special rank)
      }
      if (req.includes("All other shadows")) {
        const otherShadows = SHADOW_UNITS.filter(s => s.name !== shadowName);
        return otherShadows.every(s => unlockedNames.includes(s.name));
      }
      if (req.includes("80-day")) {
        return streak >= 80;
      }
      return false;
    });
  }

  // Auto-unlock shadows when requirements are met
  useEffect(() => {
    SHADOW_UNITS.forEach(shadow => {
      if (!unlockedNames.includes(shadow.name) && checkRequirementsMet(shadow.name)) {
        unlockShadow(shadow.name);
        triggerUnlock(shadow.name, shadowImages[shadow.name] || null);
      }
    });
  }, [stats, streak, questCount, totalQuests, currentRankIndex, unlockedNames, shadowImages]);

  return (
    <div className="min-h-screen w-full bg-system-bg relative pt-16 sm:pt-20 px-3 sm:px-4">
      <div className="container mx-auto flex flex-col items-center gap-6 sm:gap-10">
        <SystemPanel className="w-full max-w-4xl p-4 sm:p-7">
          <h2 className="font-orbitron text-lg sm:text-2xl text-system-blue font-extrabold mb-6">
            Shadow Army Collection
          </h2>
          {loading ? (
            <div className="text-center text-system-blue2 py-10">
              Loading Shadow Army...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {SHADOW_UNITS.map((s) => {
                const isUnlocked = unlockedNames.includes(s.name);
                const permanentImage = shadowImages[s.name] || null;

                return (
                  <div
                    key={s.name}
                    className={`flex flex-col items-center p-2 ${isUnlocked ? "system-panel-glow" : "opacity-60"}`}
                  >
                    <div className="mb-2 sm:mb-3">
                      <ShadowUnitAvatar
                        name={s.name}
                        isUnlocked={isUnlocked}
                        size="md"
                        permanentImage={permanentImage}
                      />
                    </div>
                    <span className={`font-orbitron text-xs sm:text-md ${isUnlocked ? 'text-system-blue' : 'text-system-blue2'}`}>
                      {s.name}
                    </span>
                    <span className="text-[10px] sm:text-xs text-system-blue2 text-center mt-1 line-clamp-2">
                      {getShadowRequirement(s.name)}
                    </span>
                    {isUnlocked ? (
                      <span className="text-[10px] sm:text-xs text-green-400 mt-1">Unlocked</span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-system-blue2">Locked</span>
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
