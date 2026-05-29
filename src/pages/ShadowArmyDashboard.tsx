
import React from "react";
import ShadowArmyGrid from "../components/ShadowArmyGrid";
import ArmyStatsPanel from "../components/ArmyStatsPanel";
import { useNavigate } from "react-router-dom";
import ProfileButton from "@/components/ProfileButton";
import { useShadowArmy } from "@/hooks/useShadowArmy";
import { SHADOW_SOLDIERS } from "@/hooks/useHunterProgression";

// Shadow power values by tier
const SHADOW_POWER: Record<string, number> = {
  "Iron Soldier": 30,
  "Scout": 18,
  "Mage": 26,
  "Knight": 54,
  "Assassin": 40,
  "Healer": 38,
  "Tank": 67,
  "Archer": 33,
  "Iron": 61,
  "Igris": 110,
  "Beru": 115,
  "Bellion": 125
};

// Shadow abilities
const SHADOW_ABILITIES: Record<string, string> = {
  "Iron Soldier": "Reliable vanguard. Slight quest XP bonus.",
  "Scout": "Uncovers daily quest bonuses.",
  "Mage": "Adds +3 INT to all Intelligence quests.",
  "Knight": "Bonus vs elite quests. +5 STR.",
  "Assassin": "Stealth quest rewards increased.",
  "Healer": "Heals one fail per week.",
  "Tank": "Shields all shadows from first failure.",
  "Archer": "Quest streaks last +2 days.",
  "Iron": "Quest XP bonus after defeat.",
  "Igris": "Double rewards on S+ quests.",
  "Beru": "Antimatter powers, absorbs enemy weaknesses.",
  "Bellion": "Unlocks special army formation bonus."
};

export default function ShadowArmyDashboard() {
  const { unlocked, SHADOWS, shadowImages } = useShadowArmy();
  const navigate = useNavigate();

  // Build shadows array from hook data - all start locked
  const allShadows = SHADOWS.map(shadow => ({
    name: shadow.name,
    tier: shadow.tier,
    power: SHADOW_POWER[shadow.name] || 30,
    abilities: SHADOW_ABILITIES[shadow.name] || "Unknown abilities.",
    unlockDate: null,
    unlocked: unlocked.includes(shadow.name),
    description: `${shadow.tier === 4 ? 'Legendary' : shadow.tier === 3 ? 'Marshal' : shadow.tier === 2 ? 'Elite' : 'Basic'} shadow.`,
    requirements: SHADOW_SOLDIERS.find(s => s.name === shadow.name)?.reqs || []
  }));

  const armyUnlocked = allShadows.filter(s => s.unlocked).length;
  const armyPower = allShadows.filter(s => s.unlocked).reduce((a, s) => a + s.power, 0);
  const nextUnlock = allShadows.find(s => !s.unlocked);

  return (
    <div className="min-h-screen w-full bg-system-bg flex flex-col items-center font-orbitron animate-fade-in pt-24 pb-24">
      <ProfileButton />
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-4">
        <div>
          <h1 className="text-2xl text-system-blue2 font-bold flex items-center gap-2">
            Shadow Army Management
            <span className="text-xs font-semibold px-3 py-1 rounded bg-system-blue/10 ml-3 border border-system-blue2">{armyUnlocked}/{SHADOWS.length} Shadows</span>
          </h1>
        </div>
        <button
          className="glow-button bg-system-blue2/80 hover:bg-system-blue2 text-white text-base px-5 py-2 rounded-lg"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-8 w-full max-w-5xl px-4">
        <div className="flex-1">
          <ShadowArmyGrid allShadows={allShadows} />
        </div>
        <div className="w-full md:w-80">
          <ArmyStatsPanel
            armyPower={armyPower}
            completion={`${armyUnlocked}/${SHADOWS.length}`}
            nextUnlock={nextUnlock}
          />
        </div>
      </div>
    </div>
  );
}
