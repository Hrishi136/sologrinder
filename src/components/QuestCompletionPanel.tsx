import React, { useState } from "react";
import { useChallengesV2 } from "@/hooks/useChallengesV2";

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
  const [selectedQuestId, setSelectedQuestId] = useState<string>("");
  
  // Get the selected quest details
  const selectedQuest = challenges.find(q => q.id === selectedQuestId) || challenges[0];
  
  // Map categories to difficulty levels
  const getDifficultyFromCategory = (category: string | null): "easy" | "medium" | "hard" => {
    if (!category) return "easy";
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("hard") || lowerCategory.includes("intense") || lowerCategory.includes("extreme")) return "hard";
    if (lowerCategory.includes("medium") || lowerCategory.includes("moderate") || lowerCategory.includes("intermediate")) return "medium";
    return "easy";
  };

  const handleQuestComplete = async () => {
    if (!selectedQuest) return;
    
    const difficulty = getDifficultyFromCategory(selectedQuest.category);
    
    if (canCompleteQuest(difficulty)) {
      const success = await toggleChallengeCompletion(selectedQuest.id);
      if (success) {
        // Also call the legacy completeQuest function for stat tracking
        completeQuest(selectedQuest.category || "Combat Training", difficulty);
        setSystemNotice("Quest completed! Check your stat panel for gains.");
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

  const difficulty = getDifficultyFromCategory(selectedQuest?.category);
  const difficultyColor = difficulty === "hard" ? "#ed3434" : difficulty === "medium" ? "#f4e95a" : "#48e18b";

  return (
    <div>
      <h3 className="font-orbitron text-xl text-system-blue mb-4">
        Complete Today's Quests
      </h3>
      
      {/* Quest Selection */}
      <div className="mb-3">
        <select 
          className="rounded bg-[#181e28] text-system-blue2 px-2 py-1 w-full" 
          value={selectedQuestId} 
          onChange={e => setSelectedQuestId(e.target.value)}
        >
          {challenges.map(quest => (
            <option key={quest.id} value={quest.id}>
              {quest.title} ({quest.category || "General"})
            </option>
          ))}
        </select>
      </div>

      {/* Complete Button */}
      <div className="flex items-center gap-4 mb-3">
        <button 
          className={`glow-button text-base py-1 px-3 flex-1 ${
            canCompleteQuest(difficulty) && !selectedQuest?.todayCompleted 
              ? '' 
              : 'opacity-30 pointer-events-none'
          }`} 
          style={{ background: difficultyColor }}
          onClick={handleQuestComplete}
          disabled={selectedQuest?.todayCompleted}
        >
          {selectedQuest?.todayCompleted ? "Quest Completed Today" : "Mark Quest Complete"}
        </button>
        <span className="text-xs text-system-blue2 min-w-[85px]">
          {dailyQuests[difficulty]}/{difficulty === "easy" ? 5 : difficulty === "medium" ? 3 : 2} today
        </span>
      </div>

      {/* Quest Info */}
      <ul className="list-disc pl-5 text-xs text-white/80">
        {selectedQuest && (
          <li>Current Quest: <b>{selectedQuest.title}</b> - {selectedQuest.category || "General"} ({difficulty})</li>
        )}
        <li>Streak bonus: <b>{streak >= 14 ? "+40%" : streak >= 7 ? "+25%" : streak >= 3 ? "+10%" : "None"}</b></li>
        <li>Daily quest cap: 5 easy, 3 medium, 2 hard</li>
        <li>Stat gain: Based on quest type & difficulty</li>
        <li>Balanced Growth bonus applies when all stats above thresholds</li>
      </ul>
    </div>
  );
}