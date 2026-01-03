import React from "react";
import ShadowCard from "./ShadowCard";

const categoryConfig = [
  { key: "basic", name: "Basic Shadows", emoji: "📱", range: [0, 3] as const },
  { key: "elite", name: "Elite Shadows", emoji: "⚔️", range: [3, 6] as const },
  { key: "marshal", name: "Marshal Shadows", emoji: "👑", range: [6, 9] as const },
  { key: "legendary", name: "Legendary", emoji: "🌟", range: [9, 12] as const }
];

interface ShadowArmyGridProps {
  allShadows: Array<{
    name: string;
    tier: number;
    unlocked?: boolean;
    description?: string;
    power?: number;
    abilities?: string;
    unlockDate?: string;
  }>;
}

export default function ShadowArmyGrid({ allShadows }: ShadowArmyGridProps) {
  const [category, setCategory] = React.useState("basic");
  const cat = categoryConfig.find(c => c.key === category);

  // Select shadows corresponding to the current tab category
  const shownShadows = cat ? allShadows.slice(cat.range[0], cat.range[1]) : [];

  return (
    <div className="bg-black/80 rounded-xl border-2 border-system-blue2 shadow-lg p-6 min-h-[414px]">
      <div className="flex gap-2 mb-6 flex-wrap">
        {categoryConfig.map(tab => (
          <button
            key={tab.key}
            className={`px-3 py-1 rounded-lg font-orbitron text-sm 
              ${category === tab.key
                ? "bg-system-blue2/70 text-white font-bold"
                : "bg-system-blue/10 text-system-blue2 hover:bg-system-blue2/10"
              } transition`}
            onClick={() => setCategory(tab.key)}
          >
            <span>{tab.emoji}</span> {tab.name}
          </button>
        ))}
      </div>
      {/* Army Formation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {shownShadows.map((shadow) => (
          <ShadowCard key={shadow.name} shadow={shadow} />
        ))}
      </div>
    </div>
  );
}
