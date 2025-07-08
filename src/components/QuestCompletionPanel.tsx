import React, { useState } from "react";
type Props = {
  streak: number;
  dailyQuests: Record<string, number>;
  canCompleteQuest: (difficulty: "easy" | "medium" | "hard") => boolean;
  completeQuest: (category: string, difficulty: "easy" | "medium" | "hard") => boolean;
  setSystemNotice: (msg: string) => void;
  QUEST_CATEGORIES: {
    key: string;
    label: string;
  }[];
};
const DIFFICULTIES = [{
  key: "easy",
  label: "Easy",
  color: "#48e18b"
}, {
  key: "medium",
  label: "Medium",
  color: "#f4e95a"
}, {
  key: "hard",
  label: "Hard",
  color: "#ed3434"
}];
export default function QuestCompletionPanel({
  streak,
  dailyQuests,
  canCompleteQuest,
  completeQuest,
  setSystemNotice,
  QUEST_CATEGORIES
}: Props) {
  // Let user pick quest type and difficulty
  const [cat, setCat] = useState(QUEST_CATEGORIES[0].key);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  return <div>
      <h3 className="font-orbitron text-xl text-system-blue mb-4">
         Complete Today's Quests
      </h3>
      <div className="flex gap-2">
        <select className="rounded bg-[#181e28] text-system-blue2 px-2 py-1 flex-1" value={cat} onChange={e => setCat(e.target.value)}>
          {QUEST_CATEGORIES.map(q => <option key={q.key} value={q.key}>{q.label}</option>)}
        </select>
        <select className="rounded bg-[#181e28] text-system-blue2 px-2 py-1 flex-1" value={difficulty} onChange={e => setDifficulty(e.target.value as any)}>
          {DIFFICULTIES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <button className={`glow-button text-base py-1 px-3 flex-1 ${canCompleteQuest(difficulty) ? '' : 'opacity-30 pointer-events-none'}`} style={{
        background: DIFFICULTIES.find(d => d.key === difficulty)?.color
      }} onClick={() => {
        if (completeQuest(cat, difficulty)) setSystemNotice("Quest completed! Check your stat panel for gains.");
      }}>
          Mark Quest Complete
        </button>
        <span className="text-xs text-system-blue2 min-w-[85px]">
          {dailyQuests[difficulty]}/{difficulty === "easy" ? 5 : difficulty === "medium" ? 3 : 2} today
        </span>
      </div>
      <ul className="list-disc pl-5 text-xs text-white/80 mt-2">
        <li>Streak bonus: <b>{streak >= 14 ? "+40%" : streak >= 7 ? "+25%" : streak >= 3 ? "+10%" : "None"}</b></li>
        <li>Daily quest cap: 5 easy, 3 medium, 2 hard</li>
        <li>Stat gain: Based on quest type & difficulty</li>
        <li>Balanced Growth bonus applies when all stats above thresholds</li>
      </ul>
    </div>;
}