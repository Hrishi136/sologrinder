import React, { useState } from "react";
import { useChallengesV2 } from "@/hooks/useChallengesV2";
import { useStreakTracker } from "@/hooks/useStreakTracker";

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
  const { challenges, loading, toggleChallengeCompletion } = useChallengesV2();
  const { trackTodayActivity } = useStreakTracker();
  const [selectedQuestId, setSelectedQuestId] = useState<string>("");
  
  // Get the selected quest details
  const selectedQuest = challenges.find(q => q.id === selectedQuestId) || challenges[0];
  
  // Map categories to difficulty levels
  const getDifficultyFromQuest = (difficulty: string | null): "easy" | "medium" | "hard" => {
    if (!difficulty) return "easy";
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === "hard") return "hard";
    if (lowerDifficulty === "medium") return "medium";
    return "easy";
  };

  const handleQuestComplete = async () => {
    if (!selectedQuest) return;
    
    const difficulty = getDifficultyFromQuest(selectedQuest.difficulty);
    
    if (canCompleteQuest(difficulty)) {
      const success = await toggleChallengeCompletion(selectedQuest.id);
      if (success) {
        // Track daily activity for streak calculation
        await trackTodayActivity();
        // Also call the legacy completeQuest function for stat tracking
        completeQuest(selectedQuest.category || "Combat Training", difficulty);
        setSystemNotice("Quest completed! Check your performance tab for updated stats.");
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
          <li>Balanced Growth bonus applies when all stats above thresholds</li>
        </ul>
      </div>
    );
  }

  const difficulty = getDifficultyFromQuest(selectedQuest?.difficulty);
  const difficultyColor = difficulty === "hard" ? "#ed3434" : difficulty === "medium" ? "#f4e95a" : "#48e18b";

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <h3 className="font-orbitron text-base sm:text-xl text-system-blue mb-2 sm:mb-4 truncate">
        Complete Today's Quests
      </h3>
      
      {/* Quest Selection */}
      <div className="mb-2 sm:mb-3 w-full overflow-hidden">
        <select 
          className="rounded bg-[#181e28] text-system-blue2 px-2 sm:px-3 py-2 w-full text-xs sm:text-base min-h-[44px] truncate" 
          value={selectedQuestId} 
          onChange={e => setSelectedQuestId(e.target.value)}
        >
          {challenges.map(quest => (
            <option key={quest.id} value={quest.id} className="truncate">
              {quest.title?.slice(0, 30)}{quest.title?.length > 30 ? '...' : ''} ({quest.category || "General"})
            </option>
          ))}
        </select>
      </div>

      {/* Complete Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2 sm:mb-3 w-full">
        <button 
          className={`glow-button text-xs sm:text-base py-2 px-2 sm:px-3 flex-1 min-h-[44px] truncate ${
            canCompleteQuest(difficulty) && !selectedQuest?.todayCompleted 
              ? '' 
              : 'opacity-30 pointer-events-none'
          }`} 
          style={{ background: difficultyColor }}
          onClick={handleQuestComplete}
          disabled={selectedQuest?.todayCompleted}
        >
          {selectedQuest?.todayCompleted ? "Completed" : "Complete Quest"}
        </button>
        <span className="text-xs text-system-blue2 text-center sm:text-left whitespace-nowrap flex-shrink-0">
          {dailyQuests[difficulty]}/{difficulty === "easy" ? 5 : difficulty === "medium" ? 3 : 2} today
        </span>
      </div>

      {/* Quest Info */}
      <ul className="list-disc pl-3 sm:pl-5 text-[10px] sm:text-sm text-white/80 space-y-0.5 sm:space-y-1 overflow-hidden">
        {selectedQuest && (
          <li className="truncate pr-2">Quest: <b className="truncate">{selectedQuest.title?.slice(0, 20)}{selectedQuest.title?.length > 20 ? '...' : ''}</b></li>
        )}
        <li className="truncate">Streak: <b>{streak >= 14 ? "+40%" : streak >= 7 ? "+25%" : streak >= 3 ? "+10%" : "None"}</b></li>
        <li className="truncate">Daily cap: 5 easy, 3 med, 2 hard</li>
      </ul>
    </div>
  );
}