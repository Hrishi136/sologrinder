
import React from "react";
import ShadowArmyGrid from "../components/ShadowArmyGrid";
import ArmyStatsPanel from "../components/ArmyStatsPanel";
import { useNavigate } from "react-router-dom";
import ProfileButton from "@/components/ProfileButton";

export default function ShadowArmyDashboard() {
  // Mock data: for now, static, in future use real progression
  const allShadows = [
    { name: "Iron Soldier", tier: 1, power: 30, abilities: "Reliable vanguard. Slight quest XP bonus.", unlockDate: "2025-06-12", unlocked: true, description: "Basic tank; always loyal to your cause." },
    { name: "Scout", tier: 1, power: 18, abilities: "Uncovers daily quest bonuses.", unlockDate: "2025-06-13", unlocked: true, description: "Fast and nimble. Finds hidden rewards." },
    { name: "Mage", tier: 1, power: 26, abilities: "Adds +3 INT to all Intelligence quests.", unlockDate: "2025-06-15", unlocked: false, description: "Arcane specialist with high magic potential." },
    { name: "Worker", tier: 1, power: 20, abilities: "Reduces all cooldowns by 1h.", unlockDate: null, unlocked: false, description: "Efficient and steady, never tires." },
    { name: "Knight", tier: 2, power: 54, abilities: "Bonus vs elite quests. +5 STR.", unlockDate: null, unlocked: false, description: "Noble defender with tactical leadership." },
    { name: "Assassin", tier: 2, power: 40, abilities: "Stealth quest rewards increased.", unlockDate: null, unlocked: false, description: "Deadly and silent, master of shadows." },
    { name: "Healer", tier: 2, power: 38, abilities: "Heals one fail per week.", unlockDate: null, unlocked: false, description: "Restores stamina of the army." },
    { name: "Archer", tier: 2, power: 33, abilities: "Quest streaks last +2 days.", unlockDate: null, unlocked: false, description: "Long-range support increasing accuracy." },
    { name: "Tank", tier: 3, power: 67, abilities: "Shields all shadows from first failure.", unlockDate: null, unlocked: false, description: "Massive presence on the battlefield." },
    { name: "Berserker", tier: 3, power: 61, abilities: "Quest XP bonus after defeat.", unlockDate: null, unlocked: false, description: "Unleashes fury after setbacks." },
    { name: "Igris", tier: 4, power: 110, abilities: "Double rewards on S+ quests.", unlockDate: null, unlocked: false, description: "Marshal of the red legion, renowned general." },
    { name: "Bellion", tier: 4, power: 125, abilities: "Unlocks special army formation bonus.", unlockDate: null, unlocked: false, description: "Legend among shadows; commands all others." }
  ];

  const armyUnlocked = allShadows.filter(s => s.unlocked).length;
  const armyPower = allShadows.filter(s => s.unlocked).reduce((a, s) => a + s.power, 0);
  const nextUnlock = allShadows.find(s => !s.unlocked);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-system-bg flex flex-col items-center font-orbitron animate-fade-in pt-24 pb-24">
      <ProfileButton />
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-4">
        <div>
          <h1 className="text-2xl text-system-blue2 font-bold flex items-center gap-2">
            Shadow Army Management
            <span className="text-xs font-semibold px-3 py-1 rounded bg-system-blue/10 ml-3 border border-system-blue2">{armyUnlocked}/12 Shadows</span>
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
            completion={`${armyUnlocked}/12`}
            nextUnlock={nextUnlock}
          />
        </div>
      </div>
    </div>
  );
}
