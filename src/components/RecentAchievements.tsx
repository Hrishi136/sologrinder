
import React from "react";

type Achievement = {
  name: string;
  timestamp: string;
  type: "title" | "shadow";
};

export default function RecentAchievements({
  achievements,
  streak,
  nextMilestone
}: {
  achievements: Achievement[],
  streak: number,
  nextMilestone: string
}) {
  return (
    <div className="system-panel bg-black/70 border-system-blue2 border-2 rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="font-orbitron flex items-center gap-3 mb-2 text-lg text-system-blue2">
        Recent Achievements
        <span className="ml-auto flex items-center gap-1 text-orange-400 font-bold text-base">{streak}🔥</span>
      </div>
      <ul className="mb-2">
        {achievements.slice(-3).reverse().map((ach, i) => (
          <li key={i} className="text-sm font-orbitron text-system-blue2 flex gap-2 items-center py-0.5">
            <span className="font-bold">{ach.type === "title" ? "🏅" : "👤"}</span>
            <span>{ach.name}</span>
            <span className="ml-auto text-xs text-white/60">{ach.timestamp}</span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-system-blue2 mt-1">
        Next milestone: <span className="text-white">{nextMilestone}</span>
      </div>
    </div>
  );
}
