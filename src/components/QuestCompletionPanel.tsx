
import React from "react";

type Props = {
  QUEST_TYPES: { type: string, label: string, color: string, points: number, statPoints: number, dailyLimit: number }[];
  streak: number;
  dailyQuests: Record<string, number>;
  canCompleteQuest: (type: "easy" | "medium" | "hard") => boolean;
  completeQuest: (type: "easy" | "medium" | "hard") => boolean;
  setSystemNotice: (msg: string) => void;
};

export default function QuestCompletionPanel({
  QUEST_TYPES,
  streak,
  dailyQuests,
  canCompleteQuest,
  completeQuest,
  setSystemNotice,
}: Props) {
  return (
    <div>
      <h3 className="font-orbitron text-xl text-system-blue mb-4">
        <span className="font-bold">The System says...</span> Complete Today's Quests
      </h3>
      <div className="flex flex-col gap-2 mb-3">
        {QUEST_TYPES.map(q => (
          <div key={q.type} className="flex items-center gap-4">
            <button
              className={`glow-button text-base py-1 px-3 flex-1 ${canCompleteQuest(q.type as any) ? '' : 'opacity-30 pointer-events-none'}`}
              style={{ background: q.color }}
              onClick={() => {
                if (completeQuest(q.type as any))
                  setSystemNotice(`Quest completed! +${q.points} points, +${q.statPoints} to stats`);
              }}
            >
              Mark {q.label} Quest Complete
            </button>
            <span className="text-xs text-system-blue2 min-w-[60px]">{dailyQuests[q.type as keyof typeof dailyQuests]}/{q.dailyLimit} today</span>
          </div>
        ))}
      </div>
      <ul className="list-disc pl-5 text-xs text-white/80">
        <li>Streak bonus: <b>{streak >= 14 ? "+40%" : streak >= 7 ? "+25%" : streak >= 3 ? "+10%" : "None"}</b></li>
        <li>Daily quest cap: 5 easy, 3 medium, 2 hard (resets midnight)</li>
      </ul>
    </div>
  );
}
