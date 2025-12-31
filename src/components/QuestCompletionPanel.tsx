import React, { useState } from "react";
import { useChallengesV2 } from "@/hooks/useChallengesV2";
import { useStreakTracker } from "@/hooks/useStreakTracker";
import { Badge } from "@/components/ui/badge";

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

const getDifficultyLimit = (difficulty: string): number => {
  switch (difficulty?.toLowerCase()) {
    case "hard": return 2;
    case "medium": return 3;
    default: return 5;
  }
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case "hard": return "#ed3434";
    case "medium": return "#f4e95a";
    default: return "#48e18b";
  }
};

const getDifficultyLabel = (difficulty: string): string => {
  const d = difficulty?.toLowerCase() || "easy";
  return d.charAt(0).toUpperCase() + d.slice(1);
};

export default function QuestCompletionPanel({
  streak,
  dailyQuests,
  canCompleteQuest,
  completeQuest,
  setSystemNotice,
  QUEST_CATEGORIES
}: Props) {
  const { challenges, loading, completeChallenge } = useChallengesV2();
  const { trackTodayActivity } = useStreakTracker();
  const [selectedQuestId, setSelectedQuestId] = useState<string>("");
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Get the selected quest details
  const selectedQuest = challenges.find(q => q.id === selectedQuestId) || challenges[0];
  
  const handleQuestComplete = async () => {
    if (!selectedQuest || isCompleting) return;
    
    const difficulty = selectedQuest.difficulty?.toLowerCase() as "easy" | "medium" | "hard" || "easy";
    const dailyLimit = getDifficultyLimit(difficulty);
    
    // Check if under daily limit
    if (selectedQuest.completionsToday < dailyLimit) {
      setIsCompleting(true);
      try {
        const success = await completeChallenge(selectedQuest.id);
        if (success) {
          await trackTodayActivity();
          completeQuest(selectedQuest.category || "Combat Training", difficulty);
          setSystemNotice("Quest completed! Check your performance tab for updated stats.");
        }
      } finally {
        setIsCompleting(false);
      }
    }
  };

  if (loading) {
    return <div className="text-system-blue2">Loading quests...</div>;
  }

  if (challenges.length === 0) {
    return (
      <div>
        <h3 className="font-orbitron text-xl text-system-blue mb-4">
          Complete Today's Quests
        </h3>
        <p className="text-system-blue2 mb-4">No quests available. Create some quests in the Quests section first.</p>
        <ul className="list-disc pl-5 text-xs text-white/80">
          <li>Streak bonus: <b>{streak >= 14 ? "+40%" : streak >= 7 ? "+25%" : streak >= 3 ? "+10%" : "None"}</b></li>
          <li>Daily quest cap: 5 easy, 3 medium, 2 hard</li>
          <li>Stat gain: Based on quest type & difficulty</li>
        </ul>
      </div>
    );
  }

  const difficulty = selectedQuest?.difficulty?.toLowerCase() || "easy";
  const difficultyColor = getDifficultyColor(difficulty);
  const dailyLimit = getDifficultyLimit(difficulty);
  const completedToday = selectedQuest?.completionsToday || 0;
  const canComplete = completedToday < dailyLimit && !isCompleting;

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <h3 className="font-orbitron text-base sm:text-xl text-system-blue mb-2 sm:mb-4 truncate">
        Complete Today's Quests
      </h3>
      
      {/* Current Quest Label */}
      <div className="mb-2">
        <span className="text-xs text-white/60 uppercase tracking-wider">Current Quest</span>
      </div>
      
      {/* Quest Selection with Difficulty Badge */}
      <div className="mb-3 sm:mb-4 w-full overflow-hidden">
        <div className="flex flex-col gap-2">
          <select 
            className="rounded bg-[#181e28] text-system-blue2 px-2 sm:px-3 py-2 w-full text-xs sm:text-base min-h-[44px]" 
            value={selectedQuestId || selectedQuest?.id || ""} 
            onChange={e => setSelectedQuestId(e.target.value)}
          >
            {challenges.map(quest => (
              <option key={quest.id} value={quest.id}>
                {quest.title} — {quest.category || "General"} ({getDifficultyLabel(quest.difficulty || "easy")})
              </option>
            ))}
          </select>
          
          {/* Difficulty Badge */}
          {selectedQuest && (
            <div className="flex items-center gap-2">
              <Badge 
                className="text-xs px-2 py-1"
                style={{ 
                  backgroundColor: `${difficultyColor}20`, 
                  color: difficultyColor,
                  borderColor: difficultyColor 
                }}
              >
                {getDifficultyLabel(difficulty)} Difficulty
              </Badge>
              <span className="text-xs text-white/60">
                {completedToday}/{dailyLimit} today
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex flex-col gap-2 mb-3 w-full">
        <button 
          className={`glow-button text-xs sm:text-base py-3 px-4 w-full min-h-[48px] font-bold ${
            canComplete ? '' : 'opacity-30 pointer-events-none'
          }`} 
          style={{ background: difficultyColor }}
          onClick={handleQuestComplete}
          disabled={!canComplete || isCompleting}
        >
          {isCompleting ? "Completing..." : canComplete ? "Complete Quest" : "Daily Limit Reached"}
        </button>
      </div>

      {/* Quest Info */}
      <ul className="list-disc pl-3 sm:pl-5 text-[10px] sm:text-sm text-white/80 space-y-0.5 sm:space-y-1">
        <li>Streak: <b>{selectedQuest?.streak || 0} days</b></li>
        <li>Streak bonus: <b>{streak >= 14 ? "+40%" : streak >= 7 ? "+25%" : streak >= 3 ? "+10%" : "None"}</b></li>
      </ul>
    </div>
  );
}