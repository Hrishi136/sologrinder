
import React from "react";
import SystemPanel from "./SystemPanel";
import QuestCompletionPanel from "./QuestCompletionPanel";
import HunterStatsPanel from "./HunterStatsPanel";
import ShadowArmyPreview from "./ShadowArmyPreview";
import RecentAchievements from "./RecentAchievements";
import { useHunterStats } from "@/hooks/useHunterStats";

interface Props {
  streak: number;
  dailyQuests: Record<string, number>;
  canCompleteQuest: (difficulty: "easy" | "medium" | "hard") => boolean;
  completeQuest: (cat: string, difficulty: "easy" | "medium" | "hard") => boolean;
  setSystemNotice: (msg: string) => void;
  QUEST_CATEGORIES: { key: string, label: string }[];
  stats: any;
  nextRank: any;
  powerLevel: number;
  rankPoints: number;
  daysActive: number;
  shadowArmy: any;
  badges: string[];
  recentAchievements: any[];
  nextMilestone: string;
  handleViewFullArmy: () => void;
  onUserRankClick?: (rank: number) => void;
}

export default function DashboardPanels(props: Props) {
  const { stats: hunterStats, rank } = useHunterStats();

  return (
    <div className="w-full grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
      <SystemPanel className="p-3 sm:p-5 min-h-[200px] sm:min-h-[260px] bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in overflow-hidden">
        <QuestCompletionPanel
          streak={props.streak}
          dailyQuests={props.dailyQuests}
          canCompleteQuest={props.canCompleteQuest}
          completeQuest={props.completeQuest}
          setSystemNotice={props.setSystemNotice}
          QUEST_CATEGORIES={props.QUEST_CATEGORIES}
        />
      </SystemPanel>
      <SystemPanel className="p-3 sm:p-5 min-h-[180px] sm:min-h-[200px] flex flex-col gap-3 sm:gap-4 bg-[#0a0a0a90] border-2 border-system-blue2 shadow-blue-glow animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h3 className="font-orbitron text-system-blue text-base sm:text-lg truncate">Hunter Status</h3>
          <span 
            className="text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: `${rank.color}30`, color: rank.color }}
          >
            {rank.name}
          </span>
        </div>
        <HunterStatsPanel stats={[
          { label: "Power", val: hunterStats.power },
          { label: "XP", val: hunterStats.xp },
          { label: "Resolve", val: hunterStats.resolve }
        ]} />
        {rank.nextRank && (
          <div className="mt-2 text-xs text-white/60">
            Next: {rank.nextRank.name} at {rank.nextRank.xpRequired.toLocaleString()} XP ({Math.floor(rank.progress)}% progress)
          </div>
        )}
      </SystemPanel>
      <ShadowArmyPreview unlocked={props.shadowArmy.unlocked} allShadows={props.shadowArmy.SHADOWS} onViewAll={props.handleViewFullArmy} />
      <RecentAchievements
        achievements={props.recentAchievements}
        streak={props.streak}
        nextMilestone={props.nextMilestone}
      />
    </div>
  );
}
