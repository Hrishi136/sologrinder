
import React from "react";
import ShadowCard from "./ShadowCard";

const categoryConfig = [
  { key: "basic", name: "Basic Shadows", emoji: "📱", range: [0, 4] },
  { key: "elite", name: "Elite Shadows", emoji: "⚔️", range: [4, 8] },
  { key: "marshal", name: "Marshal Shadows", emoji: "👑", range: [8, 11] },
  { key: "legendary", name: "Legendary", emoji: "🌟", range: [11, 12] }
];

export default function ShadowArmyGrid({ allShadows }: { allShadows: any[] }) {
  const [category, setCategory] = React.useState("basic");
  const cat = categoryConfig.find(c => c.key === category);

  // Select shadows corresponding to the current tab category
  const shownShadows = allShadows.slice(cat.range[0], cat.range[1]);

  return (
    <div className="bg-black/80 rounded-xl border-2 border-system-blue2 shadow-lg p-6 min-h-[414px]">
      <div className="flex gap-2 mb-6">
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
      <div className="grid grid-cols-4 gap-5">
        {shownShadows.map((shadow, i) => (
          <ShadowCard key={shadow.name} shadow={shadow} />
        ))}
      </div>
    </div>
  );
}
